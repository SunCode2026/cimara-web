import { AUDIENCE } from "@/lib/content";
import { Reveal, SectionHeader } from "../ui";

export function Audience() {
  return (
    <section aria-labelledby="para-quien-title" className="section-y">
      <div className="wrap">
        <SectionHeader id="para-quien-title" index="04" label="Para quién" title="Hecho para pymes que quieren crecer sin crecer en tareas." />

        <Reveal className="mt-16 lg:mt-24">
          <article className="grid gap-12 rounded-lg border border-line bg-surface-1 p-8 lg:grid-cols-12 lg:gap-6 lg:p-14">
            <div className="lg:col-span-5">
              <h3 className="text-h1">{AUDIENCE.title}</h3>
              <p className="mt-5 max-w-[30rem] text-lead text-text-2">{AUDIENCE.text}</p>
            </div>
            <ul data-stagger className="space-y-3 lg:col-span-6 lg:col-start-7 lg:self-end">
              {AUDIENCE.points.map((p) => (
                <li key={p} className="flex items-baseline gap-3 border-t border-line pt-3">
                  <span aria-hidden className="size-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-mist" />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
