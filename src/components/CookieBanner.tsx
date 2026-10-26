"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { consentStore, parseConsent, saveConsent } from "@/lib/consent";
import { EASE_OUT } from "./ui";

const btn =
  "inline-flex h-11 flex-1 items-center justify-center rounded-full px-5 text-small font-medium whitespace-nowrap transition-[background-color,scale] duration-200 active:scale-[0.97]";
const primary = `${btn} bg-mist text-ink hover:bg-[#fff]`;
const secondary = `${btn} text-mist shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-surface-2`;

function Switch({ checked, onChange, disabled, labelledBy }: { checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean; labelledBy: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className="relative h-7 w-12 shrink-0 rounded-full bg-surface-2 shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition-colors duration-300 aria-checked:bg-mist disabled:opacity-50"
    >
      <span
        aria-hidden
        className={`absolute top-1 left-1 size-5 rounded-full transition-[translate,background-color] duration-300 ease-out ${checked ? "translate-x-5 bg-ink" : "bg-text-2"}`}
      />
    </button>
  );
}

export function CookieBanner() {
  const raw = useSyncExternalStore(consentStore.subscribe, consentStore.getSnapshot, consentStore.getServerSnapshot);
  const saved = parseConsent(raw);
  const [forced, setForced] = useState(false); // reabierto desde «Configurar cookies»
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(
    () =>
      consentStore.onOpen(() => {
        setAnalytics(parseConsent(consentStore.getSnapshot())?.analytics ?? false);
        setSettings(true);
        setForced(true);
      }),
    [],
  );

  // Al reabrirlo, el foco va al panel para que el teclado llegue sin rodeos.
  useEffect(() => {
    if (forced) panel.current?.focus();
  }, [forced]);

  const open = raw !== null && (!saved || forced);

  function decide(choice: { analytics: boolean }) {
    saveConsent(choice);
    setForced(false);
    setSettings(false);
  }

  return (
    // Con movimiento reducido, sin desplazamiento: solo fundido.
    <MotionConfig reducedMotion="user">
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panel}
          tabIndex={-1}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-text`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT, delay: forced ? 0 : 0.8 } }}
          exit={{ opacity: 0, y: 24, transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] } }}
          className="fixed inset-x-3 bottom-3 z-[55] rounded-lg border border-line-strong bg-surface-1/90 p-6 shadow-[0_32px_80px_-32px_rgb(0_0_0/0.9)] backdrop-blur-xl outline-none sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[26rem]"
        >
          <h2 id={`${id}-title`} className="text-h3">
            Cookies
          </h2>
          <p id={`${id}-text`} className="mt-2 text-small text-text-2">
            Usamos cookies técnicas para que el sitio funcione. Las de analítica, que nos ayudarían a mejorarlo, solo se activan si las
            aceptas.{" "}
            <Link href="/cookies" className="text-mist underline underline-offset-4">
              Política de cookies
            </Link>
          </p>

          {settings && (
            <ul className="mt-5 border-t border-line">
              <li className="flex items-center justify-between gap-4 border-b border-line py-4">
                <div>
                  <p id={`${id}-nec`} className="text-small font-medium">
                    Técnicas
                  </p>
                  <p className="text-small text-text-3">Necesarias. Siempre activas.</p>
                </div>
                <Switch checked disabled labelledBy={`${id}-nec`} />
              </li>
              <li className="flex items-center justify-between gap-4 border-b border-line py-4">
                <div>
                  <p id={`${id}-ana`} className="text-small font-medium">
                    Analítica
                  </p>
                  <p className="text-small text-text-3">Medición anónima del uso del sitio.</p>
                </div>
                <Switch checked={analytics} onChange={setAnalytics} labelledBy={`${id}-ana`} />
              </li>
            </ul>
          )}

          {/* Rechazar y aceptar con el mismo peso visual, como exige la AEPD. */}
          <div className="mt-5 flex flex-wrap gap-2">
            {settings ? (
              <>
                <button type="button" className={secondary} onClick={() => decide({ analytics })}>
                  Guardar preferencias
                </button>
                <button type="button" className={primary} onClick={() => decide({ analytics: true })}>
                  Aceptar todas
                </button>
              </>
            ) : (
              <>
                <button type="button" className={secondary} onClick={() => decide({ analytics: false })}>
                  Rechazar
                </button>
                <button type="button" className={primary} onClick={() => decide({ analytics: true })}>
                  Aceptar
                </button>
                <button type="button" className="w-full py-2 text-small text-text-2 underline-offset-4 hover:text-mist hover:underline" onClick={() => setSettings(true)}>
                  Configurar
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </MotionConfig>
  );
}
