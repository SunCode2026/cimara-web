import Image from "next/image";
import Link from "next/link";
import { SERVICES, SITE } from "@/lib/content";
import { Copyright } from "./Copyright";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";

const COLUMNS = [
  {
    title: "Servicios",
    links: SERVICES.map((s) => ({ href: `/servicios#${s.slug}`, label: s.title })),
  },
  {
    title: "CIMARA",
    links: [
      { href: "/sobre-cimara", label: "Sobre CIMARA" },
      { href: "/#metodo", label: "Método" },
      { href: "/#faq", label: "Preguntas frecuentes" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/aviso-legal", label: "Aviso legal" },
      { href: "/privacidad", label: "Privacidad" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap grid gap-16 py-20 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <Image src="/brand/cimara-horizontal.svg" alt="CIMARA" width={144} height={49} />
          <p className="mt-6 max-w-[18rem] text-small text-text-2">{SITE.claim} Consultoría de IA y automatización para empresas.</p>
          <a href={`mailto:${SITE.email}`} className="mt-6 inline-block text-small text-mist underline-offset-4 hover:underline">
            {SITE.email}
          </a>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="md:col-span-2 md:first-of-type:col-start-7">
            <h2 className="label">{col.title}</h2>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-small text-text-2 transition-colors duration-200 hover:text-mist">
                    {l.label}
                  </Link>
                </li>
              ))}
              {col.title === "Legal" && (
                <li>
                  <CookieSettingsButton className="text-small text-text-2 transition-colors duration-200 hover:text-mist" />
                </li>
              )}
            </ul>
          </nav>
        ))}
      </div>
      <div className="wrap flex flex-col gap-3 border-t border-line py-8 text-small text-text-3 sm:flex-row sm:items-center sm:justify-between">
        <Copyright />
        <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-mist">
          LinkedIn<span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
    </footer>
  );
}
