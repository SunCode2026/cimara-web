"use client";

import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";
import { SERVICES } from "@/lib/content";
import { Reveal, SectionHeader } from "../ui";

// 2 tarjetas grandes arriba, 3 abajo, en una retícula de 6 columnas.
const SPAN = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

function spotlight(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}

export function Services() {
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);

  // Táctil: la tarjeta que cruza el centro de la pantalla se ilumina como con el hover de escritorio.
  useEffect(() => {
    if (!matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute("data-focus", e.isIntersecting)),
      { rootMargin: "-40% 0px -40% 0px" },
    );
    cards.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="servicios-title" className="section-y">
      <div className="wrap">
        <SectionHeader
          id="servicios-title"
          index="02"
          label="Servicios"
          title="Sistemas útiles, no demos."
          lead="Te decimos dónde la IA aporta valor y dónde no merece la pena. Y después lo construimos."
        />

        <ul className="mt-16 grid gap-3 md:grid-cols-2 lg:mt-24 lg:grid-cols-6">
          {SERVICES.map((s, i) => (
            <li key={s.slug} className={`${SPAN[i]} ${i === 4 ? "md:col-span-2 lg:col-span-2" : ""}`}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <Link
                  href={`/servicios#${s.slug}`}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  onPointerMove={spotlight}
                  className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-lg border border-line bg-surface-1 p-8 shadow-[inset_0_1px_0_rgb(245_245_247/0.06)] transition-[border-color,background-color,scale] duration-300 ease-out active:scale-[0.99] active:duration-100 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(30rem_circle_at_var(--x,50%)_var(--y,0%),var(--color-cyan-soft),transparent_45%)] before:opacity-0 before:transition-opacity before:duration-500 hover:border-cyan-line hover:bg-surface-2 hover:before:opacity-100 focus-visible:border-cyan-line [@media(hover:none)]:data-[focus]:border-cyan-line [@media(hover:none)]:data-[focus]:bg-surface-2 [@media(hover:none)]:data-[focus]:before:opacity-100"
                >
                  <span className="label relative">0{i + 1}</span>
                  <h3 className="relative mt-20 text-h2 lg:mt-28">{s.title}</h3>
                  <p className="relative mt-4 max-w-[30rem] text-text-2">{s.text}</p>
                  <span
                    aria-hidden
                    className="absolute top-7 right-7 grid size-9 place-items-center rounded-full text-text-3 shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition-[rotate,color] duration-500 ease-out group-hover:-rotate-45 group-hover:text-mist [@media(hover:none)]:group-data-[focus]:-rotate-45 [@media(hover:none)]:group-data-[focus]:text-mist"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
