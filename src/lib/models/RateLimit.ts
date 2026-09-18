import mongoose, { Schema, models, model } from "mongoose";

export interface IRateLimit {
  clave: string;
  intentos: number;
  expiraEn: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  clave: { type: String, required: true, unique: true },
  intentos: { type: Number, required: true, default: 0 },
  // Indice TTL: Mongo borra el documento solo cuando pasa la fecha, asi que
  // la ventana se limpia sin trabajo de nuestro lado.
  expiraEn: { type: Date, required: true, expires: 0 },
});

export default (models.RateLimit as mongoose.Model<IRateLimit>) ||
  model<IRateLimit>("RateLimit", RateLimitSchema);
