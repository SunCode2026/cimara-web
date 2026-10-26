"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { COMPANY_SIZES } from "@/lib/content";
import { validateContact, type ContactData, type ContactErrors } from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "error";

const field =
  "w-full rounded-md border border-line-strong bg-surface-1 px-4 text-mist placeholder:text-text-3 transition-[border-color,background-color] duration-200 " +
  "hover:border-[rgb(245_245_247/0.28)] focus:border-mist focus:bg-surface-2 focus:outline-none aria-[invalid=true]:border-error";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small text-text-2">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="animate-rise text-small text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function read(form: HTMLFormElement): ContactData {
  const f = new FormData(form);
  return {
    name: String(f.get("name") ?? ""),
    company: String(f.get("company") ?? ""),
    email: String(f.get("email") ?? ""),
    size: String(f.get("size") ?? ""),
    message: String(f.get("message") ?? ""),
    privacy: f.get("privacy") === "on",
    website: String(f.get("website") ?? ""),
  };
}

export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactData, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");

  // Validación en línea: tras salir de un campo, y en vivo si ya tenía error.
  function revalidate(form: HTMLFormElement | null, name?: keyof ContactData) {
    if (!form) return;
    const next = validateContact(read(form));
    if (name) setTouched((t) => ({ ...t, [name]: true }));
    setErrors(next);
  }
  const show = (k: keyof ContactData) => (touched[k] ? errors[k] : undefined);
  const a11y = (k: keyof ContactData) => ({
    "aria-invalid": show(k) ? true : undefined,
    "aria-describedby": show(k) ? `c-${k}-error` : undefined,
    onBlur: (e: { currentTarget: { form: HTMLFormElement | null } }) => revalidate(e.currentTarget.form, k),
    onChange: (e: { currentTarget: { form: HTMLFormElement | null } }) => touched[k] && revalidate(e.currentTarget.form),
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = read(e.currentTarget);
    const errs = validateContact(data);
    setErrors(errs);
    setTouched({ name: true, company: true, email: true, size: true, message: true, privacy: true });
    const first = Object.keys(errs)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative">
      {status === "success" ? (
          <div
            role="status"
            className="flex min-h-[32rem] animate-rise flex-col justify-center rounded-lg border border-line bg-surface-1 p-8 lg:p-12"
          >
            <span aria-hidden className="size-3 rounded-full bg-cyan shadow-[0_0_24px_4px_rgb(47_211_245/0.55)]" />
            <p className="mt-8 text-h2 font-display font-medium">Mensaje recibido.</p>
            <p className="mt-4 max-w-[26rem] text-text-2">Gracias. Revisaremos lo que nos cuentas y te escribiremos pronto para proponerte una primera conversación.</p>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={onSubmit}
            className="grid gap-5 rounded-lg border border-line bg-surface-1/60 p-6 backdrop-blur-sm sm:grid-cols-2 lg:p-10"
          >
            <Field id="c-name" label="Nombre" error={show("name")}>
              <input id="c-name" name="name" autoComplete="name" className={`${field} h-13`} {...a11y("name")} />
            </Field>
            <Field id="c-company" label="Empresa" error={show("company")}>
              <input id="c-company" name="company" autoComplete="organization" className={`${field} h-13`} {...a11y("company")} />
            </Field>
            <Field id="c-email" label="Email de empresa" error={show("email")}>
              <input id="c-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="nombre@empresa.es" className={`${field} h-13`} {...a11y("email")} />
            </Field>
            <Field id="c-size" label="Tamaño de la empresa" error={show("size")}>
              <select id="c-size" name="size" defaultValue="" required className={`${field} h-13 appearance-none invalid:text-text-3 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%23A1A1A6%22 stroke-width=%221.5%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat pr-10`} {...a11y("size")}>
                <option value="" disabled>
                  Elige una opción
                </option>
                {COMPANY_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field id="c-message" label="¿Qué te gustaría mejorar?" error={show("message")}>
                <textarea id="c-message" name="message" rows={4} placeholder="Por ejemplo: dedicamos 10 horas a la semana a pasar pedidos del correo al ERP." className={`${field} resize-y py-3`} {...a11y("message")} />
              </Field>
            </div>

            {/* Trampa para bots: oculta a personas y lectores de pantalla. */}
            <div aria-hidden className="absolute -left-[9999px]">
              <label htmlFor="c-website">Web</label>
              <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="sm:col-span-2">
              <label className="relative flex cursor-pointer items-start gap-3 text-small text-text-2">
                <input
                  type="checkbox"
                  name="privacy"
                  className="peer mt-0.5 size-5 shrink-0 cursor-pointer appearance-none rounded-sm border border-line-strong bg-surface-1 transition-colors checked:border-mist checked:bg-mist aria-[invalid=true]:border-error"
                  {...a11y("privacy")}
                  aria-describedby={show("privacy") ? "c-privacy-error" : undefined}
                />
                <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute top-1 left-1 size-3 stroke-ink opacity-0 peer-checked:opacity-100">
                  <path d="M2 6.5l2.5 2.5L10 3.5" fill="none" strokeWidth="1.8" />
                </svg>
                <span>
                  He leído y acepto la{" "}
                  <Link href="/privacidad" className="text-mist underline underline-offset-4">
                    política de privacidad
                  </Link>
                  .
                </span>
              </label>
              {show("privacy") && (
                <p id="c-privacy-error" className="mt-2 animate-rise text-small text-error">
                  {show("privacy")}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-small text-text-3">Responsable: CIMARA. Usamos tus datos solo para responderte.</p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex h-13 shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-mist px-7 font-medium text-ink transition-[background-color,scale] duration-200 hover:bg-[#fff] active:scale-[0.97] disabled:cursor-progress disabled:opacity-70"
              >
                <span
                  aria-hidden
                  className={`size-2 rounded-full bg-cyan transition-shadow duration-300 group-hover:shadow-[0_0_14px_3px_rgb(47_211_245/0.6)] ${status === "sending" ? "animate-pulse" : ""}`}
                />
                {status === "sending" ? "Enviando…" : "Enviar solicitud"}
              </button>
            </div>

            <div aria-live="assertive" className="sm:col-span-2">
              {status === "error" && (
                <p className="rounded-md border border-error/40 px-4 py-3 text-small text-error">
                  No hemos podido enviar el mensaje. Inténtalo de nuevo o escríbenos directamente por email.
                </p>
              )}
            </div>
          </form>
        )}
    </div>
  );
}
