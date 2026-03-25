import mongoose, { Schema, Document, Model } from "mongoose";

export interface IModuleSettings extends Document {
  slug: string;
  enabled: boolean;
}

const ModuleSettingsSchema = new Schema<IModuleSettings>(
  {
    slug: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const ModuleSettings: Model<IModuleSettings> =
  mongoose.models.ModuleSettings ||
  mongoose.model<IModuleSettings>("ModuleSettings", ModuleSettingsSchema);

export default ModuleSettings;
