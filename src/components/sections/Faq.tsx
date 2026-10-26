"use client";

import { useState } from "react";
import { FAQS } from "@/lib/content";
import { Reveal, SectionHeader } from "../ui";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-6">
        <SectionHeader id="faq-title" index="06" label="Preguntas frecuentes" title="Lo que suelen preguntarnos." className="lg:col-span-4" />

        <Reveal className="lg:col-span-7 lg:col-start-6">
          <ul className="border-t border-line">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-7 text-left font-display text-h3 font-medium transition-colors duration-200 hover:text-mist md:text-[1.375rem]"
                    >
                      {f.q}
                      {/* Más que gira hasta menos: la línea vertical se pliega. */}
                      <span aria-hidden className="relative grid size-8 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition-colors duration-300 group-hover:bg-surface-2">
                        <span className="absolute h-px w-3 bg-mist" />
                        <span className={`absolute h-3 w-px bg-mist transition-transform duration-500 ease-out ${isOpen ? "scale-y-0" : ""}`} />
                      </span>
                    </button>
                  </h3>
                  {/* Altura animada con grid-template-rows (0fr → 1fr); cerrada queda inerte y fuera del árbol accesible. */}
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    inert={!isOpen}
                    className={`grid transition-[grid-template-rows,opacity] ease-out ${isOpen ? "grid-rows-[1fr] opacity-100 duration-500" : "grid-rows-[0fr] opacity-0 duration-300"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[38rem] pb-8 text-text-2">{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
