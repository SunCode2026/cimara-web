import { pageMeta } from "@/lib/seo";
import { SERVICES } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { ServiceIndex } from "@/components/ServiceIndex";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/ui";

export const metadata = pageMeta("Servicios", "Automatización de procesos, agentes y asistentes de IA, integración con tus herramientas, análisis de datos y formación de equipos.", "/servicios");

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="label">{title}</h3>
      <ul className="mt-5 border-t border-line">
        {items.map((i) => (
          <li key={i} className="flex items-baseline gap-3 border-b border-line py-3.5">
            <span aria-hidden className="size-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-mist" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        label="Servicios"
        title="Sistemas útiles, no demos."
        lead="Cinco formas de llevar la IA al día a día de tu empresa. Empezamos siempre por un diagnóstico: te decimos dónde aporta valor y dónde no merece la pena."
      />

      <div className="wrap grid gap-16 pb-12 lg:grid-cols-12 lg:gap-6">
        <aside className="hidden lg:col-span-3 lg:block">
          <ServiceIndex items={SERVICES.map(({ slug, title }) => ({ slug, title }))} />
        </aside>

        <div className="lg:col-span-8 lg:col-start-5">
          {SERVICES.map((s, i) => (
            <article key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-title`} className="scroll-mt-28 border-t border-line py-20 first:pt-0 first:border-0 lg:py-28">
              <Reveal>
                <p className="label">
                  <span className="text-cyan">0{i + 1}</span> · Servicio
                </p>
                <h2 id={`${s.slug}-title`} className="mt-5 max-w-[16ch] text-h1">
                  {s.title}
                </h2>
                <p className="mt-6 max-w-[38rem] text-lead text-text-2">{s.lead}</p>
              </Reveal>
              <Reveal delay={0.08} className="mt-14 grid gap-12 md:grid-cols-2 md:gap-6">
                <List title="Qué incluye" items={s.includes} />
                <List title="Ejemplos habituales" items={s.examples} />
              </Reveal>
            </article>
          ))}
        </div>
      </div>

      <CtaBand />
    </>
  );
}
