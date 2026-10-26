import type { ReactNode } from "react";

/** Cabecera de página interior: etiqueta, titular grande y entradilla. Entra con la misma subida que el hero. */
export function PageHero({ label, title, lead, children }: { label: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  const rise = (ms: number) => ({ animationDelay: `${ms}ms` });
  return (
    <header className="wrap pt-40 pb-20 md:pt-48 md:pb-28">
      <p className="label animate-rise" style={rise(60)}>
        {label}
      </p>
      <h1 className="mt-6 max-w-[14ch] text-display animate-rise-y" style={rise(0)}>
        {title}
      </h1>
      {lead && (
        <p className="mt-8 max-w-[38rem] text-lead text-text-2 animate-rise-y" style={rise(60)}>
          {lead}
        </p>
      )}
      {children}
    </header>
  );
}
