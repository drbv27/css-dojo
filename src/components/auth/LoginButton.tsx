import Link from "next/link";

export function LoginButton() {
  return (
    <Link
      href="/login"
      className="flex items-center justify-center gap-3 w-full rounded-xl bg-neon-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-neon-blue/90 hover:shadow-xl hover:shadow-black/25 hover:scale-[1.02] active:scale-[0.98]"
    >
      <span>Iniciar sesion</span>
    </Link>
  );
}
