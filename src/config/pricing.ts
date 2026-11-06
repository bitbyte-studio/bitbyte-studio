/**
 * Single source of truth for prices, lead times, hosting, domain and payment terms.
 * Every price shown on the site must come from here.
 *
 * Publicación (HOSTING_OPTIONS y DOMAIN_OPTION): si algún `price` vuelve a ser null, el sitio
 * muestra "a consultar" y nunca inventa un importe.
 */

export const CURRENCY = 'USD';
export const CURRENCY_NOTE = 'Precios en USD; también aceptamos CUP al cambio del día.';

export interface Service {
  id: string;
  name: string;
  description: string;
  /** "Desde" price in CURRENCY. For the maintenance plan it is the monthly price. */
  from: number;
  /** The price depends on the scope, so the site shows it as "desde X". */
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
    name: 'Menú Digital',
    description: 'Carta digital para restaurantes y cafeterías, instalada y lista para usar.',
    from: 120,
    variablePrice: true,
    suffix: 'instalación incluida',
    leadTime: '2–3 días',
    icon: 'restaurant_menu',
  },
  {
    id: 'medida',
    name: 'Proyecto a medida',
    description: 'Apps para móvil, herramientas internas o programas para PC: lo armamos a tu medida.',
    from: 50,
    variablePrice: true,
    leadTime: 'Según alcance',
    icon: 'devices',
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
/** Project services (everything except the monthly maintenance add-on). */
export type ProjectServiceId = Exclude<ServiceId, typeof MAINTENANCE_ID>;

export const SERVICES: readonly Service[] = SERVICE_LIST;
export const PROJECT_SERVICES: readonly (Service & { id: ProjectServiceId })[] = SERVICE_LIST.filter(
  (service): service is Exclude<(typeof SERVICE_LIST)[number], { id: typeof MAINTENANCE_ID }> =>
    service.id !== MAINTENANCE_ID,
);

const maintenance = SERVICES.find((service) => service.id === MAINTENANCE_ID);
if (!maintenance) throw new Error(`pricing.ts: missing service "${MAINTENANCE_ID}"`);
export const MAINTENANCE: Service = maintenance;

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
  /** Default price. `null` = not set yet: shown as "a consultar". */
  price: number | null;
  billing: Billing;
  /** Overrides `price` for heavier project types. */
  priceByService?: Partial<Record<ProjectServiceId, PublishingPrice>>;
}

/** Publishing options shown in FAQ and /terminos. */
const HOSTING_LIST = [
  {
    id: 'free',
    name: 'Dirección gratuita',
    description: 'tunegocio.vercel.app',
    price: 0,
    billing: 'once',
  },
  {
    id: 'managed',
    name: 'Hosting gestionado',
    description: 'Para proyectos con base de datos. Los sistemas de gestión requieren más recursos.',
    price: 10,
    billing: 'monthly',
    priceByService: { gestion: { price: 25, from: true }, medida: { price: 10, from: true } },
  },
] as const satisfies readonly PublishingOption[];

export type HostingId = (typeof HOSTING_LIST)[number]['id'];
export const HOSTING_OPTIONS: readonly (PublishingOption & { id: HostingId })[] = HOSTING_LIST;

/** Custom .com domain, billed yearly and paid apart from the project. */
export const DOMAIN_OPTION: PublishingOption = {
  id: 'domain',
  name: 'Dominio propio .com',
  description: 'Registro y gestión del dominio',
  price: 20,
  billing: 'yearly',
};

/** Revision rounds included in every project. Extra or out-of-scope changes are quoted separately. */
export const REVISION_ROUNDS = 2;

/** Ownership terms shared by the FAQ and /terminos. */
export const OWNERSHIP = {
  summary: 'Al pagar el total del proyecto, el contenido y el dominio propio quedan a tu nombre.',
  freeAddress: `La dirección ${HOSTING_LIST[0].description} es un subdominio gratuito del servicio de alojamiento, no un dominio tuyo: si quieres una dirección a tu nombre, elige el dominio propio .com.`,
  optional: 'El hosting y el mantenimiento son opcionales y se pagan aparte.',
};

const DEPOSIT_PERCENT = 50;

export const PAYMENT = {
  depositPercent: DEPOSIT_PERCENT,
  terms: `Anticipo del ${DEPOSIT_PERCENT} % para empezar y el resto al entregar.`,
  methods: ['Efectivo', 'Transferencia CUP', 'Qvapay', 'USDT'],
} as const;
