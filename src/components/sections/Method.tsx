"use client";

import { useRef, useState } from "react";
import { useGsap } from "@/lib/gsap";
import { METHOD } from "@/lib/content";
import { SummitMark } from "../SummitMark";
import { Reveal } from "../ui";

/** Cada paso enciende dos niveles de la cima; el último enciende la cima. */
const litFor = (step: number) => (step + 1) * 2;

export function Method() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [step, setStep] = useState(0);

  useGsap(({ gsap }) => {
    const mm = gsap.matchMedia();
    // Escritorio: sección fijada y pasos en horizontal, vinculados al scroll.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - el.clientWidth;
      gsap.to(el.children, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.5}`,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => setStep(Math.min(METHOD.length - 1, Math.floor(self.progress * METHOD.length * 0.999))),
        },
      });
    });
    return () => mm.revert();
  });

  return (
    <section id="metodo" ref={root} aria-labelledby="metodo-title" className="section-y overflow-x-clip lg:flex lg:h-svh lg:items-center lg:py-0">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-6">
        {/* En escritorio, las tarjetas pasan por debajo de esta columna: fondo opaco hasta el borde y fundido hacia la derecha. */}
        <Reveal className="relative z-10 lg:col-span-4 lg:flex lg:flex-col lg:justify-center lg:bg-ink lg:before:absolute lg:before:inset-y-0 lg:before:right-full lg:before:w-screen lg:before:bg-ink lg:after:absolute lg:after:inset-y-0 lg:after:left-full lg:after:w-16 lg:after:bg-linear-to-r lg:after:from-ink lg:after:to-transparent">
          <p className="label">
            <span className="text-cyan">03</span> · Método
          </p>
          <h2 id="metodo-title" className="mt-5 max-w-[12ch] text-h1">
            Cuatro pasos. Ninguno sobra.
          </h2>
          <div className="mt-12 hidden items-end gap-6 lg:flex">
            <SummitMark lit={litFor(step)} className="w-36" />
            <p className="font-display text-h2 tabular-nums" aria-live="polite">
              0{step + 1}
              <span className="text-text-3"> / 0{METHOD.length}</span>
            </p>
          </div>
        </Reveal>

        <ol ref={track} className="flex flex-col gap-3 lg:col-span-8 lg:flex-row lg:gap-6 lg:overflow-visible">
          {METHOD.map((m, i) => (
            <li
              key={m.title}
              data-active={i <= step || undefined}
              className="group flex shrink-0 flex-col rounded-lg border border-line bg-surface-1 p-8 lg:min-h-[26rem] lg:w-[min(30rem,38vw)] lg:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-display text-text-3 transition-colors duration-700 lg:group-data-[active]:text-mist">
                  0{i + 1}
                </span>
                <SummitMark lit={litFor(i)} className="w-16 lg:hidden" />
              </div>
              <h3 className="mt-auto pt-12 text-h2">{m.title}</h3>
              <p className="mt-4 text-text-2">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
