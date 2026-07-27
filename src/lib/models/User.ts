import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  role: "student" | "teacher";
  approved: boolean;
  cohort: number;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  badges: string[];
  resetOtp?: string;
  resetOtpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
    approved: { type: Boolean, default: false },
    // Cohorte a la que pertenece el alumno (para activacion de temas por cohorte).
    // Los alumnos existentes se migran a 1; los nuevos toman la cohorte activa.
    cohort: { type: Number, default: 1, index: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    badges: { type: [String], default: [] },
    resetOtp: { type: String, select: false },
    resetOtpExpiresAt: { type: Date, select: false },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
