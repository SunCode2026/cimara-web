"use client";

import { useRef } from "react";
import { SITE } from "@/lib/content";
import { DotField, anchorIn } from "../DotField";
import { ContactForm } from "../ContactForm";
import { Reveal } from "../ui";

/** Cierre: la cima vuelve a ensamblarse al entrar en pantalla, junto al formulario. */
export function FinalCta() {
  const slot = useRef<HTMLDivElement>(null);

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative isolate flex min-h-svh items-center overflow-hidden py-28 lg:py-32">
      <DotField anchor={(w, h) => anchorIn(slot.current, w, h)} trigger="view" spacing={34} className="-z-10" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-t from-transparent to-ink" />

      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col lg:col-span-5">
          <div ref={slot} aria-hidden className="h-28 w-32 lg:h-40 lg:w-44" />
          <Reveal className="mt-10">
            <p className="label">
              <span className="text-cyan">07</span> · Contacto
            </p>
            <h2 id="contacto-title" className="mt-5 text-display">
              Hablemos de tu empresa<span className="cima-dot">.</span>
            </h2>
            <p className="mt-6 max-w-[28rem] text-lead text-text-2">
              Cuéntanos qué procesos te quitan tiempo. En una primera consultoría vemos dónde la IA aporta valor y dónde no.
            </p>
            <p className="mt-10 text-small text-text-3">
              ¿Prefieres el correo?{" "}
              <a href={`mailto:${SITE.email}`} className="text-mist underline-offset-4 hover:underline">
                {SITE.email}
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7 lg:self-end">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
