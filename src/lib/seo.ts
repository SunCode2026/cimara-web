import type { Metadata } from "next";
import { FAQS, SERVICES, SITE } from "./content";
import { COMPANY } from "./legal";

/** Base de Open Graph: Next no fusiona `openGraph` entre layout y página, así que cada página la repite entera. */
export const OG_BASE: NonNullable<Metadata["openGraph"]> & { type: "website" } = {
  type: "website",
  locale: "es_ES",
  siteName: SITE.name,
  images: [{ url: "/og.png", width: 1200, height: 630, alt: "CIMARA, consultoría de IA y automatización: «De los datos a la decisión», junto al símbolo de puntos que forman una cima." }],
};

/** Metadatos de una página interior: título, descripción, canonical y Open Graph coherentes. */
export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...OG_BASE, title: `${title} · ${SITE.name}`, description, url: path },
  };
}

/** Fecha de la última revisión del contenido, para `lastmod` del sitemap. Actualizar al cambiar textos. */
export const CONTENT_UPDATED = "2026-10-29";

/** Rutas indexables, para el sitemap. */
export const ROUTES = ["/", "/servicios", "/sobre-cimara", "/contacto", "/aviso-legal", "/privacidad", "/cookies"];

/** JSON-LD seguro dentro de <script>: escapa «<» para que el contenido no pueda cerrar la etiqueta. */
export const jsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

export const ORGANIZATION = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // Consultoría que presta servicio en toda España (sin dirección pública todavía: se añade al confirmarla en legal.ts).
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/brand/cimara-horizontal.svg`,
      description: SITE.description,
      email: SITE.email,
      sameAs: [SITE.linkedin],
      areaServed: { "@type": "Country", name: "España" },
      ...(COMPANY.address && { address: COMPANY.address }),
      knowsAbout: ["Inteligencia artificial", "Automatización de procesos", "Agentes de IA", "Análisis de datos", "Digitalización de pymes"],
      makesOffer: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.text, url: `${SITE.url}/servicios#${s.slug}` },
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: "es-ES",
      publisher: { "@id": `${SITE.url}/#organization` },
    },
  ],
};

export const FAQ_PAGE = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

/** Migas de pan de una página interior (Inicio › página). */
export const breadcrumb = (name: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
    { "@type": "ListItem", position: 2, name, item: `${SITE.url}${path}` },
  ],
});
