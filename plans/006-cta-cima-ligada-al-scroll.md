# 006 — En móvil, ensamblar la cima del CTA final con el scroll

- **Status**: DONE
- **Commit**: 8540bff
- **Severity**: LOW (oportunidad)
- **Category**: Missed opportunities
- **Estimated scope**: 1 archivo (`src/components/DotField.tsx`), ~15 líneas
- **Depends on**: 003 (reutiliza su escucha `scroll` y la variable `interactive`)

## Problem

En el CTA final («Hablemos de tu empresa»), la cima se ensambla **por tiempo** en cuanto el 35 % del canvas entra en pantalla:

```ts
/* src/components/DotField.tsx:190-196 — current */
const io = new IntersectionObserver(([e]) => {
  visible = e.isIntersecting;
  if (visible) {
    if (trigger === "view" && e.intersectionRatio > 0.35) begin();
    wake();
  }
}, { threshold: [0, 0.35] });
```
```ts
/* src/components/DotField.tsx:102-106 — current */
function progress(d: Dot, now: number) {
  if (reduce) return start < 0 ? 0 : 1;
  if (start < 0) return 0;
  return easeOut(Math.max(0, Math.min(1, (now - start - d.delay) / DURATION)));
}
```

En móvil, con un scroll rápido, el usuario suele llegar cuando la animación ya ha terminado. Además se pierde la ocasión de que sea el propio dedo el que «ordena los datos» justo antes de pedir el contacto, que es el momento de mayor intención.

`FinalCta.tsx:15` usa `trigger="view"`; el hero usa `trigger="load"` y no se toca.

## Target

- **Solo en táctil y sin movimiento reducido**, cuando `trigger === "view"`: el progreso del ensamblado depende de la **posición de scroll**, no del tiempo.
  - `scrollT = clamp((innerHeight × 0.9 − canvasTop) / (innerHeight × 0.7), 0, 1)`: empieza cuando la parte superior del canvas está al 90 % de la pantalla y termina cuando ha subido otro 70 % de la pantalla.
  - Cada punto mantiene su orden de llegada (de la base a la cima; la cima la última): `p = easeOut(clamp((scrollT − (d.delay / 1140) × 0.5) / 0.5, 0, 1))`. 1140 ms es el retardo máximo, el de la cima: `220 + 9 × 80 + 200`.
  - Es reversible: al subir, la cima se deshace en datos.
  - El atenuado del ruido (`assembled`) también sigue a `scrollT`.
- Escritorio, hero y movimiento reducido: sin cambios.

## Repo conventions to follow

- Todo el estado del canvas vive dentro del `useEffect` de `DotField`. El bucle se despierta con `wake()` y la escucha `scroll` añadida en el plan 003 ya lo llama.

## Steps

1. Tras la línea `const interactive = …` (modificada en el plan 003), añade:
   ```ts
   // Táctil: en el CTA final el ensamblado sigue al dedo (posición de scroll), no al reloj.
   const scrollMode = trigger === "view" && touch && !reduce;
   let scrollT = 0;
   ```
2. En `progress()`, como primera línea del cuerpo, añade:
   ```ts
   if (scrollMode) return easeOut(Math.max(0, Math.min(1, (scrollT - (d.delay / 1140) * 0.5) / 0.5)));
   ```
3. En `frame()`, como primera línea tras `ctx.clearRect(0, 0, w, h);`, añade:
   ```ts
   if (scrollMode) {
     const top = canvas.getBoundingClientRect().top;
     scrollT = Math.max(0, Math.min(1, (innerHeight * 0.9 - top) / (innerHeight * 0.7)));
   }
   ```
   y sustituye la línea `const assembled = …` por:
   ```ts
   const assembled = scrollMode ? easeOut(scrollT) : start < 0 ? 0 : easeOut(Math.min(1, (now - start) / (DURATION + 800)));
   ```
4. En el `IntersectionObserver`, cambia `if (trigger === "view" && e.intersectionRatio > 0.35) begin();` por `if (trigger === "view" && !scrollMode && e.intersectionRatio > 0.35) begin();`.

## Boundaries

- Do NOT change `Hero.tsx`, `FinalCta.tsx` or the `trigger="load"` path.
- Do NOT change the summit geometry, colours or delays.
- Do NOT add a second scroll listener (reuse the one from plan 003). If plan 003 is not merged, STOP and report.
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src` y `npx next build` sin errores.
- **Feel check** (móvil real):
  - Al llegar al CTA final, los puntos están dispersos. A medida que bajas, suben en orden de la base a la cima, y la cima se enciende en cian al final del recorrido.
  - Si paras a mitad, la cima se queda a medio formar. Si subes, se deshace.
  - Con un scroll rápido, la cima termina formada y quieta cuando el titular ocupa el centro de la pantalla.
  - En escritorio, el ensamblado sigue siendo por tiempo, como antes.
  - Con `prefers-reduced-motion: reduce`, la cima aparece formada.
- **Done when**: en táctil, la cima del CTA final se forma y se deshace siguiendo el scroll.
