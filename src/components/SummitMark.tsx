import { SUMMIT, summitDots } from "@/lib/summit";

const DOTS = summitDots();

/**
 * Símbolo en SVG con niveles encendidos de abajo arriba.
 * `lit` = cuántos niveles (de 0 a 8) están encendidos desde la base; con 8 se enciende también la cima.
 */
export function SummitMark({ lit, className = "", cascade = false }: { lit: number; className?: string; cascade?: boolean }) {
  const full = lit >= SUMMIT.levels;
  return (
    <svg viewBox="-62 -20 124 112" className={className} aria-hidden>
      <defs>
        <radialGradient id="summit-glow">
          <stop offset="0" stopColor="#2FD3F5" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2FD3F5" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r={SUMMIT.glow} fill="url(#summit-glow)" className="transition-opacity duration-700" opacity={full ? 1 : 0} style={cascade ? { transitionDelay: "540ms" } : undefined} />
      {DOTS.map((d, i) => {
        const on = d.cima ? full : d.level > SUMMIT.levels - lit;
        return (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={d.cima && full ? "#2FD3F5" : "#F5F5F7"}
            opacity={on ? 1 : 0.16}
            // Cascada opcional: de la base a la cima, 60 ms por nivel; la cima la última.
            style={cascade ? { transitionDelay: `${d.cima ? 540 : (SUMMIT.levels - d.level) * 60}ms` } : undefined}
            className="transition-[opacity,fill] duration-700 ease-out"
          />
        );
      })}
    </svg>
  );
}
