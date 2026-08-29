import type { DojoType } from "@/types";
import { ALL_MODULES } from "@/data/modules";
import User from "@/lib/models/User";
import Progress from "@/lib/models/Progress";
import ModuleSettings from "@/lib/models/ModuleSettings";
import Certificate from "@/lib/models/Certificate";
import {
  elegibilidadDe,
  esCertificable,
  modulosObligatoriosDe,
  type Elegibilidad,
  type Certificabilidad,
} from "@/lib/certificados";

/**
 * The roster behind the teacher's certificate view.
 *
 * ## Why this exists instead of a loop over `esElegible`
 *
 * `esElegible(userId, dojo)` is the right function for ONE student and the
 * wrong one for a roster: it reads the user, the cohort's enabled modules and
 * the progress rows separately, every time. Over 35 students that is 105 round
 * trips to answer one screen, and it grows with the class.
 *
 * So this reads in batches and then calls `elegibilidadDe` -- the SAME pure
 * function `esElegible` calls, not a second copy of the rule. That distinction
 * is the whole point: a re-implementation that drifted would show the teacher a
 * roster that disagrees with what the award endpoint will do, and the
 * disagreement would surface as an award that "mysteriously" refuses.
 */

/** One student's standing for one track. */
export interface FilaDelPanel {
  userId: string;
  nombre: string;
  email: string;
  cohort: number;
  elegibilidad: Elegibilidad;
  /** Already awarded. The teacher needs to stop looking at these. */
  yaCertificado: boolean;
  /** Exercises still missing across every required module. 0 when eligible. */
  faltan: number;
  /** Exercises the track demands in total. The denominator, always shown. */
  exigidos: number;
  /**
   * Of the modules with gaps, the ones this cohort has NOT been given yet.
   *
   * Kept at the top level rather than left inside `elegibilidad` because it is
   * the column that changes what the teacher does: "this student is behind" is
   * a conversation with the student, "the course has not got there" is a
   * conversation with the calendar.
   */
  aunNoHabilitados: string[];
}

export type Panel =
  | { certificable: false; dojo: DojoType; detalle: Certificabilidad }
  | {
      certificable: true;
      dojo: DojoType;
      /** Required module slugs, in curriculum order. */
      modulos: string[];
      exigidos: number;
      filas: FilaDelPanel[];
      resumen: ResumenDelPanel;
    };

/**
 * Los titulares de la vista.
 *
 * Viven ACA y no en la pagina porque `puedenRecibirlo` es el numero que decide
 * si el profesor abre la pantalla, y un numero que decide algo tiene que tener
 * un guard. Derivarlo en el JSX lo dejaba fuera de la suite -- que es
 * exactamente como se colo contando a los que YA lo tienen, prometiendo trabajo
 * que no existe.
 */
export interface ResumenDelPanel {
  alumnos: number;
  /** Elegibles que TODAVIA NO lo tienen: sobre estos hay algo que hacer. */
  puedenRecibirlo: number;
  yaLoTienen: number;
}

/**
 * Reads the whole roster for one track.
 *
 * Ordering is by distance -- fewest missing exercises first -- and NOT by a
 * "close enough" threshold. No such threshold is invented here: the platform
 * already carries one rule nobody chose (an exercise completes at 70 %, which
 * makes partial credit complete), and adding a second invented cutoff would
 * hide students behind a number the instructor never picked. The distance is
 * shown; who is worth a click is the teacher's call.
 */
export async function panelDeCertificados(dojo: DojoType): Promise<Panel> {
  const cert = esCertificable(dojo);
  if (!cert.certificable) {
    // Short-circuits before any database work, exactly like `esElegible`: an
    // unclassified track can never award, so its roster answers nothing.
    return { certificable: false, dojo, detalle: cert };
  }

  const exigidosSlugs = modulosObligatoriosDe(ALL_MODULES, dojo);
  const modulosExigidos = ALL_MODULES.filter((m) => exigidosSlugs.includes(m.slug));
  const exigidos = modulosExigidos.reduce((n, m) => n + m.exercises.length, 0);

  // ---- lectura 1: los alumnos
  const alumnos = await User.find({ role: "student" })
    .select("name email cohort")
    .lean();

  if (alumnos.length === 0) {
    return {
      certificable: true,
      dojo,
      modulos: exigidosSlugs,
      exigidos,
      filas: [],
      resumen: { alumnos: 0, puedenRecibirlo: 0, yaLoTienen: 0 },
    };
  }

  const ids = alumnos.map((a) => a._id);
  const cohortes = [...new Set(alumnos.map((a) => a.cohort ?? 1))];

  // ---- lectura 2: que tiene habilitado CADA cohorte presente, de una vez
  const settings = await ModuleSettings.find({
    cohort: { $in: cohortes },
    enabled: true,
  })
    .select("slug cohort")
    .lean();

  const habilitadosPorCohorte = new Map<number, string[]>();
  for (const c of cohortes) {
    const abiertos = new Set(
      settings.filter((s) => s.cohort === c).map((s) => s.slug),
    );
    // En orden de curriculum, igual que `slugsHabilitadosParaCohorte`.
    habilitadosPorCohorte.set(
      c,
      ALL_MODULES.filter((m) => abiertos.has(m.slug)).map((m) => m.slug),
    );
  }

  // ---- lectura 3: el progreso completado de todos, acotado a lo exigido
  const docs = await Progress.find({
    userId: { $in: ids },
    moduleId: { $in: exigidosSlugs },
    completed: true,
  })
    .select("userId moduleId exerciseId")
    .lean();

  const completadosPorAlumno = new Map<string, Map<string, Set<string>>>();
  for (const d of docs) {
    const uid = String(d.userId);
    const porModulo = completadosPorAlumno.get(uid) ?? new Map<string, Set<string>>();
    const set = porModulo.get(d.moduleId) ?? new Set<string>();
    set.add(d.exerciseId);
    porModulo.set(d.moduleId, set);
    completadosPorAlumno.set(uid, porModulo);
  }

  // ---- lectura 4: quien ya tiene el certificado de esta ruta
  const otorgados = await Certificate.find({ userId: { $in: ids }, dojo })
    .select("userId")
    .lean();
  const yaTienen = new Set(otorgados.map((c) => String(c.userId)));

  const filas: FilaDelPanel[] = alumnos.map((a) => {
    const uid = String(a._id);
    const cohort = a.cohort ?? 1;
    const elegibilidad = elegibilidadDe(
      ALL_MODULES,
      dojo,
      cohort,
      habilitadosPorCohorte.get(cohort) ?? [],
      completadosPorAlumno.get(uid) ?? new Map(),
    );

    const faltantes =
      !elegibilidad.elegible && elegibilidad.motivo === "faltan-ejercicios"
        ? elegibilidad.faltantes
        : {};

    return {
      userId: uid,
      nombre: a.name ?? "",
      email: a.email ?? "",
      cohort,
      elegibilidad,
      yaCertificado: yaTienen.has(uid),
      faltan: Object.values(faltantes).reduce((n, ids) => n + ids.length, 0),
      exigidos,
      aunNoHabilitados:
        !elegibilidad.elegible && elegibilidad.motivo === "faltan-ejercicios"
          ? elegibilidad.aunNoHabilitados
          : [],
    };
  });

  // Elegibles primero, despues por distancia. Dentro de un empate, por nombre,
  // para que la lista no baile entre recargas.
  filas.sort((x, y) => {
    if (x.elegibilidad.elegible !== y.elegibilidad.elegible) {
      return x.elegibilidad.elegible ? -1 : 1;
    }
    if (x.faltan !== y.faltan) return x.faltan - y.faltan;
    return x.nombre.localeCompare(y.nombre, "es");
  });

  return {
    certificable: true,
    dojo,
    modulos: exigidosSlugs,
    exigidos,
    filas,
    resumen: {
      alumnos: filas.length,
      puedenRecibirlo: filas.filter((f) => f.elegibilidad.elegible && !f.yaCertificado).length,
      yaLoTienen: filas.filter((f) => f.yaCertificado).length,
    },
  };
}
