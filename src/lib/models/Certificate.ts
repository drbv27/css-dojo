import mongoose, { Schema, Document, Model, Types } from "mongoose";
import type { DojoType } from "@/types";

// Certificado de finalizacion DE UNA RUTA.
//
// LO UNICO IMPORTANTE DE ESTE MODELO: es un SNAPSHOT. Guarda QUE certifico,
// no una referencia a lo que el curriculum diga hoy.
//
// La razon es concreta y ya paso una vez: el 2026-08-25 el commit 6822485 le
// agrego dos ejercicios a `unidades-css`, que es un modulo obligatorio, y movio
// el camino minimo de CSS de 166 a 168 ejercicios en un commit de contenido
// cualquiera. El patron de mini-retos va a hacer lo mismo a proposito y muchas
// veces mas.
//
// Si la validez se recalculara en vivo, la manana que caiga uno de esos commits
// cada certificado emitido pasa a ser una afirmacion que su duenio ya no
// cumple, EN SILENCIO. Nadie se entera hasta que un alumno pregunta por que
// desaparecio el suyo.
//
// O sea: el recalculo es para la ELEGIBILIDAD, nunca para la VALIDEZ. Un
// certificado otorgado se lee de su propio documento.
export interface ICertificate extends Document {
  userId: Types.ObjectId;
  dojo: DojoType;
  /** La cohorte al momento del otorgamiento. */
  cohort: number;
  /** Los slugs obligatorios EXIGIDOS en ese momento. Congelados. */
  modulos: string[];
  /** Cuantos ejercicios tenia cada uno de esos modulos. Congelado. */
  ejerciciosPorModulo: Record<string, number>;
  otorgadoEn: Date;
  /**
   * Identificador estable. Existe desde la version uno aunque la verificacion
   * publica este fuera de alcance, porque retrofitear un identificador a
   * documentos ya entregados es exactamente la migracion que este disenio
   * evita.
   */
  codigo: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dojo: { type: String, required: true },
    cohort: { type: Number, required: true },
    modulos: { type: [String], required: true },
    // Map en vez de Mixed: Mongoose valida que los valores sean numeros, y un
    // conteo de ejercicios que se guarde como string se lee igual y compara
    // distinto.
    ejerciciosPorModulo: { type: Map, of: Number, required: true },
    otorgadoEn: { type: Date, required: true },
    codigo: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Un certificado por alumno y por ruta. Un segundo otorgamiento del mismo track
// es una lectura del documento que ya existe, nunca un duplicado.
CertificateSchema.index({ userId: 1, dojo: 1 }, { unique: true });

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;
