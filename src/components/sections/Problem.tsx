"use client";

import { useRef, useState, type CSSProperties } from "react";
import { useGsap } from "@/lib/gsap";
import { PROBLEMS } from "@/lib/content";
import { summitDots } from "@/lib/summit";
import { SectionHeader } from "../ui";

type P = { x: number; y: number; r: number };
const N = 45;

// PRNG con semilla: mismas posiciones en servidor y cliente.
function seeded(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

/** Estado de orden: la cima del símbolo. */
const SUMMIT: P[] = summitDots().map((d) => ({ x: 200 + d.x * 3, y: 70 + d.y * 3, r: d.r * 2.2 }));

/** Tareas repetitivas: los mismos datos dando vueltas en círculo. */
const LOOP: P[] = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return { x: 200 + Math.cos(a) * 130, y: 200 + Math.sin(a) * 130, r: 4.5 };
});

/** Datos dispersos: islas que no se tocan. */
const ISLANDS: P[] = (() => {
  const rnd = seeded(7);
  const centers = [[90, 100], [300, 80], [200, 210], [80, 310], [320, 300]];
  return Array.from({ length: N }, (_, i) => {
    const [cx, cy] = centers[i % centers.length];
    const a = rnd() * Math.PI * 2, d = 10 + rnd() * 34;
    return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, r: 2.5 + rnd() * 3 };
  });
})();

/** Procesos lentos: todo se acumula antes de un cuello de botella y sale de uno en uno. */
const QUEUE: P[] = (() => {
  const rnd = seeded(3);
  return Array.from({ length: N }, (_, i) => {
    if (i < 37) return { x: 40 + rnd() * 120, y: 200 + (rnd() - 0.5) * (40 + (160 - 40) * rnd()), r: 4 + rnd() * 1.5 };
    const k = i - 37;
    return { x: 190 + k * k * 3 + k * 6, y: 200, r: 4.5 };
  });
})();

// Redondeo: mismas cifras en servidor y cliente (evita desajustes de hidratación).
const round = (ps: P[]) => ps.map((p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), r: +p.r.toFixed(2) }));
const STATES = [SUMMIT, LOOP, ISLANDS, QUEUE].map(round);

function Viz({ state }: { state: number }) {
  const pts = STATES[state];
  return (
    <svg viewBox="0 0 400 400" className="size-full" aria-hidden>
      {pts.map((p, i) => {
        const cima = i === N - 1 && state === 0;
        // Geometría como propiedades CSS: la transición parte siempre de la posición actual.
        const style = {
          cx: p.x,
          cy: p.y,
          r: p.r,
          fill: cima ? "#2FD3F5" : "#F5F5F7",
          opacity: cima ? 1 : state === 0 ? 0.9 : 0.55,
          transitionDelay: `${(i % 15) * 12}ms`,
        } as CSSProperties;
        return <circle key={i} style={style} className="transition-[cx,cy,r,fill,opacity] duration-[1200ms] ease-out" />;
      })}
    </svg>
  );
}

export function Problem() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useGsap(({ ScrollTrigger }) => {
    const triggers = steps.current.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => self.isActive && setActive(i + 1),
        onLeaveBack: () => i === 0 && setActive(0),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  });

  return (
    <section aria-labelledby="problema-title" className="section-y">
      <div className="wrap">
        <SectionHeader
          id="problema-title"
          index="01"
          label="El problema"
          title="Tu empresa ya tiene los datos. Le falta orden."
          lead="La mayoría de empresas no necesita más herramientas. Necesita que las que tiene trabajen juntas."
        />

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-6">
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-0 flex h-svh items-center">
              <div className="aspect-square w-full max-w-[34rem]">
                <Viz state={active} />
              </div>
            </div>
          </div>

          <ol className="lg:col-span-5 lg:col-start-8">
            {PROBLEMS.map((p, i) => (
              <li
                key={p.title}
                ref={(el) => {
                  steps.current[i] = el;
                }}
                data-active={active === i + 1 || undefined}
                className="group flex flex-col justify-center border-t border-line py-12 lg:min-h-[80svh] lg:border-0 lg:py-0"
              >
                <div className="mb-8 aspect-square w-40 lg:hidden">
                  <Viz state={i + 1} />
                </div>
                <p className="label transition-colors duration-500 lg:group-data-[active]:text-cyan">0{i + 1}</p>
                <h3 className="mt-4 text-h2 transition-colors duration-500 lg:text-text-3 lg:group-data-[active]:text-mist">{p.title}</h3>
                <p className="mt-4 max-w-[28rem] text-text-2 transition-colors duration-500 lg:text-text-3 lg:group-data-[active]:text-text-2">
                  {p.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
