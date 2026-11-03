/**
 * Single source of truth for prices, lead times, extras and payment terms.
 * Every price shown on the site or used by the quote calculator must come from here.
 *
 * Publicación (HOSTING_OPTIONS y DOMAIN_OPTION): si algún `price` vuelve a ser null, el sitio
 * muestra "a consultar" y nunca suma un importe inventado.
 */

export const CURRENCY = 'USD';
export const CURRENCY_NOTE = 'Precios en USD; también aceptamos CUP al cambio del día.';
export const PLANS_NOTE = 'Hosting y dominio no incluidos: elige y suma su precio en el cotizador.';

export interface Service {
  id: string;
  name: string;
  description: string;
  /** "Desde" price in CURRENCY. For the maintenance plan it is the monthly price. */
  from: number;
  /** The price depends on the scope, so quotes show it as "desde X". */
  variablePrice?: boolean;
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
    variablePrice: true,
    leadTime: '7–10 días',
    icon: 'brush',
  },
  {
    id: 'gestion',
    name: 'Sistema de gestión',
    description: 'Un sistema a tu medida para llevar inventario, ventas, reservas o clientes sin cuadernos.',
    from: 150,
    variablePrice: true,
    leadTime: 'Según alcance',
    icon: 'dashboard',
  },
  {
    id: 'bots',
    name: 'Automatizaciones y bots',
    description: 'Automatizamos tareas repetitivas: respuestas, avisos, reportes y envío de datos.',
    from: 40,
    variablePrice: true,
    leadTime: '5–10 días',
    icon: 'smart_toy',
  },
  {
    id: 'digitalmenu',
    name: 'DigitalMenu',
    description: 'Carta digital para restaurantes y cafeterías, instalada y lista para usar.',
    from: 120,
    variablePrice: true,
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

/** Price of a publishing option for one specific service. `from: true` renders it as "desde X". */
export interface PublishingPrice {
  price: number;
  from?: boolean;
}

export interface PublishingOption {
  id: string;
  name: string;
  description: string;
  /** Default price. `null` = not set yet: shown as "a consultar" and never added to a total. */
  price: number | null;
  billing: Billing;
  /** Overrides `price` when the quote's base service is one of these. */
  priceByService?: Partial<Record<ProjectServiceId, PublishingPrice>>;
  /** Wording used instead of `name`/`description` when a custom domain is also selected. */
  withDomain?: { name: string; description: string };
}

/** Where the project lives. Exactly one is chosen in the quote (radio). */
const HOSTING_LIST = [
  {
    id: 'free',
    name: 'Dirección gratuita',
    description: 'tunegocio.vercel.app',
    price: 0,
    billing: 'once',
    // With a custom domain the .vercel.app address is not the final one, so it is not mentioned.
    withDomain: { name: 'Alojamiento gratuito', description: 'Tu sitio se verá en tu dominio propio' },
  },
  {
    id: 'managed',
    name: 'Hosting gestionado',
    description: 'Para proyectos sencillos con base de datos. Los sistemas de gestión requieren más recursos.',
    price: 10,
    billing: 'monthly',
    priceByService: { gestion: { price: 25, from: true } },
  },
] as const satisfies readonly PublishingOption[];

export type HostingId = (typeof HOSTING_LIST)[number]['id'];
export const DEFAULT_HOSTING_ID = 'free' satisfies HostingId;
export const HOSTING_OPTIONS: readonly (PublishingOption & { id: HostingId })[] = HOSTING_LIST;

/** Custom .com domain. It is independent from the hosting choice (checkbox) and billed yearly. */
export const DOMAIN_OPTION: PublishingOption = {
  id: 'domain',
  name: 'Dominio propio .com',
  description: 'Registro y gestión del dominio',
  price: 20,
  billing: 'yearly',
};

const DEPOSIT_PERCENT = 50;

export const PAYMENT = {
  depositPercent: DEPOSIT_PERCENT,
  terms: `Anticipo del ${DEPOSIT_PERCENT} % para empezar y el resto al entregar.`,
  methods: ['Efectivo', 'Transferencia CUP', 'Qvapay', 'USDT'],
} as const;
