import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Registra que un alumno ABRIO un modulo, se haya o no puesto a resolver.
//
// Por que existe: `Progress` solo se escribe cuando alguien ENVIA un ejercicio,
// asi que un alumno que abre un modulo, lo mira y se va no deja ningun rastro.
// Con solo `Progress`, "lo salteo" y "nunca lo abrio" son indistinguibles -- y
// esa es exactamente la distincion que hace falta para decidir que modulos son
// camino obligatorio y cuales son profundizacion.
//
// Un documento por alumno y modulo, no uno por visita: el crecimiento queda
// acotado a usuarios x modulos, igual que `Progress` lo acota con su indice
// unico por ejercicio. `views` cuenta las visitas y las dos fechas dan la
// ventana, que es todo lo que la pregunta necesita.
export interface IModuleView extends Document {
  userId: Types.ObjectId;
  moduleId: string;
  views: number;
  firstViewedAt: Date;
  lastViewedAt: Date;
}

const ModuleViewSchema = new Schema<IModuleView>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  moduleId: { type: String, required: true },
  views: { type: Number, default: 0 },
  firstViewedAt: { type: Date, required: true },
  lastViewedAt: { type: Date, required: true },
});

ModuleViewSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

const ModuleView: Model<IModuleView> =
  mongoose.models.ModuleView || mongoose.model<IModuleView>("ModuleView", ModuleViewSchema);

export default ModuleView;
