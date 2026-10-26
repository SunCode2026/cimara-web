# 008 — Respuesta háptica al enviar el formulario con éxito

- **Status**: DONE
- **Commit**: 8540bff
- **Severity**: LOW (oportunidad)
- **Category**: Missed opportunities (momento de alta emoción)
- **Estimated scope**: 1 archivo (`src/components/ContactForm.tsx`), 2 líneas

## Problem

Enviar el formulario es el momento más valioso de la web, y en móvil solo se confirma de forma visual: el formulario se sustituye por «Mensaje recibido.» con un punto cian brillante. En táctil, una vibración breve en el mismo instante hace que la confirmación se sienta física. Es un momento raro, uno por visita como mucho, así que tiene presupuesto para algo especial.

```tsx
/* src/components/ContactForm.tsx:74-81 — current */
setStatus("sending");
try {
  const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(String(res.status));
  setStatus("success");
} catch {
  setStatus("error");
}
```

## Target

- Justo al confirmar el éxito, en el mismo momento que `setStatus("success")`, una vibración de **12 ms** con `navigator.vibrate(12)`.
- Solo en el éxito: ni en errores ni en validación, para que la vibración signifique siempre «enviado».
- Llamada segura: `navigator.vibrate?.(12)`. iOS Safari no implementa la API y la ignora sin error; los escritorios tampoco vibran.

## Repo conventions to follow

- Comentarios breves en español que explican el porqué (ver los del propio archivo).

## Steps

1. `src/components/ContactForm.tsx`, justo después de `setStatus("success");` (línea 78), añade:
   ```tsx
   // Confirmación háptica breve en el momento del éxito (Android; iOS y escritorio la ignoran).
   navigator.vibrate?.(12);
   ```

## Boundaries

- Do NOT add vibration anywhere else (errors, validation, buttons).
- Do NOT change the success UI or the submit logic.
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src` y `npx next build` sin errores.
- **Feel check** (Android real, con la vibración del sistema activada):
  - Rellena y envía el formulario: notas un toque breve y seco en el mismo instante en que aparece «Mensaje recibido.», sin desfase.
  - Envía con errores: no vibra.
  - En iPhone y escritorio: sin errores en consola y sin cambios.
- **Done when**: un envío correcto produce una vibración de 12 ms en Android y nada en los demás casos.
