import mongoose, { Schema, Document, Model } from "mongoose";

// Documento singleton con la configuracion de cohortes.
// - activeCohort: cohorte que se asigna a los nuevos registros.
// - cohortCount: cuantas cohortes existen (para el selector del profesor).
// IMPORTANTE: este doc lo crea SOLO la migracion. Su existencia = "ya se migro
// al modelo por cohortes". El resto del codigo lo LEE con defaults, nunca lo crea,
// para que antes de migrar la app siga comportandose como el modelo global anterior.
export interface ICohortConfig extends Document {
  key: string; // siempre "config" (singleton)
  activeCohort: number;
  cohortCount: number;
}

const CohortConfigSchema = new Schema<ICohortConfig>(
  {
    key: { type: String, required: true, unique: true, default: "config" },
    activeCohort: { type: Number, default: 1 },
    cohortCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const CohortConfig: Model<ICohortConfig> =
  mongoose.models.CohortConfig ||
  mongoose.model<ICohortConfig>("CohortConfig", CohortConfigSchema);

export interface CohortConfigView {
  activeCohort: number;
  cohortCount: number;
  migrated: boolean;
}

// Lee la config con defaults seguros SIN crearla.
export async function readCohortConfig(): Promise<CohortConfigView> {
  const doc = await CohortConfig.findOne({ key: "config" }).lean();
  return {
    activeCohort: doc?.activeCohort ?? 1,
    cohortCount: doc?.cohortCount ?? 1,
    migrated: Boolean(doc),
  };
}

export default CohortConfig;
