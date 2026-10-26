import { validateContact, type ContactData } from "@/lib/contact";

export async function POST(request: Request) {
  let data: Partial<ContactData>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Solicitud no válida." }, { status: 400 });
  }

  // Bot: respondemos como si todo fuera bien y no hacemos nada.
  if (data.website) return Response.json({ ok: true });

  const errors = validateContact(data);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });

  // ponytail: sin proveedor de email todavía; conectar Resend (u otro) aquí cuando haya buzón y dominio verificados.
  // Sin datos personales en los logs (RGPD).
  console.info("[contacto] solicitud válida recibida");
  return Response.json({ ok: true });
}
