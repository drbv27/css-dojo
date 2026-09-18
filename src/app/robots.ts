import type { MetadataRoute } from "next";

/**
 * Lo que esta detras de sesion no deberia gastar presupuesto de rastreo.
 * Un redirect a /login no es lo mismo que decirle al crawler que no entre:
 * sin esto, el buscador igual pide esas URLs y se come la redireccion.
 *
 * El sitemap se declara solo si hay una URL de sitio configurada. No se
 * inventa un dominio: un sitemap apuntando al lugar equivocado es peor que
 * no tener sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const sitio = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/modulos",
        "/juegos",
        "/playground",
        "/leaderboard",
        "/perfil",
        "/certificados",
        "/cursos",
        "/backend-python",
        "/teacher",
        "/landing-preview",
      ],
    },
    ...(sitio ? { sitemap: `${sitio}/sitemap.xml` } : {}),
  };
}
