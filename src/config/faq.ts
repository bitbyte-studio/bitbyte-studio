import {
  CURRENCY,
  CURRENCY_NOTE,
  DOMAIN_OPTION,
  HOSTING_OPTIONS,
  MAINTENANCE,
  PAYMENT,
  PROJECT_SERVICES,
} from './pricing';

export interface FaqItem {
  question: string;
  answer: string;
}

const money = (value: number) => value.toLocaleString('en-US');

const freeHosting = HOSTING_OPTIONS.find((option) => option.price === 0);
const managedHosting = HOSTING_OPTIONS.find((option) => option.billing === 'monthly');

/**
 * Only facts already published in config/pricing.ts and /terminos.
 * Questions without an answer yet live in PENDING_FAQ so nothing gets invented.
 */
export const FAQ: readonly FaqItem[] = [
  {
    question: '¿Cuánto cuesta una web?',
    answer: `Depende del servicio. Los precios de partida van desde ${money(
      Math.min(...PROJECT_SERVICES.map((service) => service.from)),
    )} ${CURRENCY}. El precio final lo cerramos contigo por WhatsApp según lo que necesites, y el cotizador de la web te da un estimado antes de escribirnos.`,
  },
  {
    question: '¿Cuánto tarda?',
    answer: `Los plazos son orientativos: ${PROJECT_SERVICES.filter((service) => /\d/.test(service.leadTime))
      .map((service) => `${service.name.toLowerCase()}, ${service.leadTime}`)
      .join('; ')}. Dependen del alcance y de lo rápido que nos envíes la información.`,
  },
  {
    question: '¿Cómo se paga?',
    answer: `${PAYMENT.terms} Métodos de pago: ${PAYMENT.methods.join(', ')}. ${CURRENCY_NOTE}`,
  },
  {
    question: '¿El hosting y el dominio están incluidos?',
    answer: `No, se pagan aparte. ${freeHosting ? `Puedes publicar gratis en una dirección tipo ${freeHosting.description}. ` : ''}${
      managedHosting && managedHosting.price !== null
        ? `Si necesitas más, el hosting gestionado cuesta desde ${money(managedHosting.price)} ${CURRENCY}/mes. `
        : ''
    }${
      DOMAIN_OPTION.price !== null
        ? `Un dominio propio .com cuesta ${money(DOMAIN_OPTION.price)} ${CURRENCY} al año.`
        : ''
    }`.trim(),
  },
  {
    question: '¿El mantenimiento es obligatorio?',
    answer: `No, es opcional y se paga aparte: desde ${money(MAINTENANCE.from)} ${CURRENCY}${MAINTENANCE.suffix}. Incluye ${(
      MAINTENANCE.includes ?? []
    )
      .map((item) => item.charAt(0).toLowerCase() + item.slice(1))
      .join(', ')}.`,
  },
  {
    question: '¿Puedo pedir cambios durante el proyecto?',
    answer:
      'Te mostramos avances y hacemos las revisiones que acordemos en la cotización. Los cambios fuera de lo acordado se cotizan aparte.',
  },
  {
    question: '¿El cotizador es un precio cerrado?',
    answer:
      'No, es un estimado. Lo que vale es la cotización que te confirmamos por WhatsApp: ahí quedan el alcance, el precio y el plazo.',
  },
];

/**
 * Questions people usually ask that the site cannot answer yet. Fill in `answer` and move each one into FAQ;
 * they are not rendered on the page.
 */
export const PENDING_FAQ: readonly { question: string; note: string }[] = [
  { question: '¿Cuántas revisiones incluye cada proyecto?', note: 'Hoy solo consta "las que acordemos en la cotización".' },
  { question: '¿Qué necesito enviarte para empezar (fotos, textos, logo)?', note: 'Sin política escrita.' },
  { question: '¿Funciona sin internet o con datos móviles limitados?', note: 'Sin dato verificado.' },
  { question: '¿Quién es dueño de la web cuando se entrega?', note: 'Sin política escrita.' },
  { question: '¿Trabajan con negocios fuera de Cuba?', note: 'Sin dato verificado.' },
];
