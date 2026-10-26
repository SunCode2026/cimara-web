/** Textos de la home y datos del sitio. Lo marcado PENDIENTE requiere confirmación del cliente. */

export const SITE = {
  name: "CIMARA",
  url: "https://cimara.ai",
  email: "hola@cimara.ai", // PENDIENTE: confirmar buzón real
  linkedin: "https://www.linkedin.com/company/cimara", // PENDIENTE: confirmar URL
  claim: "De los datos a la decisión.",
  description:
    "Consultoría de inteligencia artificial y automatización. Automatizamos procesos e incorporamos sistemas de IA útiles y medibles en pymes y grandes empresas.",
};

export const NAV = [
  { href: "/servicios", label: "Servicios" },
  { href: "/#metodo", label: "Método" },
  { href: "/sobre-cimara", label: "Sobre CIMARA" },
];

export const PROBLEMS = [
  {
    title: "Tareas repetitivas",
    text: "Copiar, pegar, revisar, repetir. Horas de tu equipo cada semana en trabajo que no necesita criterio.",
  },
  {
    title: "Datos dispersos",
    text: "Información repartida entre hojas de cálculo, correos y herramientas que no se hablan entre sí.",
  },
  {
    title: "Procesos lentos",
    text: "Aprobaciones, informes y respuestas que esperan a una persona. Cada cuello de botella cuesta tiempo y clientes.",
  },
];

/** `text`: resumen para la home. `lead`, `includes` y `examples`: detalle en /servicios. */
export const SERVICES = [
  {
    slug: "automatizacion",
    title: "Automatización de procesos",
    text: "Facturación, altas, informes, conciliaciones. Lo repetitivo pasa a hacerse solo, sin errores y con trazabilidad.",
    lead: "Identificamos las tareas que tu equipo repite cada día y las convertimos en procesos que funcionan solos. Con registro de cada paso y una persona que valida lo importante.",
    includes: [
      "Mapa del proceso actual y de dónde se pierde el tiempo",
      "Flujos automáticos entre correo, documentos y tus aplicaciones",
      "Lectura de facturas, albaranes y formularios con IA",
      "Alertas y validación humana en los puntos críticos",
    ],
    examples: ["Facturación y conciliación bancaria", "Altas de clientes y proveedores", "Informes periódicos que se generan solos"],
  },
  {
    slug: "agentes",
    title: "Agentes y asistentes de IA",
    text: "Asistentes que responden, clasifican y redactan con tus datos y tus reglas. Siempre con una persona al mando.",
    lead: "Asistentes que trabajan con la información de tu empresa: responden, clasifican, redactan y ejecutan tareas sencillas. Con límites claros y traspaso a una persona cuando hace falta.",
    includes: [
      "Asistentes internos sobre tus documentos y procedimientos",
      "Atención al cliente con traspaso a tu equipo",
      "Agentes que preparan borradores, resúmenes y respuestas",
      "Reglas, permisos y registro de lo que hace cada agente",
    ],
    examples: ["Clasificación del correo entrante", "Respuestas a preguntas frecuentes de clientes", "Búsqueda en manuales y documentación interna"],
  },
  {
    slug: "integracion",
    title: "Integración con tus herramientas",
    text: "Conectamos la IA con tu ERP, CRM, correo y documentos. Sin cambiar de software ni rehacer lo que ya funciona.",
    lead: "La IA solo es útil si trabaja donde ya trabaja tu equipo. La conectamos con el software que usáis, sin migraciones innecesarias ni herramientas nuevas que aprender.",
    includes: [
      "Conexión con ERP, CRM, correo y almacenamiento de documentos",
      "Sincronización de datos entre aplicaciones que hoy no se hablan",
      "Integraciones seguras, con permisos y trazabilidad",
      "Documentación para que tu equipo técnico pueda mantenerlas",
    ],
    examples: ["Pedidos del correo directos al ERP", "Datos del CRM enriquecidos automáticamente", "Documentos archivados y etiquetados al llegar"],
  },
  {
    slug: "datos",
    title: "Análisis de datos",
    text: "Ordenamos tus datos y los convertimos en cuadros de mando y previsiones que ayudan a decidir.",
    lead: "Reunimos los datos que hoy están repartidos, los limpiamos y los convertimos en información para decidir: qué está pasando, por qué y qué es probable que pase.",
    includes: [
      "Inventario y limpieza de las fuentes de datos",
      "Cuadros de mando con los indicadores que importan",
      "Modelos de previsión de demanda, ventas o carga de trabajo",
      "Consultas en lenguaje natural sobre tus propios datos",
    ],
    examples: ["Previsión de ventas por producto", "Seguimiento de márgenes y costes", "Detección de anomalías en pedidos o pagos"],
  },
  {
    slug: "formacion",
    title: "Formación de equipos",
    text: "Tu equipo aprende a usar la IA con criterio y a mantener los sistemas por su cuenta.",
    lead: "Formación práctica, adaptada a cada perfil y sobre casos de tu empresa. El objetivo es que tu equipo use la IA con criterio y no dependa de nosotros para el día a día.",
    includes: [
      "Talleres para dirección: dónde aporta la IA y dónde no",
      "Formación práctica por departamento",
      "Buenas prácticas de privacidad y uso responsable",
      "Guías y acompañamiento tras cada implantación",
    ],
    examples: ["Uso de asistentes en el trabajo diario", "Redacción de instrucciones eficaces", "Revisión crítica de resultados de la IA"],
  },
];

export const METHOD = [
  {
    title: "Diagnóstico",
    text: "Analizamos tus procesos y tus datos. Detectamos dónde se pierde el tiempo y qué merece automatizarse.",
  },
  {
    title: "Diseño",
    text: "Definimos la solución, el impacto esperado y cómo lo vamos a medir. Antes de escribir una línea de código.",
  },
  {
    title: "Implantación",
    text: "Construimos el sistema y lo integramos con tus herramientas. Por fases, sin parar la operación.",
  },
  {
    title: "Optimización",
    text: "Medimos, ajustamos y escalamos lo que funciona. Te acompañamos hasta que el sistema funciona solo.",
  },
];

export const AUDIENCES = [
  {
    title: "Pymes",
    text: "Sin departamento técnico propio. Soluciones concretas, con retorno claro y sin proyectos interminables.",
    points: ["Empezamos por un proceso concreto", "Sobre las herramientas que ya usáis", "Sin necesidad de equipo técnico"],
  },
  {
    title: "Grandes empresas",
    text: "Equipos, sistemas y datos a escala. IA integrada con tu arquitectura, tu seguridad y tu gobierno del dato.",
    points: [
      "Integración con ERP, CRM y sistemas propios",
      "Diseño alineado con el RGPD y el Reglamento europeo de IA",
      "Despliegue por áreas con medición del impacto",
    ],
  },
];

/** PENDIENTE: sin datos reales todavía. `value: null` muestra un marcador visible. */
export const METRICS: { value: number | null; suffix: string; label: string }[] = [
  { value: null, suffix: "h", label: "recuperadas al mes por equipo" },
  { value: null, suffix: "%", label: "de tareas repetitivas automatizadas" },
  { value: null, suffix: "%", label: "menos tiempo de respuesta" },
  { value: null, suffix: "meses", label: "para recuperar la inversión" },
];

export const FAQS = [
  {
    q: "¿Necesito tener los datos ordenados para empezar?",
    a: "No. Ordenarlos suele ser parte del diagnóstico. Partimos de lo que tienes y te decimos qué hace falta y qué no.",
  },
  {
    q: "¿Tengo que cambiar mis herramientas actuales?",
    a: "Casi nunca. Integramos la IA con el software que ya usáis: ERP, CRM, correo, documentos y hojas de cálculo.",
  },
  {
    q: "¿Qué pasa con la privacidad de mis datos?",
    a: "Diseñamos cada sistema conforme al RGPD. Elegimos proveedores y configuraciones que no usan tus datos para entrenar modelos y te explicamos dónde se alojan.",
  },
  {
    q: "¿Cuánto tarda un proyecto?",
    a: "Depende del alcance. Tras el diagnóstico tendrás un plan por fases, con plazos y costes para cada una.",
  },
  {
    q: "¿La IA va a sustituir a mi equipo?",
    a: "Nuestro objetivo es quitarle trabajo repetitivo, no personas. Las decisiones importantes siguen en manos de tu equipo.",
  },
  {
    q: "¿Cómo sé si merece la pena?",
    a: "Antes de implantar nada acordamos qué vamos a medir y qué resultado esperamos. Si no compensa, te lo decimos.",
  },
  {
    q: "¿Seguís después de la implantación?",
    a: "Sí. La fase de optimización incluye seguimiento, ajustes y formación para que tu equipo sea autónomo.",
  },
];

export const COMPANY_SIZES = ["1–10 personas", "11–50 personas", "51–250 personas", "Más de 250 personas"];
