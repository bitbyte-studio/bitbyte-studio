# Bit & Byte Studio

Sitio corporativo de **Bit & Byte Studio**, estudio de desarrollo web y software a medida para negocios en Cuba.

## 🚀 Stack

- **Astro 7** + TypeScript
- **Tailwind CSS 4**
- **Three.js** para el logo 3D del Hero (con un SVG de respaldo si falla WebGL)
- **Sora + Inter + JetBrains Mono** y **Material Symbols**, autoalojadas con la Fonts API de Astro. La página no hace peticiones a Google.

## 📋 Secciones

- 🏠 **Hero**: logo 3D, titular, subtítulo con cifras reales y CTA principal a WhatsApp.
- ⚡ **Servicios y precios**: 8 servicios de proyecto en tarjetas desplegables (precio, plazo, qué incluye, para quién es), más el mantenimiento opcional, cómo se paga y hosting y dominio.
- 📁 **Ejemplos reales**: demos con botón directo para probarlas y modal de detalles.
- 🔄 **Proceso**: 5 pasos con todo el detalle visible.
- ❓ **Preguntas frecuentes**: `<details>` nativos y JSON-LD `FAQPage`.
- 📬 **Contacto**: formulario que abre WhatsApp, Telegram y email.
- Páginas legales: `/privacidad`, `/terminos` y `/seguridad`.

## 🗂️ Dónde cambiar cada cosa

| Qué | Dónde |
| --- | --- |
| Precios, plazos, hosting, dominio y condiciones de pago | `src/config/pricing.ts` (única fuente de verdad: web y `/terminos` leen de aquí) |
| Preguntas frecuentes | `src/config/faq.ts`. Las que aún no tienen respuesta están en `PENDING_FAQ` y no se muestran. |
| Contacto (WhatsApp, email, redes) | `src/config/contact.ts` |
| Nombre, título y descripción del sitio | `src/config/site.ts` |
| Textos de servicios, proceso y demos | `src/data.ts` |
| Tipografías e iconos | `astro.config.mjs`. Un icono nuevo hay que añadirlo a la lista `ICONS` o se verá como texto. |
| Cabeceras de seguridad y caché | `vercel.json` |

## 📈 Analítica

Se usa **Umami Cloud**. El script se carga en `BaseLayout.astro` solo en producción (`import.meta.env.PROD`); el ID y la URL están en `src/config/site.ts`. Su dominio está permitido en la CSP de `vercel.json` (`cloud.umami.is` y `api-gateway.umami.dev`).

Todos los eventos pasan por `track()` en `src/lib/analytics.ts`, que llama a `window.umami?.track(...)` (si Umami no está cargado, no hace nada) y emite también un evento `bb:track` del navegador. Eventos: `whatsapp_click`, `contact_submit`, `project_open` y `project_demo_click`. Si cambias de proveedor, actualiza también `/privacidad` y la CSP.

## 🛠️ Desarrollo

```bash
bun install        # instalar dependencias
bun dev            # desarrollo (http://localhost:4321)
bun run build      # build de producción
bun preview        # previsualizar el build
bun run check      # comprobación de tipos (astro check)
```

`astro check` todavía no soporta TypeScript 7, por eso el proyecto fija `typescript@6`.

## 📄 Licencia

Ver el repositorio.
