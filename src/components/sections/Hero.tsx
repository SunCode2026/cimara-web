"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/gsap";
import { DotField, type Anchor } from "../DotField";
import { Button } from "../Button";

// Escritorio: la cima a la derecha, a media altura. Móvil: centrada en el hueco sobre el titular.
function heroAnchor(w: number, h: number, slot: HTMLElement | null): Anchor {
  if (w >= 1024 || !slot) {
    const scale = Math.min((h * 0.5) / 86.6, (w * 0.36) / 100);
    return { cx: w * 0.74, top: h * 0.22, scale };
  }
  const box = { top: slot.offsetTop + 88, height: slot.offsetHeight - 112 }; // bajo la navegación
  const scale = Math.min((w * 0.56) / 100, box.height / 86.6);
  return { cx: w / 2, top: box.top + (box.height - 86.6 * scale) / 2, scale };
}

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero() {
  const slot = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  // Al salir, el texto sube algo más despacio que la página y se apaga; el campo se atenúa. Guía la mirada hacia abajo.
  useGsap(({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(content.current, { yPercent: 22, opacity: 0, ease: "none", scrollTrigger: st });
      gsap.to(root.current!.querySelector("canvas"), { opacity: 0.25, ease: "none", scrollTrigger: st });
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden">
      <DotField anchor={(w, h) => heroAnchor(w, h, slot.current)} trigger="load" className="-z-10" />
      {/* Fundido inferior: el campo se disuelve hacia la siguiente sección. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-ink" />

      {/* Hueco para la cima en móvil, entre la navegación y el titular. */}
      <div ref={slot} aria-hidden className="min-h-[40svh] flex-1 lg:hidden" />
      <div ref={content} className="wrap pb-16 md:pb-24">
        <p className="label animate-rise" style={rise(100)}>
          Consultoría de IA y automatización
        </p>
        <h1 id="hero-title" className="mt-6 max-w-[11ch] text-display-xl">
          <span className="block animate-rise-y" style={rise(0)}>De los datos</span>
          <span className="block animate-rise-y" style={rise(60)}>
            a la decisión<span className="cima-dot">.</span>
          </span>
        </h1>
        <p className="mt-8 max-w-[36rem] text-lead text-text-2 animate-rise" style={rise(380)}>
          Automatizamos procesos e incorporamos sistemas de IA útiles en pymes. Menos tareas repetitivas. Más
          tiempo para lo que hace crecer tu negocio.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 animate-rise" style={rise(480)}>
          <Button href="/#contacto">Agenda una consultoría</Button>
          <Button href="/#metodo" variant="ghost">
            Cómo trabajamos
          </Button>
        </div>
        {/* Acceso directo al FAQ: discreto, para no competir con la llamada principal. */}
        <a
          href="#faq"
          className="group mt-8 inline-flex items-center gap-3 rounded-full text-small text-text-2 transition-colors duration-200 hover:text-mist animate-rise"
          style={rise(560)}
        >
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition-[translate,background-color] duration-300 ease-out group-hover:translate-y-0.5 group-hover:bg-surface-2 group-active:scale-[0.95]"
          >
            ↓
          </span>
          ¿Dudas? Preguntas frecuentes
        </a>
      </div>
    </section>
  );
}
