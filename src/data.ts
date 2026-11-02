import type { Project, TechItem } from './types';
import { MAINTENANCE, type ServiceId } from './config/pricing';

/** Detail copy for each service. Names, prices and lead times live in config/pricing.ts. */
export interface ServiceDetail {
  highlights: readonly string[];
  idealFor: string;
}

export const SERVICE_DETAILS: Record<ServiceId, ServiceDetail> = {
  catalogo: {
    highlights: [
      'Tus productos o servicios con fotos y precios',
      'Un enlace listo para compartir por WhatsApp y redes',
      'Se ve bien en cualquier móvil',
      'Botón para que el cliente te escriba directo',
    ],
    idealFor: 'Negocios que hoy mandan fotos y precios uno por uno por WhatsApp.',
  },
  landing: {
    highlights: [
      'Una página con lo esencial de tu negocio',
      'Botón de contacto por WhatsApp',
      'Diseño pensado para el móvil',
      'Textos claros y bien ordenados',
    ],
    idealFor: 'Profesionales y emprendimientos que quieren una presencia sencilla y clara.',
  },
  tienda: {
    highlights: [
      'Catálogo de productos con variantes',
      'Pedidos organizados para cerrar la venta',
      'Pensada para comprar desde el móvil',
      'Carga de productos disponible como extra',
    ],
    idealFor: 'Negocios con varios productos que quieren vender también por internet.',
  },
  rediseno: {
    highlights: [
      'Revisión de tu web actual',
      'Diseño nuevo, más limpio y ligero',
      'Adaptada al móvil',
      'Conservamos tu contenido',
    ],
    idealFor: 'Negocios que ya tienen web, pero se ve anticuada o carga lenta.',
  },
  gestion: {
    highlights: [
      'Hecho a la medida de cómo trabajas',
      'Inventario, ventas, reservas o clientes en un solo lugar',
      'Sustituye cuadernos y hojas sueltas',
      'Precio y plazo finales según el alcance',
    ],
    idealFor: 'Negocios que ya no pueden llevar todo a mano.',
  },
  bots: {
    highlights: [
      'Respuestas y avisos automáticos',
      'Reportes y envío de datos sin hacerlo a mano',
      'Conectan las herramientas que ya usas',
      'Adaptados a tu forma de trabajar',
    ],
    idealFor: 'Negocios que repiten las mismas tareas todos los días.',
  },
  digitalmenu: {
    highlights: [
      'Carta digital con tus platos y precios',
      'Instalación incluida',
      'Fácil de actualizar cuando cambie algo',
      'Lista en pocos días',
    ],
    idealFor: 'Restaurantes, cafeterías y bares.',
  },
  mantenimiento: {
    highlights: MAINTENANCE.includes ?? [],
    idealFor: 'Quien ya tiene su web y prefiere olvidarse de lo técnico.',
  },
};

export const PROJECTS: Project[] = [
  {
    id: 'sazon-de-lola',
    serviceId: 'gestion',
    title: 'La Sazón de Lola',
    description:
      'Plataforma gastronómica de vanguardia con sistema de reservas en tiempo real y gestión de inventario automatizada.',
    longDescription:
      'Para La Sazón de Lola creamos una experiencia digital a la altura de su cocina de autor. El sitio combina fotografía culinaria de alta definición con un motor de reservas instantáneo sincronizado en tiempo real y un panel para la gestión de mesas e inventario de cocina.',
    tags: ['Astro', 'Tailwind', 'Sanity'],
    category: 'web',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDqN2MYa9bhnwvjDiJdBGtwYrYYKW9Zv7KWdJqNO4MzX9BnfciFoqSJQxdmcWNkC_s8HdxYTKqVqlJV2R0G0az7cKuwIXBS9YxGhunY_hPm9JKE-5eVZcuAwVa6tYt1LUOMlLgpqM96XWiJe3kXPsjjKjKPiyKANUR7L4U1K2tsXmXDzKrFyJSpDmoR1OO_wK4dELRd09z63kb_Y2MMpIz6o9K3kTAaQ1WsoNJHnMNesElnQzfyemg7rQ',
    metrics: [
      { label: 'Tiempo de Carga', value: '0.4s' },
      { label: 'Reservas Automáticas', value: '+340% mo.' },
      { label: 'Lighthouse SEO', value: '100/100' }
    ],
    client: 'Lola Gastronomía S.A.',
    year: '2025'
  },
  {
    id: 'barba-negra',
    serviceId: 'tienda',
    title: 'Barba Negra',
    description:
      'E-commerce premium para productos de cuidado personal masculino, con una experiencia de usuario cinematográfica.',
    longDescription:
      'Un e-commerce brutalista y oscuro para una firma de cuidado de barba de alta gama. Integramos una experiencia inmersiva que permite a los usuarios previsualizar kits en 360°, suscribirse a envíos mensuales y disfrutar de un checkout fluido.',
    tags: ['React', 'Shopify'],
    category: 'ecommerce',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsLCU_o6ScBjxQNsDRU1Xgrr4RC_ikLvCwRwuwrnEDZwW-uQ-OG0JLfeshduRZJrxOP-CsZPyrYdywHbVpWhVB_AJVOkM93n9m9UE8xdnZrYguiTlO6ACEtBVGqdvuA62Pt6UqfUjqlLsynYBjAz6KZDkS9pVeUUXd0lL8oukUSH7Zu7cIo68LEbcKa0jn09RDlDTvQTcBCIOiQGAlifOQ_NVZT7li4Dc-llHbn6DktXe0wz8fBSr_6Q',
    metrics: [
      { label: 'Tasa de Conversión', value: '4.8%' },
      { label: 'Ticket Promedio', value: '+42%' },
      { label: 'Fidelización Suscritos', value: '89%' }
    ],
    client: 'Barba Negra Grooming Co.',
    year: '2025'
  },
  {
    id: 'tropical-vibes',
    serviceId: 'landing',
    title: 'Tropical Vibes',
    description:
      'Landing page interactiva para un resort de lujo, integrando visuales 3D y una navegación fluida por capas.',
    longDescription:
      'Desarrollamos el portal inmersivo para un resort ecológico en el Caribe. Mediante visualizaciones con Three.js y transiciones orgánicas con GSAP, los visitantes pueden recorrer villas tropicales, consultar el pronóstico local del mar y cotizar su estadía.',
    tags: ['Three.js', 'GSAP'],
    category: 'interactive',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCboIh_L9uC8mIkqvkC8Xn-cUOtsxnFyMUN_TzRXW60jxJOv5Hb_IGYmQj_tW_42UkvT6t2DkIGD1Pebtk1Pxx7PZ38FLwcsMLAzKBXGKrkRR8dBRYWNA90o_bG4OoaQEGZSO2T8B6IvZVxcOXqh_GkMznySsGP2ijxNK8Rt8R_jBE9P76saiCTuVakh-je7YHJC4q5D1mXBzB9p2zNV9P_rrJUvoaH3yjyNbVKCPqr9uWpIoHUX2wTCA',
    metrics: [
      { label: 'Tiempo en página', value: '4m 15s' },
      { label: 'Interacción con 3D', value: '92%' },
      { label: 'Cotizaciones Directas', value: '+210%' }
    ],
    client: 'Tropical Vibes Resort & Spa',
    year: '2026'
  }
];

export const TECH_STACK: TechItem[] = [
  {
    name: 'Astro',
    category: 'Framework Web',
    description: 'Cero JS innecesario por defecto, velocidad de carga instantánea para webs estáticas e híbridas.'
  },
  {
    name: 'Tailwind',
    category: 'Estilos & UI',
    description: 'Diseño arquitectónico con CSS utilitario de ultra alto rendimiento y consistencia.'
  },
  {
    name: 'React',
    category: 'UI Dinámica',
    description: 'El estándar industrial para crear interfaces y dashboards interactivos complejos.'
  },
  {
    name: 'Next.js',
    category: 'Full-Stack Web',
    description: 'Server-Side Rendering, API Routes e infraestructura escalable para apps empresariales.'
  },
  {
    name: 'Node.js',
    category: 'Backend & APIs',
    description: 'Servidores de alto rendimiento, microservicios y conectores de automatización.'
  },
  {
    name: 'Python',
    category: 'Automation & AI',
    description: 'Scripts de automatización industrial, análisis de datos y conectividad inteligente.'
  },
  {
    name: 'Shopify',
    category: 'E-commerce',
    description: 'Integraciones Headless y personalizadas para tiendas que facturan a gran escala.'
  },
  {
    name: 'Sanity',
    category: 'Headless CMS',
    description: 'Gestor de contenido estructurado que le otorga control total a tu equipo sin romper el código.'
  }
];

export const PROCESS_STEPS = [
  {
    step: 1,
    number: '01',
    title: 'Escuchamos',
    description: 'Entendemos tus metas, tu usuario objetivo y los desafíos de tu negocio.',
    detail: 'Sesión de discovery técnico donde identificamos cuellos de botella y trazamos requerimientos funcionales claros.'
  },
  {
    step: 2,
    number: '02',
    title: 'Diseñamos',
    description: 'Creamos la arquitectura y experiencia visual en alta fidelidad.',
    detail: 'Prototipos en Figma con sistema de diseño modular, pruebas de usabilidad y aprobación antes del primer commit.'
  },
  {
    step: 3,
    number: '03',
    title: 'Construimos',
    description: 'Código limpio, robusto y escalable con el mejor stack actual.',
    detail: 'Desarrollo ágil con entregas incrementales, CI/CD, auditorías automáticas de velocidad y seguridad.'
  },
  {
    step: 4,
    number: '04',
    title: 'Lanzamos',
    description: 'Despliegue, monitoreo continuo y soporte técnico prioritario.',
    detail: 'Puesta en producción sin tiempo de caída, optimización de infraestructura y telemetría activa en tiempo real.'
  }
];
