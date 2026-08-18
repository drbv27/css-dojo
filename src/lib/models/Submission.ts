import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Entrega de un proyecto: el alumno sube su archivo (ej. index.html del CV).
// Guardamos el contenido como texto (archivos pequenos); una entrega por
// alumno por proyecto (re-subir reemplaza).
export interface ISubmission extends Document {
  userId: Types.ObjectId;
  projectSlug: string; // slug del modulo-proyecto (ej. "html-16-proyecto-cv")
  cohort: number;
  filename: string;
  content: string; // el HTML entregado
  size: number; // bytes
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectSlug: { type: String, required: true },
    cohort: { type: Number, default: 1 },
    filename: { type: String, required: true },
    content: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

// Una entrega por alumno por proyecto.
SubmissionSchema.index({ userId: 1, projectSlug: 1 }, { unique: true });

const Submission: Model<ISubmission> =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);

export default Submission;
