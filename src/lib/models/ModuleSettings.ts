import mongoose, { Schema, Document, Model } from "mongoose";

// Visibilidad de un modulo PARA UNA COHORTE.
// Semantica: un modulo esta activo para una cohorte SOLO si existe un doc
// con enabled=true. Por defecto (sin doc) esta bloqueado -> las cohortes
// nuevas arrancan cerradas y el profesor abre temas gradualmente.
export interface IModuleSettings extends Document {
  cohort: number;
  slug: string;
  enabled: boolean;
}

const ModuleSettingsSchema = new Schema<IModuleSettings>(
  {
    cohort: { type: Number, required: true, default: 1 },
    slug: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Un ajuste por (cohorte, modulo).
ModuleSettingsSchema.index({ cohort: 1, slug: 1 }, { unique: true });

const ModuleSettings: Model<IModuleSettings> =
  mongoose.models.ModuleSettings ||
  mongoose.model<IModuleSettings>("ModuleSettings", ModuleSettingsSchema);

export default ModuleSettings;
