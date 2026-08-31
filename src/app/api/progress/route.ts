import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Progress from "@/lib/models/Progress";
import User from "@/lib/models/User";
import { ALL_MODULES } from "@/data/modules";
import { calificar, esSoloCliente } from "@/lib/calificar";
import { parserHtmlServidor } from "@/lib/parserHtmlServidor";
import GradeMismatch from "@/lib/models/GradeMismatch";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  const progress = await Progress.find({ userId: session.id }).lean();
  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await dbConnect();
  const body = await request.json();
  const moduleId = body.moduleId ?? body.moduleSlug;
  const { exerciseId, exerciseType, userAnswer } = body;

  // `body.score` NO se desestructura junto al resto a proposito: no decide
  // nada. Se lee una sola vez, mas abajo, y solo para compararlo con el que
  // calcula el servidor y registrar la discrepancia.
  const scoreCliente = typeof body.score === "number" ? body.score : null;

  const mod = ALL_MODULES.find((m) => m.slug === moduleId);
  const exercise = mod?.exercises.find((e) => e.id === exerciseId);

  // Un par que el curriculum no declara no puede corregirse, asi que tampoco
  // puede completarse. Antes se escribia un Progress igual, con el score que
  // viniera en el body.
  if (!exercise) {
    return NextResponse.json(
      { error: "Ejercicio no encontrado" },
      { status: 400 }
    );
  }

  const maxXP = exercise.xpReward;

  // EL SERVIDOR CORRIGE. Hasta este cambio la linea era
  // `const isCompleted = score >= 70` con el score del navegador, y un `fetch`
  // desde la consola completaba cualquier ejercicio -- lo que desde que existen
  // los certificados significaba otorgarse la credencial entera.
  //
  // `calificar` es el MISMO modulo que usa el componente del ejercicio, no una
  // segunda implementacion: un corrector de servidor mas estricto rechazaria en
  // silencio a alumnos que resolvieron bien.
  const calificacion = calificar(exercise, userAnswer, parserHtmlServidor);

  // Un corrector que no pudo corregir no otorga nada. Nunca un 500 en la cara
  // del alumno a mitad del ejercicio.
  const score = calificacion.calificable ? calificacion.score : 0;

  // LA EXCEPCION, y por que esta atada a `esSoloCliente` y no a otra cosa.
  //
  // Los cuatro ejercicios `js-behavior` corren el JS del alumno en un Worker y
  // no tienen equivalente en el servidor. La decision del instructor fue que
  // SIGUIERAN corrigiendose en el cliente; la implementacion les aplico la regla
  // de "no calificable no otorga nada" y los volvio IMPOSIBLES de completar:
  // medido, `isCompleted` daba false para los cuatro escribiera lo que
  // escribiera el alumno, y estuvo asi tres dias en produccion.
  //
  // Va contra `esSoloCliente` -la lista enumerada que un guard de curriculum ya
  // fija en exactamente esos cuatro- y NO contra `validation.type` ni contra
  // nada que venga en el body. Asi la puerta no se ensancha sola: un tipo de
  // validacion nuevo cae en el default, que no otorga nada, hasta que alguien lo
  // agregue a la lista a proposito.
  //
  // EL PRECIO, dicho: para esos cuatro un alumno puede forjar la completitud
  // desde la consola. Es el trato que ya se acepto -el track js no declara
  // `nivel`, asi que no certifica-. SI ALGUN DIA SE CLASIFICA ESE TRACK, esto
  // pasa a ser un bloqueante de esa clasificacion.
  const completaEnCliente = !calificacion.calificable && esSoloCliente(exercise);

  // Se completa cuando esta COMPLETO. El umbral viejo era `score >= 70`, y nadie
  // eligio ese numero para lo que hacia: salia de un corte fijo chocando con un
  // score proporcional. Medido antes de sacarlo: 63 de los 92 ejercicios
  // `css-rules` de CSS completaban con una declaracion faltante, y 47 de esos
  // estan en modulos OBLIGATORIOS, o sea que el certificado se podia ganar
  // dejando declaraciones sin escribir.
  const isCompleted = calificacion.calificable
    ? score === 100
    : completaEnCliente && scoreCliente === 100;
  const xpToAward = isCompleted ? maxXP : 0;

  // Check if already completed BEFORE updating
  const existing = await Progress.findOne({
    userId: session.id,
    moduleId,
    exerciseId,
  }).lean();

  const wasAlreadyCompleted = existing?.completed === true;

  // Update progress - keep best score, don't un-complete
  await Progress.findOneAndUpdate(
    { userId: session.id, moduleId, exerciseId },
    {
      $set: {
        exerciseType,
        completed: isCompleted || wasAlreadyCompleted,
        score: wasAlreadyCompleted ? Math.max(existing.score ?? 0, score) : score,
        xpEarned: maxXP,
        userAnswer,
        lastAttemptAt: new Date(),
        ...(isCompleted && !wasAlreadyCompleted ? { completedAt: new Date() } : {}),
      },
      $inc: { attempts: 1 },
    },
    { upsert: true, new: true }
  );

  // La discrepancia se registra DESPUES de persistir, para que un fallo
  // escribiendo el registro no le pierda el progreso al alumno.
  if (scoreCliente !== null && scoreCliente !== score) {
    try {
      await GradeMismatch.create({
        userId: session.id,
        moduleId,
        exerciseId,
        scoreCliente,
        scoreServidor: score,
        ...(calificacion.calificable ? {} : { motivo: calificacion.motivo }),
        cuando: new Date(),
      });
    } catch {
      // Registrar es diagnostico, no parte del contrato con el alumno.
    }
  }

  let userXP = 0;
  let userStreak = 0;

  // ONLY award XP on FIRST completion - never again
  if (isCompleted && !wasAlreadyCompleted) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await User.findById(session.id);
    if (user) {
      user.xp += xpToAward;

      const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
      if (lastActive) {
        lastActive.setHours(0, 0, 0, 0);
        const diffDays = Math.floor(
          (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          user.currentStreak += 1;
        } else if (diffDays > 1) {
          user.currentStreak = 1;
        }
      } else {
        user.currentStreak = 1;
      }

      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
      user.lastActiveDate = new Date();
      await user.save();

      userXP = user.xp;
      userStreak = user.currentStreak;
    }
  } else {
    const user = await User.findById(session.id).lean();
    if (user) {
      userXP = (user as any).xp ?? 0;
      userStreak = (user as any).currentStreak ?? 0;
    }
  }

  return NextResponse.json({
    progress: { completed: isCompleted || wasAlreadyCompleted, score, xpEarned: maxXP },
    xpEarned: wasAlreadyCompleted ? 0 : xpToAward,
    userXP,
    userStreak,
  });
}
