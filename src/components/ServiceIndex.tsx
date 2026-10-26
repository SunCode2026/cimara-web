"use client";

import { useEffect, useState } from "react";

/** Índice fijo de la página de servicios: marca el servicio que ocupa el centro de la pantalla. */
export function ServiceIndex({ items }: { items: { slug: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.slug);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.slug);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Índice de servicios" className="sticky top-28">
      <ol className="space-y-1 border-l border-line">
        {items.map((item, n) => (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              aria-current={active === item.slug ? "true" : undefined}
              className="relative -ml-px flex gap-4 border-l border-transparent py-2 pl-5 text-small text-text-3 transition-colors duration-300 hover:text-mist aria-[current=true]:border-mist aria-[current=true]:text-mist"
            >
              <span className="tabular-nums">0{n + 1}</span>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
