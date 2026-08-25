import { describe, it, expect, vi, beforeEach } from "vitest";

// La regla de visibilidad decide que ve cada cohorte, y hasta este test no
// tenia ninguna cobertura: vivia inline en un handler de ruta. El caso que mas
// importa es el default DESPUES de migrar, porque es bloqueado -- un modulo
// recien agregado no aparece hasta que alguien lo habilita, y eso explica que
// un modulo pueda medir cero visitas sin que nadie lo haya salteado.

const settings = { docs: [] as { cohort?: number; slug: string; enabled: boolean }[] };
const cohortConfig = { migrated: false };
const usuario = { cohort: 1 as number | undefined };

vi.mock("@/lib/models/ModuleSettings", () => ({
  default: {
    find: (q: { cohort?: number; enabled?: boolean }) => ({
      lean: async () =>
        settings.docs.filter(
          (d) =>
            (q.cohort === undefined || d.cohort === q.cohort) &&
            (q.enabled === undefined || d.enabled === q.enabled),
        ),
    }),
  },
}));

vi.mock("@/lib/models/User", () => ({
  default: { findById: () => ({ select: () => ({ lean: async () => usuario }) }) },
}));

vi.mock("@/lib/models/CohortConfig", () => ({
  readCohortConfig: async () => ({ activeCohort: 1, cohortCount: 2, migrated: cohortConfig.migrated }),
}));

vi.mock("@/data/modules", () => ({
  ALL_MODULES: [
    { slug: "viejo-habilitado" },
    { slug: "viejo-apagado" },
    { slug: "recien-agregado" },
  ],
}));

const { slugsVisiblesPara } = await import("./moduleVisibility");

const alumno = { id: "u1", role: "student" };
const profe = { id: "t1", role: "teacher" };

beforeEach(() => {
  settings.docs = [];
  cohortConfig.migrated = false;
  usuario.cohort = 1;
});

describe("visibilidad de modulos por cohorte", () => {
  it("el profesor ve todos, incluso los que ninguna cohorte tiene habilitados", async () => {
    cohortConfig.migrated = true;
    settings.docs = [{ cohort: 1, slug: "viejo-habilitado", enabled: true }];

    const { enabledSlugs } = await slugsVisiblesPara(profe);

    expect(enabledSlugs).toEqual(["viejo-habilitado", "viejo-apagado", "recien-agregado"]);
  });

  it("sin migrar, todo es visible salvo lo apagado explicitamente", async () => {
    cohortConfig.migrated = false;
    settings.docs = [{ slug: "viejo-apagado", enabled: false }];

    const { enabledSlugs } = await slugsVisiblesPara(alumno);

    // `recien-agregado` no tiene doc y IGUAL se ve: ese es el contrato legacy.
    expect(enabledSlugs).toEqual(["viejo-habilitado", "recien-agregado"]);
  });

  it("migrado, un modulo sin ajuste queda BLOQUEADO en vez de visible", async () => {
    cohortConfig.migrated = true;
    settings.docs = [{ cohort: 1, slug: "viejo-habilitado", enabled: true }];

    const { enabledSlugs, cohort } = await slugsVisiblesPara(alumno);

    // Exactamente el reverso del caso legacy de arriba, y la unica diferencia
    // es haber migrado. Un modulo agregado despues de configurar la cohorte
    // mide cero visitas porque nadie lo ve, no porque lo salteen.
    expect(enabledSlugs).toEqual(["viejo-habilitado"]);
    expect(enabledSlugs).not.toContain("recien-agregado");
    expect(cohort).toBe(1);
  });

  it("migrado, cada cohorte ve solo lo suyo", async () => {
    cohortConfig.migrated = true;
    usuario.cohort = 2;
    settings.docs = [
      { cohort: 1, slug: "viejo-habilitado", enabled: true },
      { cohort: 2, slug: "recien-agregado", enabled: true },
    ];

    const { enabledSlugs, cohort } = await slugsVisiblesPara(alumno);

    expect(enabledSlugs).toEqual(["recien-agregado"]);
    expect(cohort).toBe(2);
  });

  it("migrado, un alumno sin cohorte cae en la 1 en vez de quedarse sin nada", async () => {
    cohortConfig.migrated = true;
    usuario.cohort = undefined;
    settings.docs = [{ cohort: 1, slug: "viejo-habilitado", enabled: true }];

    const { enabledSlugs, cohort } = await slugsVisiblesPara(alumno);

    expect(cohort).toBe(1);
    expect(enabledSlugs).toEqual(["viejo-habilitado"]);
  });

  it("respeta el orden del curriculum, no el orden de los ajustes", async () => {
    cohortConfig.migrated = true;
    settings.docs = [
      { cohort: 1, slug: "recien-agregado", enabled: true },
      { cohort: 1, slug: "viejo-habilitado", enabled: true },
    ];

    const { enabledSlugs } = await slugsVisiblesPara(alumno);

    expect(enabledSlugs).toEqual(["viejo-habilitado", "recien-agregado"]);
  });
});
