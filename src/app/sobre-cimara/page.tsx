import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { SummitScrub } from "@/components/SummitScrub";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/ui";

export const metadata = pageMeta("Sobre CIMARA", "Consultoría de inteligencia artificial y automatización. IA aplicada con criterio: sistemas útiles, medibles y pensados para el día a día de cada negocio.", "/sobre-cimara");

// Propósito, promesa y personalidad: Manual de identidad 1.0, apartado 01.
const PILLARS = [
  { label: "Propósito", text: "Que cada empresa dedique menos tiempo a lo repetitivo y más a lo que la hace crecer." },
  { label: "Promesa", text: "IA aplicada con criterio: sistemas útiles, medibles y pensados para el día a día de cada negocio." },
  { label: "Personalidad", text: "Experta pero cercana. Clara, precisa y sin humo tecnológico." },
];

// Tono de voz: Manual de identidad 1.0, apartado 09.
const PRINCIPLES = [
  { title: "Claros", quote: "Automatizamos la facturación para que tu equipo recupere horas cada semana." },
  { title: "Precisos", quote: "Te decimos dónde la IA aporta valor y dónde no merece la pena." },
  { title: "Cercanos", quote: "Te acompañamos desde el primer análisis hasta que el sistema funciona." },
  { title: "Seguros, sin arrogancia", quote: "Medimos el impacto de cada sistema que ponemos en marcha." },
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        label="Sobre CIMARA"
        title={
          <>
            IA aplicada con criterio<span className="cima-dot">.</span>
          </>
        }
        lead="Somos una consultoría de inteligencia artificial y automatización. Ayudamos a pymes a incorporar sistemas útiles que se notan en el día a día."
      />

      <section aria-labelledby="nombre-title" className="wrap section-y grid items-center gap-16 border-t border-line lg:grid-cols-12 lg:gap-6">
        <SummitScrub className="mx-auto w-full max-w-[22rem] lg:col-span-5" />
        <Reveal className="lg:col-span-6 lg:col-start-7">
          <p className="label">
            <span className="text-cyan">01</span> · El nombre
          </p>
          <h2 id="nombre-title" className="mt-5 text-h1">
            De miles de señales a una decisión clara.
          </h2>
          <p className="mt-6 text-lead text-text-2">El nombre evoca la cima: el punto más alto al que queremos llevar a cada cliente.</p>
          <p className="mt-5 max-w-[34rem] text-text-2">
            Nuestro símbolo traduce esa idea al lenguaje de los datos. Cuarenta y cuatro puntos repartidos en ocho niveles que, bien
            ordenados, suben hasta una sola respuesta. Cada nivel es más grande que el anterior, porque la información gana valor al
            subir. La cima, el único punto en cian, es la decisión: lo que entregamos.
          </p>
        </Reveal>
      </section>

      <section aria-label="Propósito, promesa y personalidad" className="wrap section-y border-t border-line">
        <dl className="grid gap-12 md:grid-cols-3 md:gap-6">
          {PILLARS.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.08}>
              <dt className="label">{p.label}</dt>
              <dd className="mt-5 text-h2 font-display font-medium">{p.text}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section aria-labelledby="principios-title" className="wrap section-y border-t border-line">
        <Reveal>
          <p className="label">
            <span className="text-cyan">02</span> · Cómo trabajamos
          </p>
          <h2 id="principios-title" className="mt-5 max-w-[16ch] text-h1">
            Decimos lo que hacemos. Y lo medimos.
          </h2>
        </Reveal>
        <ul className="mt-16 grid gap-3 md:grid-cols-2 lg:mt-20">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={(i % 2) * 0.08} className="h-full">
                <figure className="flex h-full flex-col rounded-lg border border-line bg-surface-1 p-8 lg:p-10">
                  <figcaption className="label">0{i + 1} · {p.title}</figcaption>
                  <blockquote className="mt-10 font-display text-h2 font-medium">«{p.quote}»</blockquote>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand title="Hablemos de tu empresa." />
    </>
  );
}
