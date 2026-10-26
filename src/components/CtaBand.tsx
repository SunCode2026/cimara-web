import { Button } from "./Button";
import { SummitMark } from "./SummitMark";
import { Reveal } from "./ui";

/** Cierre corto para páginas interiores: lleva al contacto. */
export function CtaBand({ title = "¿Por dónde empezamos?", text = "Cuéntanos qué procesos te quitan tiempo y te decimos dónde la IA aporta valor y dónde no." }) {
  return (
    <section aria-labelledby="cta-band-title" className="wrap pb-[var(--section-y)]">
      <Reveal className="flex flex-col gap-10 rounded-lg border border-line bg-surface-1 p-8 md:flex-row md:items-end md:justify-between lg:p-14">
        <div>
          <SummitMark lit={8} className="w-14" />
          <h2 id="cta-band-title" className="mt-8 max-w-[16ch] text-h1">
            {title}
          </h2>
          <p className="mt-5 max-w-[30rem] text-text-2">{text}</p>
        </div>
        <Button href="/contacto" className="shrink-0">
          Agenda una consultoría
        </Button>
      </Reveal>
    </section>
  );
}
