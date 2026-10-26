"use client";

import { useEffect, useRef } from "react";
import { METRICS } from "@/lib/content";
import { Reveal, SectionHeader } from "../ui";

const easeOut = (t: number) => 1 - Math.pow(2, -10 * t);

/**
 * Contador que arranca al entrar en pantalla (escribe en el DOM en cada frame, sin re-renderizar).
 * Con valor real cuenta hacia arriba; sin él (null) los dígitos barajan y se quedan en el marcador [00].
 */
function Counter({ value }: { value: number | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = value === null ? "[00]" : String(value);

  useEffect(() => {
    const el = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = value === null ? 1200 : 1800;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          el.textContent = p >= 1 ? final : value === null ? `[${Math.floor(Math.random() * 90 + 10)}]` : String(Math.round(value * easeOut(p)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    if (value !== null) el.textContent = "0";
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, final]);

  return (
    <span ref={ref} className="tabular-nums">
      {final}
    </span>
  );
}

export function Results() {
  return (
    <section aria-labelledby="resultados-title" className="section-y">
      <div className="wrap">
        <SectionHeader
          id="resultados-title"
          index="05"
          label="Resultados"
          title="Lo que no se mide, no se promete."
          lead="Cada sistema arranca con una línea base y unos indicadores acordados contigo. Aquí publicaremos cifras reales de proyectos."
        />

        <dl className="mt-16 grid border-t border-line sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.06} className="border-b border-line py-10 sm:odd:border-r sm:odd:pr-8 sm:even:pl-8 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0">
              <dt className="sr-only">{m.label}</dt>
              <dd className="flex items-baseline gap-2 font-display text-display">
                <Counter value={m.value} />
                <span className="text-h2 text-text-3">{m.suffix}</span>
              </dd>
              <dd className="mt-4 max-w-[14rem] text-text-2" aria-hidden>
                {m.label}
              </dd>
              {m.value === null && <dd className="label mt-6 !text-text-3">Dato pendiente</dd>}
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
