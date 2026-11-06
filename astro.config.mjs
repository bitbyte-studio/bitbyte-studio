// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Every icon used in the markup. A name missing here renders as plain text, so add new icons to this list.
const ICONS = [
  'brush',
  'build',
  'chat',
  'check',
  'check_circle',
  'close',
  'dashboard',
  'devices',
  'expand_less',
  'expand_more',
  'mail',
  'menu',
  'menu_book',
  'open_in_new',
  'payments',
  'restaurant_menu',
  'schedule',
  'send',
  'shopping_bag',
  'smart_toy',
  'storefront',
  'tune',
  'unfold_more',
  'web',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://bitbytestudio.vercel.app',
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Sora',
      cssVariable: '--font-sora',
      weights: [400, 600, 700, 800],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['monospace'],
    },
    {
      provider: fontProviders.googleicons(),
      name: 'Material Symbols Outlined',
      cssVariable: '--font-material-symbols',
      weights: [400],
      styles: ['normal'],
      display: 'block',
      options: { experimental: { glyphs: ICONS } },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
