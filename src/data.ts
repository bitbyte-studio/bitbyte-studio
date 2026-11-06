import type { Project } from './types';
import { MAINTENANCE, PAYMENT, REVISION_ROUNDS, type ServiceId } from './config/pricing';
import barbaNegraCard from './assets/portfolio/barba-negra-card.webp';
import barbaNegraModal from './assets/portfolio/barba-negra-modal.webp';
import sazonLolaCard from './assets/portfolio/sazon-lola-card.webp';
import sazonLolaModal from './assets/portfolio/sazon-lola-modal.webp';
import tropicalVibesCard from './assets/portfolio/tropical-vibes-card.webp';
import tropicalVibesModal from './assets/portfolio/tropical-vibes-modal.webp';

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
  medida: {
    highlights: [
      'Apps para móvil, webs especiales, paneles internos o programas para PC',
      'Funciona con o sin internet, según lo que necesites',
      'Integraciones y funciones fuera de los planes fijos',
      'Nos adaptamos a tu idea y a tu presupuesto',
      'Precio y plazo cerrados por WhatsApp antes de empezar',
    ],
    idealFor: 'Quien necesita una app, un sistema o algo concreto que no encaja en los paquetes anteriores.',
  },
  mantenimiento: {
    highlights: MAINTENANCE.includes ?? [],
    idealFor: 'Quien ya tiene su web y prefiere olvidarse de lo técnico.',
  },
};

/** Demos built by Bit & Byte Studio to show what we make. They are not client projects. */
export const PROJECTS: readonly Project[] = [
  {
    id: 'sazon-de-lola',
    serviceId: 'catalogo',
    title: 'La Sazón de Lola',
    category: 'Restaurante',
    description:
      'Web para restaurante de comida criolla: el cliente ve el menú por categorías, arma su pedido y reserva mesa directo por WhatsApp.',
    features: [
      'Menú por categorías con filtros',
      'Pedido y reserva por WhatsApp',
      'Detalle de plato',
      'Ubicación con mapa',
    ],
    image: { card: sazonLolaCard, modal: sazonLolaModal },
    liveUrl: 'https://sazon-lola.vercel.app',
    badge: 'Demo',
  },
  {
    id: 'barba-negra',
    serviceId: 'landing',
    title: 'Barba Negra',
    category: 'Barbería',
    description:
      'Web para barbería con servicios y precios, galería de trabajos y reserva de turnos que llega directo al WhatsApp del negocio.',
    features: [
      'Servicios y precios',
      'Galería de trabajos',
      'Reserva de turnos por WhatsApp',
      'Recomendador de estilo',
    ],
    image: { card: barbaNegraCard, modal: barbaNegraModal },
    liveUrl: 'https://barba-negra-one.vercel.app',
    badge: 'Demo',
  },
  {
    id: 'tropical-vibes',
    serviceId: 'tienda',
    title: 'Tropical Vibes',
    category: 'Tienda de ropa',
    description:
      'Tienda online de moda con catálogo filtrable y carrito; el cliente elige talla y color y hace el pedido por WhatsApp.',
    features: [
      'Catálogo filtrable (17 productos)',
      'Carrito',
      'Selección de talla y color',
      'Pedido por WhatsApp',
    ],
    image: { card: tropicalVibesCard, modal: tropicalVibesModal },
    liveUrl: 'https://tropical-vibes.vercel.app',
    badge: 'Demo',
  },
];

export const PROCESS_STEPS = [
  {
    step: 1,
    number: '01',
    title: 'Conversamos',
    description: 'Nos cuentas qué necesitas por WhatsApp.',
    detail:
      'Hablamos de tu negocio, de lo que quieres lograr y de cuánto quieres invertir. Sin formularios largos ni reuniones eternas.',
  },
  {
    step: 2,
    number: '02',
    title: 'Propuesta',
    description: 'Te enviamos precio, plazo y alcance.',
    detail: `Te explicamos qué incluye el proyecto, cuánto cuesta y en cuánto tiempo lo entregamos. Para empezar se paga un anticipo del ${PAYMENT.depositPercent} %.`,
  },
  {
    step: 3,
    number: '03',
    title: 'Diseño y desarrollo',
    description: 'Hacemos tu web y te la vamos mostrando.',
    detail:
      `Te enseñamos avances para que nos digas qué cambiar. Incluimos ${REVISION_ROUNDS} rondas de revisión, así el resultado queda como lo imaginabas.`,
  },
  {
    step: 4,
    number: '04',
    title: 'Publicación y entrega',
    description: 'Publicamos tu web y te la entregamos.',
    detail:
      'Dejamos tu web en línea y funcionando, y te explicamos cómo usarla. El resto del pago se hace al entregar.',
  },
  {
    step: 5,
    number: '05',
    title: 'Mantenimiento (opcional)',
    description: 'Si quieres, seguimos cuidando tu web.',
    detail:
      'Con el plan de mantenimiento hacemos cambios menores, copias de seguridad y te atendemos por WhatsApp. Es opcional y se paga aparte.',
  },
];
