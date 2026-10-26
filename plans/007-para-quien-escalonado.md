# 007 — Escalonar los puntos de «Para quién»

- **Status**: DONE
- **Commit**: 8540bff
- **Severity**: LOW (oportunidad)
- **Category**: Cohesion (stagger)
- **Estimated scope**: 2 archivos, ~12 líneas

## Problem

En «Para quién», cada tarjeta (Pymes / Grandes empresas) entra con el revelado general: sube 24 px y se funde. Sus tres puntos de lista aparecen **todos a la vez** con la tarjeta. En móvil, donde las tarjetas se leen una tras otra a pantalla completa, la lista es justo lo que el usuario está leyendo, y una entrada escalonada guía la lectura de arriba abajo.

```tsx
/* src/components/sections/Audience.tsx:21-24 — current */
<ul className="mt-auto space-y-3 pt-12">
  {a.points.map((p) => (
    <li key={p} className="flex items-baseline gap-3 border-t border-line pt-3">
```
```css
/* src/app/globals.css — current, revelado general */
[data-reveal] {
  opacity: 0;
  translate: 0 24px;
  transition: opacity 900ms var(--ease-out), translate 900ms var(--ease-out);
}
[data-reveal][data-shown] { opacity: 1; translate: 0 0; }
```

`Reveal` (`src/components/ui.tsx`) pone `data-shown` en su envoltorio al entrar en pantalla, y la tarjeta está dentro de ese envoltorio.

## Target

- Los hijos directos de un elemento con `data-stagger`, dentro de un `[data-reveal]`, entran después de la tarjeta, uno a uno: suben 12 px y se funden en `700ms` con `var(--ease-out)` (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Retardos: 1.º `250ms`, 2.º `310ms`, 3.º `370ms`, es decir, 60 ms de escalonado tras un pequeño margen para que la tarjeta llegue antes.
- Movimiento reducido: sin desplazamiento, solo fundido (la regla global ya reduce la duración a 1 ms).
- Es decorativo y nunca bloquea la interacción: la lista no tiene elementos interactivos.

## Repo conventions to follow

- Revelados por atributo `data-*` y CSS en `src/app/globals.css` (bloque «Revelado al entrar en pantalla»). Los nuevos estilos van justo debajo de ese bloque.

## Steps

1. `src/app/globals.css`: justo debajo de la regla `[data-reveal][data-shown] { opacity: 1; translate: 0 0; }`, añade:
   ```css
   /* Hijos escalonados dentro de un revelado: entran después del contenedor, uno a uno. */
   [data-reveal] [data-stagger] > * {
     opacity: 0;
     translate: 0 12px;
     transition: opacity 700ms var(--ease-out), translate 700ms var(--ease-out);
   }
   [data-reveal][data-shown] [data-stagger] > * { opacity: 1; translate: 0 0; }
   [data-reveal][data-shown] [data-stagger] > :nth-child(1) { transition-delay: 250ms; }
   [data-reveal][data-shown] [data-stagger] > :nth-child(2) { transition-delay: 310ms; }
   [data-reveal][data-shown] [data-stagger] > :nth-child(3) { transition-delay: 370ms; }
   ```
2. En el mismo archivo, dentro del bloque `@media (prefers-reduced-motion: reduce)` que ya contiene `[data-reveal] { translate: none; }`, añade `[data-reveal] [data-stagger] > * { translate: none; }`.
3. `src/components/sections/Audience.tsx:21`: añade el atributo `data-stagger` al `<ul className="mt-auto space-y-3 pt-12">`.

## Boundaries

- Do NOT apply `data-stagger` anywhere else in this plan.
- Do NOT change the `Reveal` component.
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npx next build` sin errores.
- **Dev server note**: tras editar `globals.css`, si el servidor de desarrollo no recoge el cambio, páralo, borra `.next/dev` y vuelve a arrancarlo (es un problema conocido de este proyecto en Windows).
- **Feel check** (móvil real o DevTools a 390×844):
  - Al llegar a «Pymes», la tarjeta sube y, justo después, sus tres puntos aparecen de arriba abajo, con un ritmo perceptible pero rápido.
  - En DevTools → Animations al 10 %: los tres puntos empiezan con 60 ms de diferencia.
  - Con `prefers-reduced-motion: reduce`, los puntos aparecen sin moverse.
- **Done when**: los puntos de cada tarjeta de «Para quién» entran escalonados tras la tarjeta.
