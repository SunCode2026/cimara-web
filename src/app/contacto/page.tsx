import { breadcrumb, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { SummitMark } from "@/components/SummitMark";
import { Reveal } from "@/components/ui";

export const metadata = pageMeta("Contacto: agenda una consultoría de IA", "Cuéntanos qué procesos te quitan tiempo y agenda una primera consultoría de IA para tu pyme. Te decimos dónde la IA aporta valor y dónde no merece la pena.", "/contacto");

const NEXT_STEPS = [
  { title: "Leemos tu mensaje", text: "Una persona del equipo revisa lo que nos cuentas. Sin respuestas automáticas." },
  { title: "Primera conversación", text: "Hablamos de tus procesos, tus herramientas y lo que quieres mejorar." },
  { title: "Propuesta clara", text: "Si la IA aporta valor, te proponemos un diagnóstico con alcance y costes claros. Si no, te lo decimos." },
];

export default function ContactoPage() {
  return (
    <>
      <JsonLd data={breadcrumb("Contacto", "/contacto")} />
      <PageHero
        label="Contacto"
        title={
          <>
            Hablemos de tu empresa<span className="cima-dot">.</span>
          </>
        }
        lead="Cuéntanos qué procesos te quitan tiempo. En una primera consultoría vemos dónde la IA aporta valor y dónde no."
      />

      <section aria-label="Formulario de contacto" className="wrap grid gap-16 pb-[var(--section-y)] lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <ContactForm />
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-5 lg:row-start-1">
          <h2 className="label">Qué pasa después</h2>
          <ol className="mt-6 border-t border-line">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-6 border-b border-line py-7">
                <SummitMark lit={(i + 1) * 3} className="mt-1 w-10 shrink-0" />
                <div>
                  <h3 className="text-h3">{s.title}</h3>
                  <p className="mt-2 text-text-2">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-small text-text-3">
            ¿Prefieres el correo?{" "}
            <a href={`mailto:${SITE.email}`} className="text-mist underline-offset-4 hover:underline">
              {SITE.email}
            </a>
          </p>
        </Reveal>
      </section>
    </>
  );
}
