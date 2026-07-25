import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Respuesta al sondeo de pre-lanzamiento de la linea de productos.
export interface ICourseInterest extends Document {
  userId: Types.ObjectId;
  surveySlug: string;
  products: string[]; // productos que le interesan (multi-seleccion)
  buyIntent: string; // que reservaria (senal dura): bundle | individual | sandbox-only | exploring
  individualPicks: string[]; // si buyIntent = individual, cuales cursos
  sandboxWtp: string; // que pagaria por el sandbox (modelo de cobro)
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseInterestSchema = new Schema<ICourseInterest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    surveySlug: { type: String, required: true, default: "launch-2026" },
    products: { type: [String], default: [] },
    buyIntent: { type: String, required: true },
    individualPicks: { type: [String], default: [] },
    sandboxWtp: { type: String, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

// Una respuesta por usuario por sondeo (upsert si reenvia).
CourseInterestSchema.index({ userId: 1, surveySlug: 1 }, { unique: true });

const CourseInterest: Model<ICourseInterest> =
  mongoose.models.CourseInterest ||
  mongoose.model<ICourseInterest>("CourseInterest", CourseInterestSchema);

export default CourseInterest;
