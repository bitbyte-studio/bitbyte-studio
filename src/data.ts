import type { Project, ServiceItem, PricingPlan, TechItem } from './types';

export const SERVICES: ServiceItem[] = [
  {
    id: 'web-dev',
    number: '01/',
    icon: 'code',
    title: 'Web Dev',
    description: 'Sitios web de alto rendimiento optimizados para velocidad y SEO.',
    longDescription:
      'Diseñamos y desarrollamos arquitecturas web de ultra-bajo tiempo de carga utilizando frameworks modernos con renderizado estático y en servidor. Creadas con precisión para posicionamiento orgánico (SEO) y escalabilidad masiva.',
    deliverables: [
      'Arquitectura Next.js / Astro 100% optimizada',
      'Puntuación 98+ en Google Lighthouse (Core Web Vitals)',
      'CMS Headless auto-gestionable para tu equipo',
      'Optimización SEO técnica, semántica y OpenGraph'
    ],
    technologies: ['Astro', 'Tailwind CSS', 'Next.js', 'Sanity CMS', 'TypeScript'],
    useCase: 'Portales de marca, plataformas SaaS, webs institucionales y medios digitales de alto tráfico.'
  },
  {
    id: 'automation',
    number: '02/',
    icon: 'settings_suggest',
    title: 'Automation',
    description: 'Optimización de procesos internos mediante scripts y flujos digitales.',
    longDescription:
      'Eliminamos tareas repetitivas conectando tus sistemas de facturación, CRM, hojas de cálculo e inteligencia artificial mediante flujos automatizados de alta velocidad.',
    deliverables: [
      'Integración API entre sistemas incompatibles',
      'Bots de alertas automáticas (WhatsApp, Slack, Email)',
      'Procesamiento de datos e inventario con Python / Node.js',
      'Paneles de telemetría y monitoreo en tiempo real'
    ],
    technologies: ['Python', 'Node.js', 'Webhooks', 'Express', 'Google APIs'],
    useCase: 'Empresas con alta carga operativa, logística, reservas automáticas y reportes financieros.'
  },
  {
    id: 'ecommerce',
    number: '03/',
    icon: 'shopping_bag',
    title: 'E-commerce',
    description: 'Tiendas online robustas que maximizan tus ventas y conversiones.',
    longDescription:
      'Desarrollo de comercios electrónicos Headless y con Shopify/Sanity con tiempos de respuesta instantáneos, pasarelas locales e internacionales y embudos reducidos para alta conversión.',
    deliverables: [
      'Checkouts súper veloces con pagos en 1 clic',
      'Gestión de inventario multi-almacén optimizada',
      'Sincronización con pasarelas y envíos automáticos',
      'Analítica avanzada de carritos y clientes'
    ],
    technologies: ['React', 'Shopify Storefront API', 'Tailwind', 'Stripe / Pasarelas locales'],
    useCase: 'Marcos de moda, productos gourmet, electrónica de consumo y retail escalable.'
  },
  {
    id: 'hardware',
    number: '04/',
    icon: 'memory',
    title: 'Hardware',
    description: 'Soluciones integrales que unen el mundo físico con el digital.',
    longDescription:
      'Sistemas embebidos e internet de las cosas (IoT). Diseñamos sensores, tableros inteligentes y kioscos interactivos que envían telemetría y datos a tus aplicaciones web en tiempo real.',
    deliverables: [
      'Prototipado y firmware con ESP32 / Arduino',
      'Dashboards web para monitoreo IoT en tiempo real',
      'Comportamientos automatizados por sensores de presencia / clima',
      'Sistemas de display en punto de venta (POS inteligentes)'
    ],
    technologies: ['Arduino', 'C++', 'MQTT', 'WebSockets', 'React IoT'],
    useCase: 'Restaurantes inteligentes, agro-tech, exhibiciones de museo interactivas y domótica de lujo.'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'sazon-de-lola',
    title: 'La Sazón de Lola',
    description:
      'Plataforma gastronómica de vanguardia con sistema de reservas en tiempo real y gestión de inventario automatizada.',
    longDescription:
      'Para La Sazón de Lola creamos una experiencia digital a la altura de su cocina de autor. El sitio combina fotografía culinaria de alta definición con un motor de reservas instantáneo sincronizado en tiempo real y un panel para la gestión de mesas e inventario de cocina.',
    tags: ['Astro', 'Tailwind', 'Sanity'],
    category: 'web',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDqN2MYa9bhnwvjDiJdBGtwYrYYKW9Zv7KWdJqNO4MzX9BnfciFoqSJQxdmcWNkC_s8HdxYTKqVqlJV2R0G0az7cKuwIXBS9YxGhunY_hPm9JKE-5eVZcuAwVa6tYt1LUOMlLgpqM96XWiJe3kXPsjjKjKPiyKANUR7L4U1K2tsXmXDzKrFyJSpDmoR1OO_wK4dELRd09z63kb_Y2MMpIz6o9K3kTAaQ1WsoNJHnMNesElnQzfyemg7rQ',
    metrics: [
      { label: 'Tiempo de Carga', value: '0.4s' },
      { label: 'Reservas Automáticas', value: '+340% mo.' },
      { label: 'Lighthouse SEO', value: '100/100' }
    ],
    client: 'Lola Gastronomía S.A.',
    year: '2025',
    liveUrl: 'https://demo-sazondelola.bitandbyte.studio'
  },
  {
    id: 'barba-negra',
    title: 'Barba Negra',
    description:
      'E-commerce premium para productos de cuidado personal masculino, con una experiencia de usuario cinematográfica.',
    longDescription:
      'Un e-commerce brutalista y oscuro para una firma de cuidado de barba de alta gama. Integramos una experiencia inmersiva que permite a los usuarios previsualizar kits en 360°, suscribirse a envíos mensuales y disfrutar de un checkout fluido.',
    tags: ['React', 'Shopify'],
    category: 'ecommerce',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsLCU_o6ScBjxQNsDRU1Xgrr4RC_ikLvCwRwuwrnEDZwW-uQ-OG0JLfeshduRZJrxOP-CsZPyrYdywHbVpWhVB_AJVOkM93n9m9UE8xdnZrYguiTlO6ACEtBVGqdvuA62Pt6UqfUjqlLsynYBjAz6KZDkS9pVeUUXd0lL8oukUSH7Zu7cIo68LEbcKa0jn09RDlDTvQTcBCIOiQGAlifOQ_NVZT7li4Dc-llHbn6DktXe0wz8fBSr_6Q',
    metrics: [
      { label: 'Tasa de Conversión', value: '4.8%' },
      { label: 'Ticket Promedio', value: '+42%' },
      { label: 'Fidelización Suscritos', value: '89%' }
    ],
    client: 'Barba Negra Grooming Co.',
    year: '2025',
    liveUrl: 'https://demo-barbanegra.bitandbyte.studio'
  },
  {
    id: 'tropical-vibes',
    title: 'Tropical Vibes',
    description:
      'Landing page interactiva para un resort de lujo, integrando visuales 3D y una navegación fluida por capas.',
    longDescription:
      'Desarrollamos el portal inmersivo para un resort ecológico en el Caribe. Mediante visualizaciones con Three.js y transiciones orgánicas con GSAP, los visitantes pueden recorrer villas tropicales, consultar el pronóstico local del mar y cotizar su estadía.',
    tags: ['Three.js', 'GSAP'],
    category: 'interactive',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCboIh_L9uC8mIkqvkC8Xn-cUOtsxnFyMUN_TzRXW60jxJOv5Hb_IGYmQj_tW_42UkvT6t2DkIGD1Pebtk1Pxx7PZ38FLwcsMLAzKBXGKrkRR8dBRYWNA90o_bG4OoaQEGZSO2T8B6IvZVxcOXqh_GkMznySsGP2ijxNK8Rt8R_jBE9P76saiCTuVakh-je7YHJC4q5D1mXBzB9p2zNV9P_rrJUvoaH3yjyNbVKCPqr9uWpIoHUX2wTCA',
    metrics: [
      { label: 'Tiempo en página', value: '4m 15s' },
      { label: 'Interacción con 3D', value: '92%' },
      { label: 'Cotizaciones Directas', value: '+210%' }
    ],
    client: 'Tropical Vibes Resort & Spa',
    year: '2026',
    liveUrl: 'https://demo-tropicalvibes.bitandbyte.studio'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: '$499',
    period: '/pago único',
    description: 'Ideal para presencia digital personal o marcas emergentes.',
    features: [
      'Landing Page de Alto Impacto',
      'SEO Básico (Metadatos & Sitemap)',
      'Dominio + Hosting de alta velocidad (1 año)',
      'Diseño Responsivo Móvil / Desktop',
      'Integración con WhatsApp y Formulario'
    ],
    ctaText: 'Empezar ahora'
  },
  {
    id: 'professional',
    name: 'Profesional',
    price: '$999',
    period: '/pago único',
    description: 'Soluciones personalizadas para negocios en crecimiento.',
    features: [
      'Web Multi-página (hasta 8 secciones)',
      'CMS Headless (Auto-gestionable)',
      '3 Meses de Soporte & Mantenimiento',
      'Blog Integrado u Optimización SEO avanzada',
      'Panel de Analítica y Conversión en Vivo'
    ],
    popular: true,
    ctaText: 'Seleccionar Pro'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    price: '$1499',
    period: '/pago único',
    description: 'Tu tienda online completa con todas las herramientas.',
    features: [
      'Hasta 50 productos con variantes',
      'Pasarela de Pagos (Stripe / Local)',
      'Panel de Inventario y Alertas de Stock',
      'Automatización de correos y envíos',
      'Capacitación 1-on-1 para tu equipo de ventas'
    ],
    ctaText: 'Consultar ahora'
  }
];

export const TECH_STACK: TechItem[] = [
  {
    name: 'Astro',
    category: 'Framework Web',
    description: 'Cero JS innecesario por defecto, velocidad de carga instantánea para webs estáticas e híbridas.'
  },
  {
    name: 'Tailwind',
    category: 'Estilos & UI',
    description: 'Diseño arquitectónico con CSS utilitario de ultra alto rendimiento y consistencia.'
  },
  {
    name: 'React',
    category: 'UI Dinámica',
    description: 'El estándar industrial para crear interfaces y dashboards interactivos complejos.'
  },
  {
    name: 'Next.js',
    category: 'Full-Stack Web',
    description: 'Server-Side Rendering, API Routes e infraestructura escalable para apps empresariales.'
  },
  {
    name: 'Node.js',
    category: 'Backend & APIs',
    description: 'Servidores de alto rendimiento, microservicios y conectores de automatización.'
  },
  {
    name: 'Python',
    category: 'Automation & AI',
    description: 'Scripts de automatización industrial, análisis de datos y conectividad inteligente.'
  },
  {
    name: 'Shopify',
    category: 'E-commerce',
    description: 'Integraciones Headless y personalizadas para tiendas que facturan a gran escala.'
  },
  {
    name: 'Sanity',
    category: 'Headless CMS',
    description: 'Gestor de contenido estructurado que le otorga control total a tu equipo sin romper el código.'
  },
  {
    name: 'Arduino',
    category: 'Hardware & IoT',
    description: 'Prototipado electrónico, sensores embebidos e integración de dispositivos en tiempo real.'
  }
];

export const PROCESS_STEPS = [
  {
    step: 1,
    number: '01',
    title: 'Escuchamos',
    description: 'Entendemos tus metas, tu usuario objetivo y los desafíos de tu negocio.',
    detail: 'Sesión de discovery técnico donde identificamos cuellos de botella y trazamos requerimientos funcionales claros.'
  },
  {
    step: 2,
    number: '02',
    title: 'Diseñamos',
    description: 'Creamos la arquitectura y experiencia visual en alta fidelidad.',
    detail: 'Prototipos en Figma con sistema de diseño modular, pruebas de usabilidad y aprobación antes del primer commit.'
  },
  {
    step: 3,
    number: '03',
    title: 'Construimos',
    description: 'Código limpio, robusto y escalable con el mejor stack actual.',
    detail: 'Desarrollo ágil con entregas incrementales, CI/CD, auditorías automáticas de velocidad y seguridad.'
  },
  {
    step: 4,
    number: '04',
    title: 'Lanzamos',
    description: 'Despliegue, monitoreo continuo y soporte técnico prioritario.',
    detail: 'Puesta en producción sin tiempo de caída, optimización de infraestructura y telemetría activa en tiempo real.'
  }
];
