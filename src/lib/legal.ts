/**
 * Datos del titular para los textos legales. PENDIENTE: el cliente debe confirmarlos todos.
 * Mientras valgan null, las páginas legales muestran un marcador visible en su lugar.
 */
export const COMPANY: Record<"legalName" | "taxId" | "address" | "registry" | "email" | "hosting", string | null> = {
  legalName: null, // Razón social
  taxId: null, // NIF / CIF
  address: null, // Domicilio social completo
  registry: null, // Datos de inscripción en el Registro Mercantil (si es sociedad)
  email: null, // Email de contacto para asuntos legales y de privacidad
  hosting: null, // Proveedor de alojamiento y del servicio de email
};

export const LEGAL_UPDATED = "23 de octubre de 2026";
