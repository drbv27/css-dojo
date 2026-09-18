import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// Lazy y obligatorio, igual que `getMongoURI` en `db.ts`. Antes habia un
// fallback literal: si la variable faltaba en produccion la app NO fallaba,
// seguia andando y firmaba sesiones con un secreto publicado en el repo.
// Un secreto conocido deja forjar un token con `role: "teacher"`.
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "Please define the JWT_SECRET environment variable inside .env.local"
    );
  }
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = "dev-dojo-token";

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    // La firma valida no alcanza: hay que exigir la FORMA del payload.
    // `verify-otp` y `reset-password` firman tokens de reseteo con el mismo
    // secreto, y sin esta comprobacion uno de esos pasaria por sesion — con
    // `id` undefined, que en una query de Mongo deja de filtrar.
    if (!esPayloadDeSesion(payload)) return null;
    return payload;
  } catch {
    return null;
  }
}

function esPayloadDeSesion(payload: unknown): payload is JWTPayload {
  if (typeof payload !== "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    p.id.length > 0 &&
    typeof p.email === "string" &&
    (p.role === "student" || p.role === "teacher")
  );
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getTokenCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    // Seguro por defecto en produccion. Antes dependia SOLO de COOKIE_SECURE,
    // que no esta definida: la cookie de sesion viajaba sin el flag.
    secure:
      process.env.NODE_ENV === "production" ||
      process.env.COOKIE_SECURE === "true",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}

export const COOKIE_TOKEN_NAME = COOKIE_NAME;
