/**
 * Geometría exacta del símbolo (cimara_simbolo_negativo.svg).
 * Retícula triangular de 60°, 8 niveles de 2 a 9 puntos y la cima encima.
 * Cada nivel crece 0,4 de radio hacia arriba: la cima triplica la base.
 */
export const SUMMIT = {
  step: 12.5,
  row: 10.825, // step · sin 60°
  levels: 8,
  rBase: 2.1,
  rGain: 0.4,
  rCima: 6.2,
  glow: 17.05,
  width: 100, // de la primera a la última columna de la base
  height: 86.6, // de la cima a la base
} as const;

export type SummitDot = { x: number; y: number; r: number; level: number; cima: boolean };

/** Puntos del símbolo con origen en la cima (0,0). Orden: niveles de arriba abajo, la cima al final. */
export function summitDots(): SummitDot[] {
  const { step, row, levels, rBase, rGain, rCima } = SUMMIT;
  const dots: SummitDot[] = [];
  for (let level = 1; level <= levels; level++) {
    const r = rBase + rGain * (levels - level);
    for (let i = 0; i <= level; i++) dots.push({ x: (i - level / 2) * step, y: level * row, r, level, cima: false });
  }
  dots.push({ x: 0, y: 0, r: rCima, level: 0, cima: true });
  return dots;
}

export const COLORS = {
  ink: "#07080B",
  mist: "#F5F5F7",
  cyan: "#2FD3F5",
} as const;
