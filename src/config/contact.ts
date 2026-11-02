export const WHATSAPP_NUMBER: string = '5350328131';
export const WHATSAPP_DISPLAY: string = '+53 5032 8131';
export const WHATSAPP_URL: string = 'https://wa.me/5350328131';

export const TELEGRAM_HANDLE: string = '@ItsJhonAlex';
export const TELEGRAM_URL: string = 'https://t.me/ItsJhonAlex';

export const EMAIL: string = 'itsjhonalex@gmail.com';
export const EMAIL_URL: string = `mailto:${EMAIL}`;

export function whatsappLink(message?: string): string {
  const text = message?.trim();
  return text ? `${WHATSAPP_URL}?text=${encodeURIComponent(text)}` : WHATSAPP_URL;
}

export function emailLink(subject?: string, body?: string): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return params.length ? `${EMAIL_URL}?${params.join('&')}` : EMAIL_URL;
}
