import { COMPANY_SIZES } from "./content";

export type ContactData = {
  name: string;
  company: string;
  email: string;
  size: string;
  message: string;
  privacy: boolean;
  website?: string; // trampa para bots: debe llegar vacío
};

export type ContactErrors = Partial<Record<keyof ContactData, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mismas reglas en el navegador y en el servidor. */
export function validateContact(d: Partial<ContactData>): ContactErrors {
  const e: ContactErrors = {};
  const name = d.name?.trim() ?? "";
  const company = d.company?.trim() ?? "";
  const email = d.email?.trim() ?? "";
  const message = d.message?.trim() ?? "";
  if (name.length < 2) e.name = "Escribe tu nombre.";
  else if (name.length > 120) e.name = "El nombre es demasiado largo.";
  if (company.length < 2) e.company = "Escribe el nombre de tu empresa.";
  else if (company.length > 160) e.company = "El nombre es demasiado largo.";
  if (!EMAIL.test(email) || email.length > 200) e.email = "Revisa el email: parece incompleto.";
  if (!COMPANY_SIZES.includes(d.size ?? "")) e.size = "Elige el tamaño de tu empresa.";
  if (message.length < 10) e.message = "Cuéntanos un poco más (mínimo 10 caracteres).";
  else if (message.length > 4000) e.message = "El mensaje es demasiado largo (máximo 4000 caracteres).";
  if (d.privacy !== true) e.privacy = "Necesitamos tu consentimiento para responderte.";
  return e;
}
