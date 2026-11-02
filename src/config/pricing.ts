/**
 * Single source of truth for prices, lead times, extras and payment terms.
 * Every price shown on the site or used by the quote calculator must come from here.
 *
 * TODO: Precios de dominio y hosting pendientes de fijar por Jhon.
 * Mientras `price` sea null, el sitio muestra "a consultar" y nunca suma un importe.
 */

export const CURRENCY = 'USD';
export const CURRENCY_NOTE = 'Precios en USD; también aceptamos CUP al cambio del día.';
export const PLANS_NOTE = 'Hosting y dominio no incluidos: se calculan en el cotizador según lo que necesites.';

export interface Service {
  id: string;
  name: string;
  description: string;
  /** "Desde" price in CURRENCY. For the maintenance plan it is the monthly price. */
  from: number;
  suffix?: string;
  leadTime: string;
  /** Material Symbols icon name. */
  icon: string;
  /** Monthly price when paying the whole year upfront (maintenance only). */
  annualFrom?: number;
  includes?: readonly string[];
}

const SERVICE_LIST = [
  {
    id: 'catalogo',
    name: 'Catálogo digital',
    description: 'Tus productos o servicios en un enlace que compartes por WhatsApp, con fotos y precios.',
    from: 25,
    leadTime: '3–5 días',
    icon: 'menu_book',
  },
  {
    id: 'landing',
    name: 'Landing page',
    description: 'Una página clara que presenta tu negocio y lleva al cliente a escribirte.',
    from: 35,
    leadTime: '3–5 días',
    icon: 'web',
  },
  {
    id: 'tienda',
    name: 'Tienda online',
    description: 'Vende tus productos por internet con catálogo y pedidos organizados.',
    from: 60,
    leadTime: '7–10 días',
    icon: 'shopping_bag',
  },
  {
    id: 'rediseno',
    name: 'Rediseño de web',
    description: 'Renovamos la web que ya tienes: más clara, más rápida y pensada para el móvil.',
    from: 30,
    leadTime: '7–10 días',
    icon: 'brush',
  },
  {
    id: 'gestion',
    name: 'Sistema de gestión',
    description: 'Un sistema a tu medida para llevar inventario, ventas, reservas o clientes sin cuadernos.',
    from: 150,
    leadTime: 'Según alcance',
    icon: 'dashboard',
  },
  {
    id: 'bots',
    name: 'Automatizaciones y bots',
    description: 'Automatizamos tareas repetitivas: respuestas, avisos, reportes y envío de datos.',
    from: 40,
    leadTime: '5–10 días',
    icon: 'smart_toy',
  },
  {
    id: 'digitalmenu',
    name: 'DigitalMenu',
    description: 'Carta digital para restaurantes y cafeterías, instalada y lista para usar.',
    from: 120,
    suffix: 'instalación incluida',
    leadTime: '2–3 días',
    icon: 'restaurant_menu',
  },
  {
    id: 'mantenimiento',
    name: 'Mantenimiento',
    description: 'Tu web al día y funcionando, con soporte directo por WhatsApp.',
    from: 15,
    suffix: '/mes',
    annualFrom: 10,
    leadTime: 'Servicio mensual',
    icon: 'build',
    includes: [
      'Cambios menores de contenido (hasta 2 h/mes)',
      'Copias de seguridad',
      'Monitoreo de disponibilidad',
      'Soporte por WhatsApp',
    ],
  },
] as const satisfies readonly Service[];

export type ServiceId = (typeof SERVICE_LIST)[number]['id'];
export const MAINTENANCE_ID = 'mantenimiento' satisfies ServiceId;
/** Services that can be the base of a quote (everything except the monthly maintenance). */
export type ProjectServiceId = Exclude<ServiceId, typeof MAINTENANCE_ID>;

export const SERVICES: readonly Service[] = SERVICE_LIST;
export const PROJECT_SERVICES: readonly (Service & { id: ProjectServiceId })[] = SERVICE_LIST.filter(
  (service): service is Exclude<(typeof SERVICE_LIST)[number], { id: typeof MAINTENANCE_ID }> =>
    service.id !== MAINTENANCE_ID,
);

const maintenance = SERVICES.find((service) => service.id === MAINTENANCE_ID);
if (!maintenance) throw new Error(`pricing.ts: missing service "${MAINTENANCE_ID}"`);
export const MAINTENANCE: Service = maintenance;

export interface Extra {
  id: string;
  name: string;
  price?: number;
  /** Shown next to the price, e.g. "por página". */
  unit?: string;
  /** When present the price is multiplied by a quantity between 1 and `max`. */
  quantity?: { label: string; max: number };
}

const EXTRA_LIST = [
  {
    id: 'pagina',
    name: 'Página adicional',
    price: 10,
    unit: 'por página',
    quantity: { label: 'Cantidad de páginas', max: 20 },
  },
  { id: 'logo', name: 'Logo sencillo', price: 15 },
  { id: 'idioma', name: 'Segundo idioma', price: 15 },
  {
    id: 'carga',
    name: 'Carga de productos o fotos',
    price: 5,
    unit: 'por cada 20',
    quantity: { label: 'Bloques de 20 productos o fotos', max: 25 },
  },
] as const satisfies readonly Extra[];

export type ExtraId = (typeof EXTRA_LIST)[number]['id'];
export const EXTRAS: readonly Extra[] = EXTRA_LIST;

export type Billing = 'once' | 'yearly' | 'monthly';

export interface PublishingOption {
  id: string;
  name: string;
  description: string;
  /** `null` = price not set yet: shown as "a consultar" and never added to a total. */
  price: number | null;
  billing: Billing;
}

const PUBLISHING_LIST = [
  {
    id: 'free',
    name: 'Dirección gratuita',
    description: 'tunegocio.vercel.app',
    price: 0,
    billing: 'once',
  },
  {
    id: 'domain',
    name: 'Dominio propio .com',
    description: 'Registro y gestión del dominio',
    price: null,
    billing: 'yearly',
  },
  {
    id: 'managed',
    name: 'Hosting gestionado',
    description: 'Para proyectos con servidor o base de datos, p. ej. un sistema de gestión',
    price: null,
    billing: 'monthly',
  },
] as const satisfies readonly PublishingOption[];

export type PublishingId = (typeof PUBLISHING_LIST)[number]['id'];
export const DEFAULT_PUBLISHING_ID = 'free' satisfies PublishingId;
export const PUBLISHING_OPTIONS: readonly (PublishingOption & { id: PublishingId })[] = PUBLISHING_LIST;

const DEPOSIT_PERCENT = 50;

export const PAYMENT = {
  depositPercent: DEPOSIT_PERCENT,
  terms: `Anticipo del ${DEPOSIT_PERCENT}% para empezar y el resto al entregar.`,
  methods: ['Efectivo', 'Transferencia CUP', 'Qvapay', 'USDT'],
} as const;
