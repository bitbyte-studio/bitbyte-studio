# Bit & Byte Studio

Sitio corporativo de **Bit & Byte Studio**, estudio de desarrollo web y software a medida para negocios en Cuba.

## 🚀 Stack

- **Astro 7** + TypeScript
- **Tailwind CSS 4**
- **Three.js** para el logo 3D del Hero (con un SVG de respaldo si falla WebGL)
- **Sora + Inter + JetBrains Mono** y **Material Symbols**, autoalojadas con la Fonts API de Astro. La página no hace peticiones a Google.

## 📋 Secciones

- 🏠 **Hero**: logo 3D, titular, subtítulo con cifras reales y un CTA a "Calcular presupuesto".
- ⚡ **Servicios y precios**: 7 servicios de proyecto en tarjetas desplegables (precio, plazo, qué incluye, para quién es), más el mantenimiento opcional, cómo se paga y hosting y dominio.
- 📁 **Portafolio**: proyectos demo con modal de vista previa.
- 🔄 **Proceso**: 5 pasos con todo el detalle visible.
- ❓ **Preguntas frecuentes**: `<details>` nativos y JSON-LD `FAQPage`.
- 🧰 **Stack** y 📬 **Contacto**: tecnologías, formulario que abre WhatsApp, y email.
- 🧮 **Cotizador**: calculadora de presupuesto (servicio, extras, publicación y mantenimiento).
- Páginas legales: `/privacidad` y `/terminos`.

## 🗂️ Dónde cambiar cada cosa

| Qué | Dónde |
| --- | --- |
| Precios, plazos, extras, hosting, dominio y condiciones de pago | `src/config/pricing.ts` (única fuente de verdad: web, cotizador y `/terminos` leen de aquí) |
| Preguntas frecuentes | `src/config/faq.ts`. Las que aún no tienen respuesta están en `PENDING_FAQ` y no se muestran. |
| Contacto (WhatsApp, email, redes) | `src/config/contact.ts` |
| Nombre, título y descripción del sitio | `src/config/site.ts` |
| Textos de servicios, proceso, stack y portafolio | `src/data.ts` |
| Lógica del cotizador | `src/lib/quote.ts` (con tests en `src/lib/quote.test.ts`) |
| Tipografías e iconos | `astro.config.mjs`. Un icono nuevo hay que añadirlo a la lista `ICONS` o se verá como texto. |
| Cabeceras de seguridad y caché | `vercel.json` |

## 📈 Analítica

Se usa **Umami Cloud**. El script se carga en `BaseLayout.astro` solo en producción (`import.meta.env.PROD`); el ID y la URL están en `src/config/site.ts`. Su dominio está permitido en la CSP de `vercel.json` (`cloud.umami.is` y `api-gateway.umami.dev`).

Todos los eventos pasan por `track()` en `src/lib/analytics.ts`, que llama a `window.umami?.track(...)` (si Umami no está cargado, no hace nada) y emite también un evento `bb:track` del navegador. Eventos: `whatsapp_click`, `quote_open`, `contact_submit`, `project_open`, `project_demo_click` y `project_quote_similar`. Si cambias de proveedor, actualiza también `/privacidad` y la CSP.

## 🛠️ Desarrollo

```bash
bun install        # instalar dependencias
bun dev            # desarrollo (http://localhost:4321)
bun run build      # build de producción
bun preview        # previsualizar el build
bun test           # tests de la lógica del cotizador
bun run check      # comprobación de tipos (astro check)
```

`astro check` todavía no soporta TypeScript 7, por eso el proyecto fija `typescript@6`.

## 📄 Licencia

© 2026 Bit & Byte Studio. Todos los derechos reservados.
