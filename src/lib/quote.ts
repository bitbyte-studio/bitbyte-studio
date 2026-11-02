import {
  CURRENCY,
  DEFAULT_PUBLISHING_ID,
  EXTRAS,
  MAINTENANCE,
  MAINTENANCE_ID,
  PROJECT_SERVICES,
  PUBLISHING_OPTIONS,
  type Billing,
  type ExtraId,
  type ProjectServiceId,
  type PublishingId,
} from '../config/pricing';

export interface QuoteExtraInput {
  id: ExtraId;
  /** Only used by extras that define `quantity`; clamped to 1..max. */
  quantity?: number;
}

export interface QuoteOptions {
  /** Adds the monthly maintenance plan to the recurring payments. */
  maintenance?: boolean;
  /** How the project is published. Defaults to the free address. */
  publishing?: PublishingId;
}

export interface QuoteLine {
  id: string;
  kind: 'service' | 'extra' | 'publishing' | 'maintenance';
  label: string;
  billing: Billing;
  /** `null` means the price is not set yet ("a consultar"): listed but never summed. */
  amount: number | null;
}

export interface Quote {
  /** One-time estimate ("desde"): base service plus priced extras. */
  oneTime: number;
  /** Recurring yearly payments with a known price. */
  yearly: number;
  /** Recurring monthly payments with a known price (maintenance, managed hosting). */
  monthly: number;
  /** Names of the lines whose price is still "a consultar". */
  pending: string[];
  lines: QuoteLine[];
  leadTime: string;
}

export function formatUsd(amount: number): string {
  return `${amount.toLocaleString('en-US')} ${CURRENCY}`;
}

const BILLING_SUFFIX: Record<Billing, string> = { once: '', yearly: '/año', monthly: '/mes' };

/** "a consultar" for unset prices, otherwise the amount with its billing suffix. */
export function formatLineAmount(line: Pick<QuoteLine, 'amount' | 'billing'>): string {
  return line.amount === null ? 'a consultar' : `${formatUsd(line.amount)}${BILLING_SUFFIX[line.billing]}`;
}

function clampQuantity(value: number | undefined, max: number): number {
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

  const publishingId = options.publishing ?? DEFAULT_PUBLISHING_ID;
  const publishing = PUBLISHING_OPTIONS.find((item) => item.id === publishingId);
  if (!publishing) throw new RangeError(`Unknown publishing option: ${String(publishingId)}`);

  const lines: QuoteLine[] = [
    { id: service.id, kind: 'service', label: service.name, billing: 'once', amount: service.from },
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
      amount: (extra.price ?? 0) * quantity,
    });
  }

  lines.push({
    id: publishing.id,
    kind: 'publishing',
    label: publishing.name,
    billing: publishing.billing,
    amount: publishing.price,
  });

  if (options.maintenance) {
    lines.push({
      id: MAINTENANCE_ID,
      kind: 'maintenance',
      label: 'Mantenimiento mensual',
      billing: 'monthly',
      amount: MAINTENANCE.from,
    });
  }

  const totals: Record<Billing, number> = { once: 0, yearly: 0, monthly: 0 };
  const pending: string[] = [];
  for (const line of lines) {
    if (line.amount === null) pending.push(line.label);
    else totals[line.billing] += line.amount;
  }

  return {
    oneTime: totals.once,
    yearly: totals.yearly,
    monthly: totals.monthly,
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

/** The chosen publishing option (always present in `quote.lines`). */
export const publishingLine = (quote: Quote): QuoteLine | undefined =>
  quote.lines.find((line) => line.kind === 'publishing');

/** Plain-text summary used as the prefilled WhatsApp message. */
export function quoteToMessage(quote: Quote): string {
  const service = quote.lines.find((line) => line.kind === 'service');
  const publishing = publishingLine(quote);
  const publishingOption = PUBLISHING_OPTIONS.find((option) => option.id === publishing?.id);
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
    `Publicación: ${publishing?.label ?? ''}${publishingOption ? ` (${publishingOption.description})` : ''}`,
    '',
    'Pago recurrente:',
    ...(recurring.length ? recurring.map((line) => `- ${line.label}: ${formatLineAmount(line)}`) : ['- Ninguno']),
  ].join('\n');
}
