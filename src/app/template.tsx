import { ViewTransition, type ReactNode } from "react";

/**
 * La plantilla se vuelve a montar en cada navegación: la página saliente hace «exit» y la nueva «enter».
 * Las animaciones (clase `page`) están en globals.css; la navegación y el pie se quedan quietos.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}
