# 003 — Que el campo de puntos responda al dedo y al scroll

- **Status**: DONE
- **Commit**: 8540bff
- **Severity**: HIGH
- **Category**: Missed opportunities / Interruptibility
- **Estimated scope**: 1 archivo (`src/components/DotField.tsx`), ~40 líneas

## Problem

El campo de puntos del hero (y del CTA final) es la pieza que define la marca: el orden que emerge de los datos. En escritorio los puntos se apartan del cursor con un muelle y se iluminan cerca de él. En táctil la interacción está **desactivada**:

```ts
/* src/components/DotField.tsx:50-52 — current */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const touch = matchMedia("(pointer: coarse)").matches;
const interactive = !reduce && !touch;
```

```ts
/* src/components/DotField.tsx:203-213 — current */
const onMove = (e: PointerEvent) => {
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
  wake();
};
const onLeave = () => { mouse.x = mouse.y = -9999; wake(); };
if (interactive) {
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
}
```

En móvil, en cuanto termina el ensamblado (unos 2,5 s) el hero se queda congelado. No usamos `pointermove` para el táctil porque el navegador envía `pointercancel` en cuanto empieza el desplazamiento y deja de emitir eventos. `touchmove`, en cambio, sigue llegando mientras se desplaza la página.

Física actual (líneas 120-134): muelle con `K = 0.08` y `FRICTION = 0.45` (≈ amortiguamiento crítico, vuelve sin rebote), con radio `REPEL_R = 140` y empuje `REPEL_PX = 26`.

## Target

1. **Respuesta al dedo (táctil)**: al tocar o arrastrar sobre el hero, los puntos alrededor del dedo se apartan y se iluminan con el mismo muelle sin rebote. Radio `110` px y empuje `22` px en táctil, más contenidos que en escritorio porque la pantalla es menor. Al levantar el dedo, vuelven a su sitio. Las escuchas son **pasivas**: nunca bloquean ni retrasan el scroll.
2. **Respuesta a la velocidad del scroll (todos los dispositivos)**: al desplazar la página, los puntos del campo se quedan ligeramente atrás, con una deriva vertical proporcional a la velocidad. Los puntos grandes se mueven más (`profundidad = fr / 1.5`), lo que crea paralaje. Al parar, vuelven con el mismo muelle. Deriva máxima: `14` px. Ganancia: `0.6 × px/frame`. Los puntos de la cima ya ensamblada no derivan: se multiplica por `(1 − p)`.
3. Con `prefers-reduced-motion: reduce`, nada de esto: queda como ahora, estático.
4. El bucle sigue durmiéndose cuando nada se mueve: no se gasta batería con la página quieta.

## Repo conventions to follow

- El bucle `frame()` decide si continúa con la variable `moving`. Cualquier fuente nueva de movimiento debe ponerla a `true` mientras dure (patrón de la línea 133).
- Los eventos llaman a `wake()` para reanudar el bucle (línea 207).

## Steps

1. Junto a las constantes (líneas 32-36) añade:
   ```ts
   const REPEL_R_TOUCH = 110;
   const REPEL_PX_TOUCH = 22;
   const SCROLL_GAIN = 0.6; // px de deriva por px/frame de scroll
   const SCROLL_MAX = 14; // deriva máxima en px
   ```
2. Línea 52: cambia `const interactive = !reduce && !touch;` por:
   ```ts
   const interactive = !reduce; // ratón en escritorio, dedo y scroll en táctil
   const repelR = touch ? REPEL_R_TOUCH : REPEL_R;
   const repelPx = touch ? REPEL_PX_TOUCH : REPEL_PX;
   let scrollV = 0; // velocidad de scroll suavizada, px/frame
   let lastY = window.scrollY;
   ```
3. Dentro de `frame()`, justo después de `const assembled = …` (línea 112), añade:
   ```ts
   scrollV *= 0.85; // la deriva se apaga sola al dejar de desplazar
   if (Math.abs(scrollV) > 0.05) moving = true;
   const drift = Math.max(-SCROLL_MAX, Math.min(SCROLL_MAX, scrollV * SCROLL_GAIN));
   ```
4. En el bloque `if (interactive) { … }` (líneas 120-134):
   - Sustituye `REPEL_R` por `repelR` (dos veces) y `REPEL_PX` por `repelPx`.
   - Después de calcular `gx`, `gy` y `g` (tras el `if (dist < …) { … }`), añade:
     ```ts
     gy += drift * (d.fr / 1.5) * (d.summit ? 1 - p : 1);
     ```
5. Sustituye el bloque de listeners (líneas 203-213) por:
   ```ts
   const at = (x: number, y: number) => {
     const r = canvas.getBoundingClientRect();
     mouse.x = x - r.left;
     mouse.y = y - r.top;
     wake();
   };
   const onMove = (e: PointerEvent) => { if (e.pointerType === "mouse") at(e.clientX, e.clientY); };
   const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) at(t.clientX, t.clientY); };
   const onLeave = () => { mouse.x = mouse.y = -9999; wake(); };
   const onScroll = () => {
     const y = window.scrollY;
     scrollV = scrollV * 0.5 + (y - lastY) * 0.5;
     lastY = y;
     wake();
   };
   if (interactive) {
     window.addEventListener("pointermove", onMove, { passive: true });
     document.documentElement.addEventListener("pointerleave", onLeave);
     window.addEventListener("touchstart", onTouch, { passive: true });
     window.addEventListener("touchmove", onTouch, { passive: true });
     window.addEventListener("touchend", onLeave, { passive: true });
     window.addEventListener("touchcancel", onLeave, { passive: true });
     window.addEventListener("scroll", onScroll, { passive: true });
   }
   ```
6. En la función de limpieza (líneas 215-222), añade las retiradas correspondientes:
   ```ts
   window.removeEventListener("touchstart", onTouch);
   window.removeEventListener("touchmove", onTouch);
   window.removeEventListener("touchend", onLeave);
   window.removeEventListener("touchcancel", onLeave);
   window.removeEventListener("scroll", onScroll);
   ```

## Boundaries

- Do NOT change the assembly timing (`DURATION`, delays), the summit geometry, colours or the halo.
- Do NOT call `preventDefault()` in any touch handler, and do not register non-passive touch listeners.
- Do NOT add dependencies.
- Do NOT touch `Hero.tsx` or `FinalCta.tsx`.
- If the quoted code doesn't match, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src` y `npx next build` sin errores.
- **Feel check**: en un **móvil real**, porque el táctil no se puede juzgar con el ratón.
  - Apoya el dedo sobre el hero: los puntos de alrededor se apartan y brillan. Al levantarlo vuelven sin rebote.
  - Arrastra el dedo hacia arriba para desplazar la página: el scroll responde **exactamente igual que antes**, sin retraso ni tirones, y los puntos bajo el dedo siguen reaccionando mientras la página se mueve.
  - Haz un scroll rápido: los puntos del campo se quedan un poco atrás, los grandes más que los pequeños, y se recolocan suavemente al parar. La cima ensamblada no se deforma.
  - En escritorio el cursor funciona como antes y el scroll añade la misma deriva sutil.
  - Con la página quieta durante 3 s, el bucle se detiene: en DevTools → Performance no hay frames continuos.
  - Con `prefers-reduced-motion: reduce`, el campo no reacciona ni al dedo ni al scroll.
- **Done when**: en móvil el hero reacciona al dedo y al scroll sin afectar a la fluidez del desplazamiento.
