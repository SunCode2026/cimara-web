import { Button } from "@/components/Button";
import { SummitMark } from "@/components/SummitMark";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-svh flex-col items-start justify-center py-40">
      <SummitMark lit={3} className="w-20" />
      <p className="label mt-10">Error 404</p>
      <h1 className="mt-5 max-w-[14ch] text-display">Este dato no está en su sitio.</h1>
      <p className="mt-6 max-w-[30rem] text-lead text-text-2">La página que buscas no existe o ha cambiado de dirección.</p>
      <div className="mt-10">
        <Button href="/">Volver al inicio</Button>
      </div>
    </section>
  );
}
