import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Una discrepancia entre el score que afirmo el cliente y el que calculo el
// servidor al corregir la misma respuesta.
//
// COLECCION PROPIA, NO UN CAMPO DE `Progress`. Progress es un documento por
// {userId, moduleId, exerciseId} y se lee en cada dashboard, cada pagina de
// modulo y cada chequeo de certificado. Una discrepancia es un evento
// append-only, varios por ejercicio, y no puede engordar el documento de las
// lecturas mas calientes.
//
// PARA QUE SIRVE, y el segundo motivo importa mas que el primero:
//
//  1. Una discrepancia dispersa sugiere que alguien esta forjando envios.
//  2. Una discrepancia AMPLIA Y PAREJA es evidencia de que el corrector del
//     servidor esta mal, y los alumnos no.
//
// Sin el registro las dos se ven identicas, y lo primero que haria cualquiera
// es acusar a los alumnos.
export interface IGradeMismatch extends Document {
  userId: Types.ObjectId;
  moduleId: string;
  exerciseId: string;
  /** Lo que afirmo el navegador. Nunca decide nada; se guarda para comparar. */
  scoreCliente: number | null;
  /** Lo que calculo el servidor corrigiendo la respuesta. Este es el que rige. */
  scoreServidor: number;
  /** Presente cuando el servidor no pudo corregir; ver `Calificacion`. */
  motivo?: string;
  cuando: Date;
}

const GradeMismatchSchema = new Schema<IGradeMismatch>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    moduleId: { type: String, required: true },
    exerciseId: { type: String, required: true },
    scoreCliente: { type: Number, default: null },
    scoreServidor: { type: Number, required: true },
    motivo: { type: String },
    cuando: { type: Date, required: true },
  },
  { timestamps: true }
);

// Para las dos lecturas que justifican la coleccion: "que paso con este alumno"
// y "que paso con este ejercicio en toda la cohorte".
GradeMismatchSchema.index({ userId: 1, cuando: -1 });
GradeMismatchSchema.index({ moduleId: 1, exerciseId: 1, cuando: -1 });

const GradeMismatch: Model<IGradeMismatch> =
  mongoose.models.GradeMismatch ||
  mongoose.model<IGradeMismatch>("GradeMismatch", GradeMismatchSchema);

export default GradeMismatch;
