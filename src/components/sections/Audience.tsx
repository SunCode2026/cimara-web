import { AUDIENCES } from "@/lib/content";
import { Reveal, SectionHeader } from "../ui";

export function Audience() {
  return (
    <section aria-labelledby="para-quien-title" className="section-y">
      <div className="wrap">
        <SectionHeader
          id="para-quien-title"
          index="04"
          label="Para quién"
          title="Del taller de diez personas a la compañía de mil."
        />

        <div className="mt-16 grid gap-3 md:grid-cols-2 lg:mt-24">
          {AUDIENCES.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col rounded-lg border border-line bg-surface-1 p-8 lg:p-12">
                <h3 className="text-h1">{a.title}</h3>
                <p className="mt-5 max-w-[30rem] text-lead text-text-2">{a.text}</p>
                <ul data-stagger className="mt-auto space-y-3 pt-12">
                  {a.points.map((p) => (
                    <li key={p} className="flex items-baseline gap-3 border-t border-line pt-3">
                      <span aria-hidden className="size-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-mist" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
