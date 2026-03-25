import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProgress extends Document {
  userId: Types.ObjectId;
  moduleId: string;
  exerciseId: string;
  exerciseType: string;
  completed: boolean;
  score: number;
  xpEarned: number;
  attempts: number;
  lastAttemptAt?: Date;
  userAnswer?: any;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moduleId: { type: String, required: true },
    exerciseId: { type: String, required: true },
    exerciseType: {
      type: String,
      enum: ["quiz", "code-completion", "live-editor", "visual-match", "drag-drop"],
      required: true,
    },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date },
    userAnswer: { type: Schema.Types.Mixed },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

ProgressSchema.index(
  { userId: 1, moduleId: 1, exerciseId: 1 },
  { unique: true }
);

const Progress: Model<IProgress> =
  mongoose.models.Progress ||
  mongoose.model<IProgress>("Progress", ProgressSchema);

export default Progress;
