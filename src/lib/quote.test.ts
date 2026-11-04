import { describe, expect, test } from 'bun:test';
import {
  DOMAIN_OPTION,
  EXTRAS,
  HOSTING_OPTIONS,
  MAINTENANCE,
  PROJECT_SERVICES,
  type ProjectServiceId,
} from '../config/pricing';
import {
  calculateQuote,
  clampQuantity,
  formatLineAmount,
  formatUsd,
  publishingOptionPrice,
  quoteToMessage,
  recurringTotals,
} from './quote';

const service = (id: ProjectServiceId) => {
  const found = PROJECT_SERVICES.find((item) => item.id === id);
  if (!found) throw new Error(`missing service ${id}`);
  return found;
};

const managed = HOSTING_OPTIONS.find((option) => option.id === 'managed')!;
const quantityExtra = EXTRAS.find((extra) => extra.quantity)!;
const flatExtra = EXTRAS.find((extra) => !extra.quantity && extra.price !== undefined)!;

describe('clampQuantity', () => {
  test('keeps values inside 1..max', () => {
    expect(clampQuantity(5, 20)).toBe(5);
    expect(clampQuantity(0, 20)).toBe(1);
    expect(clampQuantity(-3, 20)).toBe(1);
    expect(clampQuantity(99, 20)).toBe(20);
  });

  test('floors decimals and falls back to 1 for non numbers', () => {
    expect(clampQuantity(2.9, 20)).toBe(2);
    expect(clampQuantity(Number.NaN, 20)).toBe(1);
    expect(clampQuantity(Infinity, 20)).toBe(1);
    expect(clampQuantity(undefined, 20)).toBe(1);
  });
});

describe('formatting', () => {
  test('formatUsd groups thousands', () => {
    expect(formatUsd(1500)).toBe('1,500 USD');
  });

  test('formatLineAmount covers unset, free, starting and billed prices', () => {
    expect(formatLineAmount({ amount: null, billing: 'once' })).toBe('a consultar');
    expect(formatLineAmount({ amount: 0, billing: 'once' })).toBe('Gratis');
    expect(formatLineAmount({ amount: 25, billing: 'once' })).toBe('25 USD');
    expect(formatLineAmount({ amount: 25, billing: 'once', from: true })).toBe('desde 25 USD');
    expect(formatLineAmount({ amount: 10, billing: 'monthly' })).toBe('10 USD/mes');
    expect(formatLineAmount({ amount: 20, billing: 'yearly' })).toBe('20 USD/año');
  });
});

describe('calculateQuote', () => {
  test('a bare quote is the service price with free hosting', () => {
    const quote = calculateQuote('catalogo');
    expect(quote.oneTime).toBe(service('catalogo').from);
    expect(quote.monthly).toBe(0);
    expect(quote.yearly).toBe(0);
    expect(quote.pending).toEqual([]);
    expect(quote.leadTime).toBe(service('catalogo').leadTime);
  });

  test('every project service can be quoted and keeps its starting price flag', () => {
    for (const item of PROJECT_SERVICES) {
      const quote = calculateQuote(item.id);
      const line = quote.lines.find((entry) => entry.kind === 'service');
      expect(quote.oneTime).toBe(item.from);
      expect(line?.from === true).toBe(item.variablePrice === true);
    }
  });

  test('extras add up, and quantities are clamped to their maximum', () => {
    const base = service('landing').from;
    const max = quantityExtra.quantity!.max;
    const quote = calculateQuote('landing', [
      { id: flatExtra.id as never },
      { id: quantityExtra.id as never, quantity: 9999 },
    ]);
    expect(quote.oneTime).toBe(base + flatExtra.price! + quantityExtra.price! * max);
    expect(quote.lines.some((line) => line.label.endsWith(`× ${max}`))).toBe(true);
  });

  test('a repeated extra is only counted once', () => {
    const quote = calculateQuote('landing', [{ id: flatExtra.id as never }, { id: flatExtra.id as never }]);
    expect(quote.oneTime).toBe(service('landing').from + flatExtra.price!);
  });

  test('managed hosting is monthly and uses the per service price', () => {
    const regular = calculateQuote('landing', [], { publishing: { hosting: 'managed' } });
    expect(regular.monthly).toBe(managed.price!);
    expect(regular.monthlyFrom).toBe(false);

    const system = calculateQuote('gestion', [], { publishing: { hosting: 'managed' } });
    expect(system.monthly).toBe(managed.priceByService!.gestion!.price);
    expect(system.monthlyFrom).toBe(true);
    expect(system.oneTime).toBe(service('gestion').from);
  });

  test('the custom domain is yearly and independent from the hosting', () => {
    const quote = calculateQuote('landing', [], { publishing: { domain: true } });
    expect(quote.yearly).toBe(DOMAIN_OPTION.price!);
    expect(quote.monthly).toBe(0);
    expect(quote.lines.map((line) => line.kind)).toContain('domain');
  });

  test('maintenance is monthly, or yearly at the annual rate', () => {
    const monthly = calculateQuote('landing', [], { maintenance: 'monthly' });
    expect(monthly.monthly).toBe(MAINTENANCE.from);

    const annual = calculateQuote('landing', [], { maintenance: 'annual' });
    expect(annual.yearly).toBe(MAINTENANCE.annualFrom! * 12);
    expect(annual.monthly).toBe(0);
  });

  test('a line without price is listed as pending and never summed', () => {
    const original = DOMAIN_OPTION.price;
    (DOMAIN_OPTION as { price: number | null }).price = null;
    try {
      const quote = calculateQuote('landing', [], { publishing: { domain: true } });
      expect(quote.pending).toContain(DOMAIN_OPTION.name);
      expect(quote.yearly).toBe(0);
    } finally {
      (DOMAIN_OPTION as { price: number | null }).price = original;
    }
  });

  test('unknown inputs fail loudly instead of producing a price', () => {
    expect(() => calculateQuote('nope' as never)).toThrow(RangeError);
    expect(() => calculateQuote('landing', [{ id: 'nope' as never }])).toThrow(RangeError);
    expect(() => calculateQuote('landing', [], { publishing: { hosting: 'nope' as never } })).toThrow(RangeError);
    expect(() => calculateQuote('landing', [], { maintenance: 'weekly' as never })).toThrow(RangeError);
  });
});

describe('recurringTotals', () => {
  test('no total when there is a single recurring line', () => {
    const quote = calculateQuote('landing', [], { publishing: { hosting: 'managed' } });
    expect(recurringTotals(quote)).toEqual([]);
  });

  test('sums every line of a period once there are several', () => {
    const quote = calculateQuote('landing', [], {
      publishing: { hosting: 'managed' },
      maintenance: 'monthly',
    });
    expect(recurringTotals(quote)).toEqual([`Total mensual: ${managed.price! + MAINTENANCE.from} USD/mes`]);
  });
});

describe('publishingOptionPrice', () => {
  test('uses the override for the service and the default otherwise', () => {
    expect(publishingOptionPrice(managed, 'landing')).toBe(`${managed.price} USD/mes`);
    expect(publishingOptionPrice(managed, 'gestion')).toBe(
      `desde ${managed.priceByService!.gestion!.price} USD/mes`,
    );
  });
});

describe('quoteToMessage', () => {
  test('mentions the service, lead time, estimate and publishing choice', () => {
    const message = quoteToMessage(calculateQuote('tienda', [], { publishing: { domain: true } }));
    expect(message).toContain(service('tienda').name);
    expect(message).toContain(service('tienda').leadTime);
    expect(message).toContain(`Estimado desde: ${formatUsd(service('tienda').from)}`);
    expect(message).toContain(DOMAIN_OPTION.name);
  });

  test('says "Ninguno" when nothing recurs', () => {
    expect(quoteToMessage(calculateQuote('landing'))).toContain('- Ninguno');
  });
});
