"use client";

import { useEffect, useRef, type ReactNode } from "react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Un solo observador para todos los revelados: marca el elemento y deja de vigilarlo.
let io: IntersectionObserver | null = null;
function observe(el: Element) {
  io ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.setAttribute("data-shown", "");
        io!.unobserve(e.target);
      }),
    { rootMargin: "0px 0px -12% 0px" },
  );
  io.observe(el);
  return () => io!.unobserve(el);
}

/** Aparece al entrar en pantalla: sube 24px y se funde (CSS en globals.css). Una sola vez. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => observe(ref.current!), []);
  return (
    <div ref={ref} data-reveal className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}

/** Cabecera de sección: etiqueta numerada, titular y entradilla opcional. */
export function SectionHeader({
  index,
  label,
  title,
  lead,
  id,
  className = "",
}: {
  index: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <p className="label">
        <span className="text-cyan">{index}</span> · {label}
      </p>
      <h2 id={id} className="mt-5 max-w-[16ch] text-h1">
        {title}
      </h2>
      {lead && <p className="mt-6 max-w-[34rem] text-lead text-text-2">{lead}</p>}
    </Reveal>
  );
}
