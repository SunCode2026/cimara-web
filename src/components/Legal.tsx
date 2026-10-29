import type { ReactNode } from "react";
import Link from "next/link";
import { breadcrumb } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** Dato legal pendiente de confirmar por el cliente. Se ve a propósito: no puede publicarse así. */
export function Pending({ children }: { children: ReactNode }) {
  return <mark className="rounded-sm border border-dashed border-cyan-line bg-cyan-soft px-1.5 text-mist">[{children}]</mark>;
}

/** Muestra un dato del titular o, si falta, su marcador. */
export function Datum({ value, label }: { value: string | null; label: string }) {
  return value ? <>{value}</> : <Pending>{label}</Pending>;
}

const LEGAL_LINKS = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
];

/** Plantilla de texto legal: título, fecha de actualización, navegación entre textos y columna de lectura. */
export function LegalPage({ title, updated, current, children }: { title: string; updated: string; current: string; children: ReactNode }) {
  return (
    <div className="wrap grid gap-12 pt-40 pb-[var(--section-y)] md:pt-48 lg:grid-cols-12 lg:gap-6">
      <aside className="lg:col-span-3">
        <nav aria-label="Textos legales" className="lg:sticky lg:top-28">
          <ul className="flex gap-1 lg:flex-col">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={current === l.href ? "page" : undefined}
                  className="block rounded-full px-4 py-2 text-small text-text-3 transition-colors hover:text-mist aria-[current=page]:bg-surface-2 aria-[current=page]:text-mist lg:-ml-4"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <article className="lg:col-span-7 lg:col-start-5">
        <JsonLd data={breadcrumb(title, current)} />
        <p className="label">Legal</p>
        <h1 className="mt-5 text-h1">{title}</h1>
        <p className="mt-4 text-small text-text-3">Última actualización: {updated}</p>
        <div className="legal mt-14">{children}</div>
      </article>
    </div>
  );
}
