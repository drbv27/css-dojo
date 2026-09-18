import dbConnect from "@/lib/db";
import RateLimit from "@/lib/models/RateLimit";

/**
 * Cuenta intentos por clave dentro de una ventana, y dice si se paso.
 *
 * Sin esto, el OTP de recuperacion —seis digitos, diez minutos de vida— se
 * podia agotar por fuerza bruta: un millon de combinaciones sin nadie que
 * contara. Lo mismo el login, que aceptaba intentos ilimitados de contrasena.
 *
 * Vive en Mongo y no en memoria del proceso a proposito: un contador en
 * memoria se reinicia en cada deploy y no existe entre instancias, que es
 * justo cuando un atacante lo nota. El indice TTL de `expiraEn` limpia solo.
 *
 * Devuelve `true` cuando hay que rechazar.
 */
export async function excedeLimite(
  clave: string,
  maximo: number,
  ventanaSegundos: number
): Promise<boolean> {
  await dbConnect();

  const ahora = new Date();
  const registro = await RateLimit.findOneAndUpdate(
    { clave },
    {
      $inc: { intentos: 1 },
      $setOnInsert: { expiraEn: new Date(ahora.getTime() + ventanaSegundos * 1000) },
    },
    { upsert: true, new: true }
  ).lean<IRegistro>();

  return (registro?.intentos ?? 1) > maximo;
}

interface IRegistro {
  intentos: number;
}

/** Borra el contador. Se llama cuando el intento salio bien. */
export async function limpiarLimite(clave: string): Promise<void> {
  await dbConnect();
  await RateLimit.deleteOne({ clave });
}
