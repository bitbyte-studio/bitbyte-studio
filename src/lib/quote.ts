import {
  CURRENCY,
  DEFAULT_HOSTING_ID,
  DOMAIN_OPTION,
  EXTRAS,
  HOSTING_OPTIONS,
  MAINTENANCE,
  MAINTENANCE_ID,
  PROJECT_SERVICES,
  type Billing,
  type ExtraId,
  type HostingId,
  type ProjectServiceId,
  type PublishingOption,
} from '../config/pricing';

export interface QuoteExtraInput {
  id: ExtraId;
  /** Only used by extras that define `quantity`; clamped to 1..max. */
  quantity?: number;
}

export type MaintenanceMode = 'none' | 'monthly' | 'annual';

export interface PublishingChoice {
  /** Where the project lives. Defaults to the free address. */
  hosting?: HostingId;
  /** Adds the custom .com domain, billed yearly. Independent from the hosting. Defaults to false. */
  domain?: boolean;
}

export interface QuoteOptions {
  /** Maintenance plan: none, paid monthly, or paid for the whole year at the annual rate. Defaults to 'none'. */
  maintenance?: MaintenanceMode;
  publishing?: PublishingChoice;
}

export interface QuoteLine {
  id: string;
  kind: 'service' | 'extra' | 'hosting' | 'domain' | 'maintenance';
  label: string;
  /** Short explanation shown next to the label in the publishing summary. */
  detail?: string;
  billing: Billing;
  /** `null` means the price is not set yet ("a consultar"): listed but never summed. */
  amount: number | null;
  /** The amount is a starting price ("desde X"): variable-scope services, managed hosting for a management system. */
  from?: boolean;
}

export interface Quote {
  /** One-time estimate ("desde"): base service plus priced extras. */
  oneTime: number;
  /** Recurring yearly payments with a known price (custom domain, annual maintenance). */
  yearly: number;
  /** At least one of the yearly lines is a starting price ("desde"). */
  yearlyFrom: boolean;
  /** Recurring monthly payments with a known price (managed hosting, monthly maintenance). */
  monthly: number;
  /** At least one of the monthly lines is a starting price ("desde"). */
  monthlyFrom: boolean;
  /** Names of the lines whose price is still "a consultar". */
  pending: string[];
  lines: QuoteLine[];
  leadTime: string;
}

export function formatUsd(amount: number): string {
  return `${amount.toLocaleString('en-US')} ${CURRENCY}`;
}

const BILLING_SUFFIX: Record<Billing, string> = { once: '', yearly: '/año', monthly: '/mes' };

/** "a consultar" for unset prices, "Gratis" for 0, otherwise "[desde ]X USD" with its billing suffix. */
export function formatLineAmount(line: Pick<QuoteLine, 'amount' | 'billing' | 'from'>): string {
  if (line.amount === null) return 'a consultar';
  if (line.amount === 0) return 'Gratis';
  return `${line.from ? 'desde ' : ''}${formatUsd(line.amount)}${BILLING_SUFFIX[line.billing]}`;
}

/** Price of a publishing option for a service: the per-service override if there is one, else the default. */
export function publishingPriceFor(
  option: PublishingOption,
  serviceId: ProjectServiceId,
): Pick<QuoteLine, 'amount' | 'from'> {
  const override = option.priceByService?.[serviceId];
  return override ? { amount: override.price, from: override.from } : { amount: option.price };
}

/** Price tag of a publishing control for the selected service: "Gratis", "precio a consultar" or "[desde ]X USD/..". */
export function publishingOptionPrice(option: PublishingOption, serviceId: ProjectServiceId): string {
  const price = publishingPriceFor(option, serviceId);
  return price.amount === null
    ? 'precio a consultar'
    : formatLineAmount({ ...price, billing: option.billing });
}

/** Name and description of a hosting option, adapted when a custom domain is also selected. */
export function hostingDisplay(option: PublishingOption, withDomain: boolean): { name: string; description: string } {
  return withDomain && option.withDomain ? option.withDomain : { name: option.name, description: option.description };
}

/** Integer between 1 and `max`; anything that is not a finite number becomes 1. */
export function clampQuantity(value: number | undefined, max: number): number {
  const quantity = Number.isFinite(value) ? Math.floor(value as number) : 1;
  return Math.min(max, Math.max(1, quantity));
}

export function calculateQuote(
  serviceId: ProjectServiceId,
  extras: readonly QuoteExtraInput[] = [],
  options: QuoteOptions = {},
): Quote {
  const service = PROJECT_SERVICES.find((item) => item.id === serviceId);
  if (!service) throw new RangeError(`Unknown quote service: ${String(serviceId)}`);

  const hostingId = options.publishing?.hosting ?? DEFAULT_HOSTING_ID;
  const hosting = HOSTING_OPTIONS.find((item) => item.id === hostingId);
  if (!hosting) throw new RangeError(`Unknown hosting option: ${String(hostingId)}`);
  const withDomain = options.publishing?.domain === true;

  const lines: QuoteLine[] = [
    {
      id: service.id,
      kind: 'service',
      label: service.name,
      billing: 'once',
      amount: service.from,
      ...(service.variablePrice ? { from: true } : {}),
    },
  ];
  const seen = new Set<string>();

  for (const input of extras) {
    if (seen.has(input.id)) continue;
    seen.add(input.id);

    const extra = EXTRAS.find((item) => item.id === input.id);
    if (!extra) throw new RangeError(`Unknown quote extra: ${String(input.id)}`);

    const quantity = extra.quantity ? clampQuantity(input.quantity, extra.quantity.max) : 1;
    lines.push({
      id: extra.id,
      kind: 'extra',
      label: extra.quantity ? `${extra.name} × ${quantity}` : extra.name,
      billing: 'once',
      amount: extra.price === undefined ? null : extra.price * quantity,
    });
  }

  const hostingText = hostingDisplay(hosting, withDomain);
  lines.push({
    id: hosting.id,
    kind: 'hosting',
    label: hostingText.name,
    detail: hostingText.description,
    billing: hosting.billing,
    ...publishingPriceFor(hosting, service.id),
  });

  if (withDomain) {
    lines.push({
      id: DOMAIN_OPTION.id,
      kind: 'domain',
      label: DOMAIN_OPTION.name,
      detail: DOMAIN_OPTION.description,
      billing: DOMAIN_OPTION.billing,
      ...publishingPriceFor(DOMAIN_OPTION, service.id),
    });
  }

  const maintenance = options.maintenance ?? 'none';
  if (maintenance === 'monthly') {
    lines.push({
      id: MAINTENANCE_ID,
      kind: 'maintenance',
      label: 'Mantenimiento mensual',
      billing: 'monthly',
      amount: MAINTENANCE.from,
    });
  } else if (maintenance === 'annual') {
    const perMonth = MAINTENANCE.annualFrom;
    if (perMonth === undefined) throw new Error('pricing.ts: maintenance has no annualFrom price');
    lines.push({
      id: MAINTENANCE_ID,
      kind: 'maintenance',
      label: `Mantenimiento anual (${formatUsd(perMonth)}/mes)`,
      billing: 'yearly',
      amount: perMonth * 12,
    });
  } else if (maintenance !== 'none') {
    throw new RangeError(`Unknown maintenance mode: ${String(maintenance)}`);
  }

  const totals: Record<Billing, number> = { once: 0, yearly: 0, monthly: 0 };
  const startingPrice: Record<Billing, boolean> = { once: false, yearly: false, monthly: false };
  const pending: string[] = [];
  for (const line of lines) {
    if (line.amount === null) {
      pending.push(line.label);
      continue;
    }
    totals[line.billing] += line.amount;
    if (line.from) startingPrice[line.billing] = true;
  }

  return {
    oneTime: totals.once,
    yearly: totals.yearly,
    yearlyFrom: startingPrice.yearly,
    monthly: totals.monthly,
    monthlyFrom: startingPrice.monthly,
    pending,
    lines,
    leadTime: service.leadTime,
  };
}

/** Lines of the "Pago único del proyecto" block: base service and extras. */
export const oneTimeLines = (quote: Quote): QuoteLine[] =>
  quote.lines.filter((line) => line.kind === 'service' || line.kind === 'extra');

/** Lines of the "Pago recurrente" block: anything billed yearly or monthly. */
export const recurringLines = (quote: Quote): QuoteLine[] =>
  quote.lines.filter((line) => line.billing !== 'once');

/** Hosting and domain lines: what the "Publicación" block describes. */
export const publishingLines = (quote: Quote): QuoteLine[] =>
  quote.lines.filter((line) => line.kind === 'hosting' || line.kind === 'domain');

/**
 * Publishing choices as text lines, shared by the quote result and the WhatsApp message.
 * Free one-time options show "Gratis"; recurring ones are priced in "Pago recurrente".
 */
export function publishingSummary(quote: Quote): string[] {
  return publishingLines(quote).map((line) => {
    const detail = line.detail ? ` (${line.detail})` : '';
    const amount = line.billing === 'once' ? ` - ${formatLineAmount(line)}` : '';
    return `${line.label}${detail}${amount}`;
  });
}

/**
 * Totals for a recurring period, only when the period has more than one line
 * (a single line already shows its own amount) and every one of them has a price:
 * a total that skips an "a consultar" line would understate the cost. Keeps the "desde" of its lines.
 */
export function recurringTotals(quote: Quote): string[] {
  const periodLines = (billing: Billing) => recurringLines(quote).filter((line) => line.billing === billing);
  const showTotal = (billing: Billing) => {
    const lines = periodLines(billing);
    return lines.length > 1 && lines.every((line) => line.amount !== null);
  };
  const totals: string[] = [];
  if (showTotal('monthly')) {
    totals.push(`Total mensual: ${formatLineAmount({ amount: quote.monthly, billing: 'monthly', from: quote.monthlyFrom })}`);
  }
  if (showTotal('yearly')) {
    totals.push(`Total anual: ${formatLineAmount({ amount: quote.yearly, billing: 'yearly', from: quote.yearlyFrom })}`);
  }
  return totals;
}

/** Plain-text summary used as the prefilled WhatsApp message. */
export function quoteToMessage(quote: Quote): string {
  const service = quote.lines.find((line) => line.kind === 'service');
  const recurring = recurringLines(quote);

  return [
    '¡Hola Bit & Byte Studio! Quisiera cotizar un proyecto:',
    `- Servicio: ${service?.label ?? ''}`,
    `- Plazo orientativo: ${quote.leadTime}`,
    '',
    'Pago único del proyecto:',
    ...oneTimeLines(quote).map((line) => `- ${line.label}: ${formatLineAmount(line)}`),
    `- Estimado desde: ${formatUsd(quote.oneTime)}`,
    '',
    'Publicación:',
    ...publishingSummary(quote).map((text) => `- ${text}`),
    '',
    'Pago recurrente:',
    ...(recurring.length ? recurring.map((line) => `- ${line.label}: ${formatLineAmount(line)}`) : ['- Ninguno']),
    ...recurringTotals(quote).map((text) => `- ${text}`),
  ].join('\n');
}
