/**
 * Generates public/og.png (1200x630) from public/logo-bit-byte.png.
 * Run with: bun run og
 */
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const path = (relative: string) => fileURLToPath(new URL(relative, root));

const LOGO = path('public/logo-bit-byte.png');
const OUTPUT = path('public/og.png');

const WIDTH = 1200;
const HEIGHT = 630;
const BACKGROUND = '#131315';
const CORAL = '#fd625d';
const WHITE = '#f7f5f2';
const MUTED = '#9ca3af';

const TITLE = 'Bit &amp; Byte Studio';
const TAGLINE = 'Webs y software a medida para negocios en Cuba';

// The source logo is 1024x1024 with the mark in this box; the wordmark below it is cropped out
// because the OG image draws its own text.
const MARK = { left: 336, top: 318, width: 350, height: 232 };
// The source background is #151517 and the brand background is #131315: shift it by 2 levels
// so the cropped mark blends into the canvas without a visible edge.
const BACKGROUND_OFFSET = -2;
const MARK_SCALE = 1.45;

const markWidth = Math.round(MARK.width * MARK_SCALE);
const markHeight = Math.round(MARK.height * MARK_SCALE);

const mark = await sharp(LOGO)
  .extract(MARK)
  .linear(1, BACKGROUND_OFFSET)
  .resize(markWidth, markHeight, { kernel: 'lanczos3' })
  .png()
  .toBuffer();

const markTop = 70;
const markLeft = Math.round((WIDTH - markWidth) / 2);

const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <style>
    .title { font: 700 76px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; fill: ${WHITE}; }
    .amp { fill: ${CORAL}; font-style: italic; font-weight: 400; }
    .tagline { font: 400 33px 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; fill: ${MUTED}; }
  </style>
  <text x="${WIDTH / 2}" y="${markTop + markHeight + 105}" text-anchor="middle" class="title">Bit <tspan class="amp">&amp;</tspan> Byte Studio</text>
  <text x="${WIDTH / 2}" y="${markTop + markHeight + 168}" text-anchor="middle" class="tagline">${TAGLINE}</text>
  <rect x="0" y="${HEIGHT - 8}" width="${WIDTH}" height="8" fill="${CORAL}"/>
</svg>`);

await sharp({
  create: { width: WIDTH, height: HEIGHT, channels: 3, background: BACKGROUND },
})
  .composite([
    { input: mark, left: markLeft, top: markTop },
    { input: text, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9, effort: 10 })
  .toFile(OUTPUT);

const { width, height } = await sharp(OUTPUT).metadata();
const kb = statSync(OUTPUT).size / 1024;
console.log(`og.png ${width}x${height}, ${kb.toFixed(1)} KB (title: ${TITLE.replace('&amp;', '&')})`);

if (width !== WIDTH || height !== HEIGHT) throw new Error('og.png must be 1200x630');
if (kb >= 300) throw new Error(`og.png is ${kb.toFixed(1)} KB, expected < 300 KB`);
