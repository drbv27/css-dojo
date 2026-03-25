import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAchievement extends Document {
  slug: string;
  title: string;
  description: string;
  icon: string;
  condition: {
    type: string;
    value: number;
    moduleId?: string;
  };
}

const AchievementSchema = new Schema<IAchievement>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  condition: {
    type: {
      type: String,
      required: true,
    },
    value: { type: Number, required: true },
    moduleId: { type: String },
  },
});

const Achievement: Model<IAchievement> =
  mongoose.models.Achievement ||
  mongoose.model<IAchievement>("Achievement", AchievementSchema);

export default Achievement;
