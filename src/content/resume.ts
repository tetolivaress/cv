/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH for the website AND the PDFs, in English and Spanish.
 *
 *  Any text can be written once (same in both languages, e.g. company names or
 *  technologies) or as { en: "…", es: "…" }. UI labels live in copy.ts.
 *
 *  Values that are empty or start with "TODO" are skipped everywhere and listed
 *  in a warning when you run `pnpm dev` or `pnpm build` ([es] marks a missing
 *  Spanish translation). See README.md for step-by-step instructions.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { SectionKey } from "../i18n/routes";
import type {
  IssuerStyle,
  RawCertification,
  RawEducation,
  RawEra,
  RawExperience,
  RawPerson,
  RawProject,
  RawSkillGroup,
} from "./types";

export const person: RawPerson = {
  name: "Jesús Olivares",
  shortName: "Jesús O.",
  initials: "JO",
  title: {
    en: "Full-Stack Developer · React & React Native",
    es: "Desarrollador Full-Stack · React y React Native",
  },
  tagline: {
    en: "10 years building web and mobile products — from Laravel, Vue and jQuery to React, React Native, Next.js and NestJS.",
    es: "10 años creando productos web y móviles: de Laravel, Vue y jQuery a React, React Native, Next.js y NestJS.",
  },
  location: "Chacao, Caracas, Venezuela",
  workMode: { en: "Remote (GMT-4)", es: "Remoto (GMT-4)" },
  // Add `availability: { en: "Available for new projects", es: "Disponible para nuevos proyectos" }` to show the status pill.
  email: "tetolivares@gmail.com",
  photo: "/images/profile.png",
  photoFocus: "50% 15%",
  links: {
    linkedin: "https://www.linkedin.com/in/frontend-jesus-olivares",
    github: "https://github.com/tetolivaress",
    telegram: "https://t.me/caribote",
    youtube: "TODO: your YouTube channel URL",
  },
  languages: [
    { name: { en: "Spanish", es: "Español" }, level: { en: "Native", es: "Nativo" }, cefr: "C2", native: true },
    {
      name: { en: "English", es: "Inglés" },
      level: { en: "Advanced", es: "Avanzado" },
      // As the latest diploma states it: Slang General English, Advanced 3 (level 15 of 16).
      cefr: "Advanced 3",
      note: { en: "certified", es: "certificado" },
    },
  ],
  summary: {
    en: "Software developer with 10 years of experience across web and mobile. Started full-stack with PHP, Laravel, Vue and jQuery, specialized in React and React Native, and now ships full-stack products with Next.js, NestJS and AI-assisted workflows. Strong UI/UX background: able to design, build and deploy a product end to end.",
    es: "Desarrollador de software con 10 años de experiencia en web y móvil. Empecé como full-stack con PHP, Laravel, Vue y jQuery, me especialicé en React y React Native, y hoy entrego productos full-stack con Next.js, NestJS y flujos de trabajo asistidos por IA. Sólida base en UI/UX: puedo diseñar, construir y desplegar un producto de punta a punta.",
  },
};

/**
 * Stack eras used by the "Stack evolution" strip and the timeline headers. Newest first.
 * Two eras run to "Now": 05 is my own products (the Projects section), kept apart from the jobs.
 */
export const eras: RawEra[] = [
  { id: "05", label: { en: "Own products · Next.js / NestJS", es: "Productos propios · Next.js / NestJS" }, from: "2023", to: "Now" },
  { id: "04", label: { en: "React & React Native", es: "React y React Native" }, from: "2021", to: "Now" },
  { id: "03", label: { en: "Full-stack · Laravel & Vue", es: "Full-stack · Laravel y Vue" }, from: "2018", to: "2021" },
  { id: "02", label: { en: "Remote · jQuery & AngularJS", es: "Remoto · jQuery y AngularJS" }, from: "2017", to: "2018" },
  { id: "01", label: { en: "Perl & PHP · public sector", es: "Perl y PHP · sector público" }, from: "2016", to: "2017" },
];

/** Newest first. `era` must match one of the ids above. */
export const experience: RawExperience[] = [
  {
    company: "Zenta Group",
    role: { en: "Frontend Developer", es: "Desarrollador Frontend" },
    start: "2022-06",
    end: "Present",
    remote: true,
    era: "04",
    // A consultancy: the bullets live in each client project below, newest first.
    highlights: [],
    // The hero "Currently at" badge shows the first 3 tags on one line: keep them short (it overflows on tablets otherwise).
    stack: ["Next.js", "TypeScript", "Leaflet", "TanStack Query", "React Hook Form", "Google Maps"],
    projects: [
      {
        name: { en: "Tropper: route planning", es: "Tropper: planificación de rutas" },
        start: "2025-11",
        end: "Present",
        highlights: {
          en: [
            "Built a 5-step transport request wizard with Excel bulk import and a Google Maps route editor with draggable stops and batched geocoding.",
            "Built a Leaflet route planner that renders ORS/VROOM routes, compares them with the client's route and lets users drag error points to fix them.",
            "Exported planning PDFs with Leaflet map snapshots and scaled the planner to large requests with lazy per-service loading.",
          ],
          es: [
            "Construí un asistente de 5 pasos para solicitudes de transporte con importación masiva desde Excel y un editor de rutas en Google Maps con paradas arrastrables y geocodificación por lotes.",
            "Construí un planificador de rutas en Leaflet que muestra las rutas del optimizador ORS/VROOM, las compara con la ruta del cliente y permite arrastrar los puntos con error para corregirlos.",
            "Exporté reportes PDF de la planeación con capturas del mapa de Leaflet y escalé el planificador a solicitudes grandes con carga diferida por servicio.",
          ],
        },
        stack: ["Next.js", "TypeScript", "Leaflet", "TanStack Query", "React Hook Form", "Google Maps"],
      },
      {
        name: { en: "Perired: expert-witness portal (Angular)", es: "Perired: portal de peritos judiciales (Angular)" },
        start: "2025-09",
        end: "2025-10",
        highlights: {
          en: [
            "Built a lead-capture flow for an expert-witness portal: lawyers register with Chilean RUT/phone validation and reCAPTCHA v2 to unlock expert CV downloads.",
            "Built an admin lawyer directory with a paginated table and Excel export (SheetJS), and fixed CV and certificate downloads.",
            "Wired reCAPTCHA keys through Docker and Google Cloud Build, fixed the expert chatbot integration and shipped the client's light theme and branding.",
          ],
          es: [
            "Desarrollé un flujo de captación para un portal de peritos: los abogados se registran con validación de RUT y teléfono chileno y reCAPTCHA v2 para descargar el CV del perito.",
            "Desarrollé un listado de abogados en el panel admin con tabla paginada y exportación a Excel (SheetJS), y corregí la descarga de CVs y certificados.",
            "Configuré las claves de reCAPTCHA en Docker y Google Cloud Build, corregí la integración del chatbot del perito y apliqué el tema claro y la marca del cliente.",
          ],
        },
        stack: ["Angular", "RxJS", "TailwindCSS", "reCAPTCHA", "SheetJS", "Docker", "Google Cloud Build"],
      },
      {
        name: { en: "FEMSA Salud: internal chatbot admin panel", es: "FEMSA Salud: panel de administración del chatbot interno" },
        start: "2025-09",
        end: "2025-10",
        highlights: {
          en: [
            "Built cascading country → company → area filters with role-based access for the admin panel of FEMSA Salud's internal chatbot, wired into every metrics report.",
            "Added a correct-answers rate KPI, Excel report export and a reusable KPI card, and moved the dashboard logic into a custom hook.",
            "Built super-admin user management with per-user cross-area document access, and area-aware document uploads with dynamic Yup validation.",
          ],
          es: [
            "Construí filtros en cascada país → empresa → área con acceso por rol para el panel de administración del chatbot interno de FEMSA Salud, conectados a todos los reportes de métricas.",
            "Agregué el KPI de tasa de respuestas correctas, la exportación de reportes a Excel y una tarjeta de KPI reutilizable, y moví la lógica del dashboard a un custom hook.",
            "Construí la gestión de usuarios para súper administradores con acceso por usuario a documentos de otras áreas, y la carga de documentos por área con validación dinámica en Yup.",
          ],
        },
        stack: ["React", "TypeScript", "Material UI", "React Hook Form", "Yup", "Vite"],
      },
      {
        name: { en: "CMPC: Boxia", es: "CMPC: Boxia" },
        start: "2022-09",
        end: "2025-08",
        highlights: {
          en: [
            "Maintained and expanded product features with minimal design guidelines.",
            "Used a UI/UX background to solve responsive design problems independently.",
          ],
          es: [
            "Mantuve y amplié funcionalidades del producto con lineamientos de diseño mínimos.",
            "Aproveché mi base en UI/UX para resolver problemas de diseño responsive de forma autónoma.",
          ],
        },
        stack: ["React", "TypeScript", "TailwindCSS"],
      },
      {
        name: { en: "La Barra: back office", es: "La Barra: back office" },
        start: "2022-06",
        end: "2022-08",
        highlights: {
          en: [
            "Built the back-office application without a design to follow, and its UX/UI was recognized as a strength.",
          ],
          es: [
            "Desarrollé la aplicación de back office sin un diseño previo, y su solución de UX/UI fue reconocida como un punto fuerte.",
          ],
        },
        stack: ["React"],
      },
    ],
  },
  {
    company: "Mercately",
    role: { en: "Frontend Developer", es: "Desarrollador Frontend" },
    start: "2021-05",
    end: "2021-09",
    era: "04",
    highlights: {
      en: [
        "Built the front end of a messaging hub that centralizes MercadoLibre, Instagram and WhatsApp chats.",
        "Maintained and added features to the React Native app for Android and iOS.",
        "Used Redux extensively for state management.",
      ],
      es: [
        "Desarrollé el front end de un hub de mensajería que centraliza los chats de MercadoLibre, Instagram y WhatsApp.",
        "Mantuve y añadí funcionalidades a la app en React Native para Android e iOS.",
        "Usé Redux de forma intensiva para la gestión del estado.",
      ],
    },
    stack: ["React", "React Native", "Redux", "Bootstrap"],
  },
  {
    company: "API Trips",
    role: { en: "Node.js Developer", es: "Desarrollador Node.js" },
    start: "2020-03",
    end: "2020-04",
    era: "03",
    highlights: {
      en: ["Built a REST API and designed the MySQL database.", "Implemented the authentication flow with Passport.js."],
      es: ["Construí una API REST y diseñé la base de datos MySQL.", "Implementé el flujo de autenticación con Passport.js."],
    },
    stack: ["Node.js", "Express", "MySQL", "Passport.js"],
  },
  {
    company: "Yotalis",
    role: { en: "Software Architect (Laravel · React · Vue)", es: "Arquitecto de software (Laravel · React · Vue)" },
    start: "2018-10",
    end: "2021-04",
    remote: true,
    era: "03",
    highlights: {
      en: [
        "Full-stack developer, team lead, UI designer and product manager.",
        "Designed an e-commerce platform's UI/UX in Adobe XD and built it with Laravel, Vue and React.",
        "Hired developers, designed the database and integrated a payment gateway, queues, transactional email APIs and Telegram.",
        "Introduced end-to-end testing with Cypress.",
        "Built a separate app to manage the publications platform's SEO texts, with React, Redux and an Express.js backend.",
      ],
      es: [
        "Desarrollador full-stack, líder de equipo, diseñador UI y product manager.",
        "Diseñé la UI/UX de una plataforma de e-commerce en Adobe XD y la desarrollé con Laravel, Vue y React.",
        "Contraté desarrolladores, diseñé la base de datos e integré una pasarela de pagos, colas, APIs de correo transaccional y Telegram.",
        "Introduje pruebas end-to-end con Cypress.",
        "Desarrollé una aplicación aparte para gestionar los textos SEO de la plataforma de publicaciones, con React, Redux y un backend en Express.js.",
      ],
    },
    stack: ["Laravel", "Vue.js", "React", "Redux", "Express", "Sass", "Bootstrap", "jQuery", "MySQL", "Adobe XD", "Cypress"],
  },
  {
    company: "AthenaUp / AthenaCryptoBank",
    role: { en: "Full-Stack Developer", es: "Desarrollador Full-Stack" },
    start: "2017-12",
    end: "2018-08",
    remote: true,
    era: "02",
    highlights: {
      en: [
        "Built Athena CryptoBank, a single-page application with AngularJS, PHP and MySQL.",
        "Built the landing page with jQuery and Bootstrap, without a backend.",
      ],
      es: [
        "Desarrollé Athena CryptoBank, una aplicación de una sola página con AngularJS, PHP y MySQL.",
        "Desarrollé la landing page con jQuery y Bootstrap, sin backend.",
      ],
    },
    stack: ["AngularJS", "PHP", "MySQL", "Bootstrap", "jQuery"],
  },
  {
    company: "Ministerio de Economía y Finanzas (Venezuela)",
    role: { en: "Full-Stack Developer & Laravel Trainer", es: "Desarrollador Full-Stack e instructor de Laravel" },
    start: "2017-01",
    end: "2018-03",
    era: "01",
    highlights: {
      en: [
        "Built the call-center system's reports, with date and other filters, using PHP, jQuery, Bootstrap, mPDF and PostgreSQL.",
        "Built an equipment-assignment system connected to the inventory system, with PHP, PostgreSQL and JasperReports.",
        "Trained developers in Laravel and maintained internal systems.",
      ],
      es: [
        "Desarrollé la reportería del sistema de call center, con filtros por fecha y otros, usando PHP, jQuery, Bootstrap, mPDF y PostgreSQL.",
        "Desarrollé un sistema de asignación de equipos a empleados conectado al sistema de inventario, con PHP, PostgreSQL y JasperReports.",
        "Formé a desarrolladores en Laravel y mantuve sistemas internos.",
      ],
    },
    stack: ["PHP", "Laravel", "jQuery", "Bootstrap", "PostgreSQL", "JasperReports"],
  },
  {
    company: "Bandes",
    role: { en: "Intern, then Full-Stack Developer", es: "Pasante y luego desarrollador full-stack" },
    start: "2016",
    end: "2016",
    era: "01",
    highlights: {
      en: ["Built and maintained the FAS (Fondo Autoadministrado de Salud) health-fund system with Perl's Catalyst framework and jQuery."],
      es: ["Desarrollé y mantuve el sistema FAS (Fondo Autoadministrado de Salud) con el framework Catalyst de Perl y jQuery."],
    },
    stack: ["Perl", "Catalyst", "jQuery", "JavaScript"],
  },
];

/**
 * Projects, in display order. Covers and gallery images are real screenshots taken by each product's
 * tutorial pipeline; videos are the YouTube tutorial and launch video, one upload per language.
 * Summaries/stacks marked "drafted" came from ~/personal/CLAUDE.md, please review.
 */
export const projects: RawProject[] = [
  {
    slug: "caribito",
    name: "Caribito",
    url: "https://caribito.com",
    summary: {
      en: "Venezuelan tourism marketplace that connects trip operators with travelers.",
      es: "Marketplace de turismo venezolano que conecta a operadores de viajes con viajeros.",
    },
    role: { en: "Founder · full-stack developer", es: "Fundador · desarrollador full-stack" },
    // drafted from the caribito.com repo
    stack: ["Next.js", "NestJS", "PostgreSQL", "TanStack Query", "Playwright"],
    cover: "/projects/caribito/cover.png",
    videos: [
      {
        title: { en: "How to Book Trips in Venezuela (and Sell Your Tours) | Caribito Tutorial", es: "Cómo reservar viajes por Venezuela (y vender tus tours) | Tutorial de Caribito" },
        youtubeId: { en: "y3rZIvl8fmo", es: "t-lowrHejK8" },
        duration: { en: "4:41", es: "4:58" },
        poster: { en: "/projects/caribito/video-tutorial-en.jpg", es: "/projects/caribito/video-tutorial-es.jpg" },
      },
      {
        title: { en: "Caribito: Trips Across Venezuela with Verified Operators | Launch", es: "Caribito: viajes por Venezuela con operadores verificados | Lanzamiento" },
        youtubeId: { en: "RdohvEu9uTY", es: "en2FJEM31m0" },
        duration: { en: "0:30", es: "0:30" },
        poster: { en: "/projects/caribito/video-launch-en.jpg", es: "/projects/caribito/video-launch-es.jpg" },
      },
    ],
    images: [
      { src: "/projects/caribito/01-results-traveler.png", alt: { en: "Search results with filters", es: "Resultados de búsqueda con filtros" } },
      { src: "/projects/caribito/02-itinerary-traveler.png", alt: { en: "Day-by-day itinerary and departures", es: "Itinerario día a día y salidas" } },
      { src: "/projects/caribito/03-panel-operator.png", alt: { en: "Operator dashboard", es: "Panel del operador" } },
      { src: "/projects/caribito/04-leads-operator.png", alt: { en: "WhatsApp leads", es: "Leads de WhatsApp" } },
      { src: "/projects/caribito/05-profile-business.png", alt: { en: "Public operator profile", es: "Perfil público del operador" } },
    ],
  },
  {
    slug: "tutrainer",
    name: "TuTrainer",
    url: "https://tutrainer.com",
    summary: {
      en: "App for personal trainers to track every client's progress.",
      es: "App para entrenadores personales que registra el progreso de cada cliente.",
    },
    role: { en: "Founder · full-stack developer", es: "Fundador · desarrollador full-stack" },
    stack: ["Next.js", "NestJS", "TypeScript"],
    cover: "/projects/tutrainer/cover.png",
    videos: [
      {
        title: { en: "Personal Trainer App: Plan, Log and Track Every Client | TuTrainer Tutorial", es: "App para entrenadores personales: planifica y registra a cada alumno | Tutorial de TuTrainer" },
        youtubeId: { en: "furvWQ-jHII", es: "g72FY1DoWDs" },
        duration: { en: "5:17", es: "5:36" },
        poster: { en: "/projects/tutrainer/video-tutorial-en.jpg", es: "/projects/tutrainer/video-tutorial-es.jpg" },
      },
      {
        title: { en: "TuTrainer: Every Client. Every Session. | Launch", es: "TuTrainer: cada alumno, cada sesión | Lanzamiento" },
        youtubeId: { en: "jQBUVQ-X-kw", es: "ZcWQ4vrNabI" },
        duration: { en: "0:30", es: "0:30" },
        poster: { en: "/projects/tutrainer/video-launch-en.jpg", es: "/projects/tutrainer/video-launch-es.jpg" },
      },
    ],
    images: [
      { src: "/projects/tutrainer/01-trainer-builder-trainer.png", alt: { en: "Routine builder", es: "Constructor de rutinas" } },
      { src: "/projects/tutrainer/02-trainer-profile-plan-trainer.png", alt: { en: "Client profile with the weekly plan", es: "Perfil del alumno con el plan semanal" } },
      { src: "/projects/tutrainer/03-trainee-progress-trainee.png", alt: { en: "Client progress and metrics", es: "Progreso y métricas del alumno" } },
      { src: "/projects/tutrainer/04-trainee-home-trainee.png", alt: { en: "Client home with today's workout", es: "Inicio del alumno con el entreno de hoy" } },
      { src: "/projects/tutrainer/05-trainer-thread-send-trainer.png", alt: { en: "Messages between trainer and client", es: "Mensajes entre entrenador y alumno" } },
    ],
  },
  {
    slug: "daniela-cucine",
    name: "Daniela Cucine",
    url: "https://danielacucine.com",
    // drafted from the yorman repo
    summary: {
      en: "Showcase site for a family carpentry business, with catalog, blog and a 3D design service.",
      es: "Sitio de una carpintería familiar, con catálogo, blog y un servicio de diseño 3D.",
    },
    role: "TODO",
    stack: ["Next.js", "Prisma", "PostgreSQL"],
    cover: "/projects/daniela-cucine/cover.png",
    videos: [
      {
        title: { en: "Design Custom Furniture in 3D Online | Danielacucine Tutorial", es: "Diseña muebles a medida en 3D | Tutorial de Danielacucine" },
        youtubeId: { en: "gop1j1HOuT8", es: "IE5ikyllNwc" },
        duration: { en: "4:24", es: "4:09" },
        poster: { en: "/projects/daniela-cucine/video-tutorial-en.jpg", es: "/projects/daniela-cucine/video-tutorial-es.jpg" },
      },
      {
        title: { en: "Danielacucine: Solid Wood Furniture, Made by Hand | Launch", es: "Danielacucine: muebles de madera maciza hechos a mano | Lanzamiento" },
        youtubeId: { en: "huuyy1-7xuc", es: "m2y7jAgRDB8" },
        duration: { en: "0:30", es: "0:30" },
        poster: { en: "/projects/daniela-cucine/video-launch-en.jpg", es: "/projects/daniela-cucine/video-launch-es.jpg" },
      },
    ],
    images: [
      { src: "/projects/daniela-cucine/01-bed-visitor.png", alt: { en: "Product page", es: "Página de producto" } },
      { src: "/projects/daniela-cucine/02-creator-3d-design.png", alt: { en: "3D closet designer", es: "Creador 3D de clósets" } },
      { src: "/projects/daniela-cucine/03-casa-arrange-design.png", alt: { en: "Pieces arranged together in 3D", es: "Piezas combinadas en 3D" } },
      { src: "/projects/daniela-cucine/04-gallery-visitor.png", alt: { en: "3D gallery", es: "Galería 3D" } },
      { src: "/projects/daniela-cucine/05-panel-workshop.png", alt: { en: "Workshop admin panel", es: "Panel de administración del taller" } },
    ],
  },
  {
    slug: "zivave",
    name: "Zivave",
    url: "https://www.zivave.com",
    // drafted from the shop repo
    summary: {
      en: "Luxury e-commerce store with bank-transfer payments, an admin panel and a blog.",
      es: "Tienda e-commerce de lujo con pagos por transferencia bancaria, panel de administración y blog.",
    },
    role: "TODO",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Better Auth"],
    cover: "/projects/zivave/cover.png",
    videos: [
      {
        title: { en: "Shop Signature Accessories and Order on WhatsApp | Ziva Tutorial", es: "Compra accesorios de autor y pide por WhatsApp | Tutorial de Ziva" },
        youtubeId: { en: "kDYS3bcZ8BQ", es: "6CFUdxtxdls" },
        duration: { en: "4:13", es: "4:06" },
        poster: { en: "/projects/zivave/video-tutorial-en.jpg", es: "/projects/zivave/video-tutorial-es.jpg" },
      },
      {
        title: { en: "Ziva: The House of Fine Accessories | Launch", es: "Ziva: la casa del accesorio | Lanzamiento" },
        youtubeId: { en: "yZHpVz_bT5M", es: "97JmoH-cB-o" },
        duration: { en: "0:30", es: "0:30" },
        poster: { en: "/projects/zivave/video-launch-en.jpg", es: "/projects/zivave/video-launch-es.jpg" },
      },
    ],
    images: [
      { src: "/projects/zivave/01-listing-discover.png", alt: { en: "Catalog with filters", es: "Catálogo con filtros" } },
      { src: "/projects/zivave/02-product-discover.png", alt: { en: "Product page", es: "Página de producto" } },
      { src: "/projects/zivave/03-bag-order.png", alt: { en: "Bag with the customer discount", es: "Bolsa con el descuento de cliente" } },
      { src: "/projects/zivave/04-journal-discover.png", alt: { en: "Blog", es: "Blog" } },
      { src: "/projects/zivave/05-products-store.png", alt: { en: "Admin panel: products", es: "Panel de administración: productos" } },
    ],
  },
  {
    slug: "reactool",
    name: "Reactool",
    url: "https://reactool.app",
    // drafted from the careperro repo
    summary: {
      en: "Privacy-first browser toolbox where every tool runs 100% on your device.",
      es: "Caja de herramientas para el navegador que cuida tu privacidad: cada herramienta funciona 100 % en tu dispositivo.",
    },
    role: "TODO",
    stack: ["React"],
    cover: "/projects/reactool/cover.png",
    videos: [
      {
        title: { en: "Free File Tools That Never Upload Your Files | Reactool Tutorial", es: "Herramientas gratis para tus archivos, sin subirlos | Tutorial de Reactool" },
        youtubeId: { en: "Uzt8ctfViKs", es: "7AmRaClsDt8" },
        duration: { en: "4:28", es: "4:31" },
        poster: { en: "/projects/reactool/video-tutorial-en.jpg", es: "/projects/reactool/video-tutorial-es.jpg" },
      },
      {
        title: { en: "Reactool: Edit Any File. Upload Nothing. | Launch", es: "Reactool: edita cualquier archivo sin subir nada | Lanzamiento" },
        youtubeId: { en: "2LBUt1Zf4K0", es: "zg9SY_0w-ng" },
        duration: { en: "0:30", es: "0:30" },
        poster: { en: "/projects/reactool/video-launch-en.jpg", es: "/projects/reactool/video-launch-es.jpg" },
      },
    ],
    images: [
      { src: "/projects/reactool/01-en-image-compress.png", alt: { en: "Image compressor", es: "Compresor de imágenes" } },
      { src: "/projects/reactool/02-en-privacy-encrypt.png", alt: { en: "File encryption", es: "Cifrado de archivos" } },
      { src: "/projects/reactool/03-en-productivity-pomodoro.png", alt: { en: "Pomodoro timer", es: "Temporizador Pomodoro" } },
    ],
  },
];

export const skills: RawSkillGroup[] = [
  {
    group: "Frontend",
    items: [
      "React",
      "Next.js",
      "Redux / Redux Toolkit",
      "React Query",
      "Context API",
      "Vue.js",
      "Nuxt",
      "Quasar",
      "Angular",
      "AngularJS",
      "TailwindCSS",
      "Sass",
      "Bootstrap",
      "Three.js / React Three Fiber",
    ],
  },
  { group: { en: "Mobile", es: "Móvil" }, items: ["React Native"] },
  {
    group: "Backend",
    items: ["Node.js", "NestJS", "Express", "PHP", "Laravel", { en: "REST APIs", es: "APIs REST" }, "OAuth / Passport.js"],
  },
  { group: { en: "Databases", es: "Bases de datos" }, items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"] },
  { group: { en: "Languages", es: "Lenguajes" }, items: ["TypeScript", "JavaScript (ES6+)", "PHP", "SQL"] },
  { group: { en: "Testing", es: "Pruebas" }, items: ["Jest", "React Testing Library", "Cypress"] },
  { group: { en: "Tools", es: "Herramientas" }, items: ["Git", "Webpack", "Vercel", "Google Cloud Build", "Claude Code", "Pencil.dev", "Adobe XD"] },
  {
    group: { en: "Practices", es: "Prácticas" },
    items: [
      { en: "UI/UX design", es: "Diseño UI/UX" },
      "Agile",
      "SOLID",
      { en: "Software architecture", es: "Arquitectura de software" },
      { en: "Microfrontends (learning)", es: "Microfrontends (aprendiendo)" },
    ],
  },
];

export const education: RawEducation[] = [
  {
    degree: { en: "Systems Engineer", es: "Ingeniero de Sistemas" },
    school: "Universidad Nacional Experimental Politécnica de la Fuerza Armada Nacional (UNEFA)",
    year: "2018",
  },
];

const B2 = { en: "English B2 certification", es: "Certificación de inglés B2" };

/** Add a new certificate here and (optionally) its image to /public/certificates. */
export const certifications: RawCertification[] = [
  { category: "English", name: B2, issuer: "Slang App", date: "TODO", credentialUrl: "", image: "" },
  { category: "English", name: B2, issuer: "ZentaGroup", date: "TODO", credentialUrl: "", image: "", featured: true },
  { category: "English", name: { en: "Presenting course · 297 lessons", es: "Curso Presenting · 297 lecciones" }, issuer: "Slang App", date: "2026-10", credentialUrl: "", image: "/certificates/slang-presenting.jpg" },
  { category: "English", name: { en: "Running Meetings course · 430 lessons", es: "Curso Running Meetings · 430 lecciones" }, issuer: "Slang App", date: "2026-09", credentialUrl: "", image: "/certificates/slang-running-meetings.jpg" },
  { category: "English", name: { en: "Conversational Skills course · 327 lessons", es: "Curso Conversational Skills · 327 lecciones" }, issuer: "Slang App", date: "2026-07", credentialUrl: "", image: "/certificates/slang-conversational-skills.jpg" },
  { category: "English", name: { en: "General English · Advanced 3 (level 15 of 16)", es: "Inglés general · Advanced 3 (nivel 15 de 16)" }, issuer: "Slang App", date: "2026-07", credentialUrl: "", image: "/certificates/slang-advanced-3.jpg" },
  { category: "English", name: { en: "General English · Advanced 2 (level 14 of 16)", es: "Inglés general · Advanced 2 (nivel 14 de 16)" }, issuer: "Slang App", date: "2026-05", credentialUrl: "", image: "/certificates/slang-advanced-2.jpg" },
  { category: "English", name: { en: "General English · Advanced 1 (level 13 of 16)", es: "Inglés general · Advanced 1 (nivel 13 de 16)" }, issuer: "Slang App", date: "2026-03", credentialUrl: "", image: "/certificates/slang-advanced-1.jpg" },
  { category: "English", name: { en: "General English · Advanced Intermediate 3 (level 12 of 16)", es: "Inglés general · Advanced Intermediate 3 (nivel 12 de 16)" }, issuer: "Slang App", date: "2025-12", credentialUrl: "", image: "/certificates/slang-advanced-intermediate-3.jpg" },
  { category: "English", name: { en: "General English · Advanced Intermediate 2 (level 11 of 16)", es: "Inglés general · Advanced Intermediate 2 (nivel 11 de 16)" }, issuer: "Slang App", date: "2025-10", credentialUrl: "", image: "/certificates/slang-advanced-intermediate-2.jpg" },
  { category: "English", name: { en: "General English · Advanced Intermediate 1 (level 10 of 16)", es: "Inglés general · Advanced Intermediate 1 (nivel 10 de 16)" }, issuer: "Slang App", date: "2025-08", credentialUrl: "", image: "/certificates/slang-advanced-intermediate-1.jpg" },
  { category: "English", name: { en: "Basic English A2: Common Questions and Answers", es: "Inglés básico A2: preguntas y respuestas comunes" }, issuer: "Platzi", date: "2023-04", credentialUrl: "https://platzi.com/p/tetolivares/curso/4988-course/diploma/detalle/", image: "/certificates/platzi-english-a2-questions-answers.jpg" },
  { category: "English", name: { en: "Basic English A1: Dates, Times and Simple Expressions", es: "Inglés básico A1: fechas, horas y expresiones simples" }, issuer: "Platzi", date: "2022-10", credentialUrl: "https://platzi.com/p/tetolivares/curso/2395-course/diploma/detalle/", image: "/certificates/platzi-english-a1-dates-times.jpg" },
  { category: "English", name: { en: "Basic English Workshop: Work Elements", es: "Inglés práctico: elementos de trabajo" }, issuer: "Platzi", date: "2022-10", credentialUrl: "https://platzi.com/p/tetolivares/curso/3996-course/diploma/detalle/", image: "/certificates/platzi-english-work-elements.jpg" },
  { category: "English", name: { en: "Basic English A1: Present Simple and Common Vocabulary", es: "Inglés básico A1: presente simple y vocabulario común" }, issuer: "Platzi", date: "2022-09", credentialUrl: "https://platzi.com/p/tetolivares/curso/2393-course/diploma/detalle/", image: "/certificates/platzi-english-a1-present-simple.jpg" },
  { category: "English", name: { en: "Basic English A1: For Beginners", es: "Inglés básico para principiantes" }, issuer: "Platzi", date: "2022-09", credentialUrl: "https://platzi.com/p/tetolivares/curso/3093-course/diploma/detalle/", image: "/certificates/platzi-english-a1-beginners.jpg" },
  { category: "English", name: { en: "Basic English A1: Short and Common Conversations", es: "Inglés básico A1: conversaciones cortas y habituales" }, issuer: "Platzi", date: "2022-09", credentialUrl: "https://platzi.com/p/tetolivares/curso/1945-course/diploma/detalle/", image: "/certificates/platzi-english-a1-short-conversations.jpg" },
  { category: "English", name: { en: "Basic English Workshop: Personal Descriptions", es: "Inglés práctico: descripciones personales" }, issuer: "Platzi", date: "2022-09", credentialUrl: "https://platzi.com/p/tetolivares/curso/2005-course/diploma/detalle/", image: "/certificates/platzi-english-personal-descriptions.jpg" },
  { category: "English", name: { en: "Basic English Workshop: Family Members", es: "Inglés práctico: miembros de la familia" }, issuer: "Platzi", date: "2022-09", credentialUrl: "https://platzi.com/p/tetolivares/curso/3230-course/diploma/detalle/", image: "/certificates/platzi-english-family-members.jpg" },
  {
    category: "English",
    name: { en: "General English, Elementary program (GE Elementary 1–3)", es: "Inglés general, programa Elementary (GE Elementary 1–3)" },
    issuer: "Slang App",
    date: "2024-04",
    credentialUrl: "",
    image: "/certificates/slang-elementary.jpg",
  },
  { category: "Development", name: { en: "Frontend Architecture career", es: "Carrera de Arquitectura Frontend" }, issuer: "Platzi", date: "TODO", credentialUrl: "", image: "" },
  { category: "Development", name: { en: "Vue.js career", es: "Carrera de Vue.js" }, issuer: "Platzi", date: "TODO", credentialUrl: "", image: "" },
  { category: "Development", name: { en: "Backend Development with PHP career", es: "Carrera de Desarrollo Backend con PHP" }, issuer: "Platzi", date: "2018-03", credentialUrl: "https://platzi.com/p/tetolivares/ruta/10-ruta/diploma/detalle/", image: "/certificates/backend-php-career-platzi.jpg" },
  { category: "Development", name: { en: "Agentic Design Patterns: Effective Responses to Challenges", es: "Patrones de diseño agéntico: respuestas efectivas a desafíos" }, issuer: "Udemy", date: "2026-11", credentialUrl: "https://www.udemy.com/certificate/UC-d84c6003-cf3b-4123-985b-4d5be83a6979/", image: "/certificates/agentic-design-patterns-udemy.jpg", featured: true },
  { category: "Development", name: "Claude Code: The Practical Guide", issuer: "Udemy", date: "2026-03", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-40e1a0f8-d724-4f47-93c9-8edbe9936da5/", image: "/certificates/claude-code-udemy.jpg", featured: true },
  { category: "Development", name: { en: "React Native CLI: Native Apps for iOS and Android", es: "React Native CLI: aplicaciones nativas para iOS y Android" }, issuer: "Udemy", date: "2025-10", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-4470e91d-7696-404b-99d0-1eb081c1e4ef/", image: "/certificates/react-native-cli-udemy.jpg", featured: true },
  { category: "Development", name: { en: "Angular: Zero to Expert (2025 edition)", es: "Angular: de cero a experto (edición 2025)" }, issuer: "Udemy", date: "2025-10", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-0cd0846b-cf9c-4aef-9221-25b0a0aae8ab/", image: "/certificates/angular-zero-to-expert-udemy.jpg", featured: true },
  { category: "Development", name: "React Native: The Practical Guide [2025]", issuer: "Udemy", date: "2025-08", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-3d384bbb-8688-458d-aa77-d45abd830dad/", image: "/certificates/react-native-practical-guide-udemy.jpg" },
  { category: "Development", name: "Three.js, React Three Fiber, Drei, React Spring & More", issuer: "Udemy", date: "2025-01", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-fe359994-2e58-4639-abae-b42e53b4cc85/", image: "/certificates/threejs-r3f-drei-udemy.jpg" },
  { category: "Development", name: "React Three Fiber", issuer: "Udemy", date: "2024-12", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-fddd4a78-b274-48a5-a354-75e4a5422b02/", image: "/certificates/react-three-fiber-udemy.jpg" },
  { category: "Development", name: "Learn Three.js and Shaders from Scratch", issuer: "Udemy", date: "2024-10", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-72baac0b-9fe5-4ed2-a22d-f8e6cbe01693/", image: "/certificates/threejs-shaders-udemy.jpg" },
  { category: "Development", name: "Monorepos: A Beginner's Guide", issuer: "Udemy", date: "2024-08", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-b0bea246-9b02-4ed4-bc60-0fd1d20e56fa/", image: "/certificates/monorepos-udemy.jpg" },
  { category: "Development", name: "Three.js and TypeScript", issuer: "Udemy", date: "2024-07", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-b5c6c399-bfd7-42e6-9886-36db77498ed4/", image: "/certificates/threejs-typescript-udemy.jpg" },
  { category: "Development", name: { en: "Zustand: State Management for React", es: "Zustand: gestor de estado para React" }, issuer: "Udemy", date: "2024-05", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-760903c1-9ced-48f5-900d-f7a7faa02e8e/", image: "/certificates/zustand-udemy.jpg" },
  { category: "Development", name: { en: "NestJS: Microservices with NestJS, AWS and Docker", es: "NestJS: microservicios con NestJS, AWS y Docker" }, issuer: "Udemy", date: "2023-08", credentialUrl: "https://www.udemy.com/certificate/UC-3d635d5b-b373-4728-bd01-972835b55c61/", image: "/certificates/nestjs-microservices-udemy.jpg" },
  { category: "Development", name: { en: "Next.js: the React framework for production", es: "Next.js: el framework de React para producción" }, issuer: "Udemy", date: "2024-05", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-bed1fc60-4226-47dd-ae37-6bd145deba55/", image: "/certificates/nextjs-udemy.jpg" },
  { category: "Development", name: { en: "Test Automation with Playwright", es: "Automatización de tests con Playwright" }, issuer: "Platzi", date: "2024-05", credentialUrl: "https://platzi.com/p/tetolivares/curso/5679-course/diploma/detalle/", image: "/certificates/playwright-platzi.jpg" },
  { category: "Development", name: { en: "Backend with NestJS", es: "Backend con NestJS" }, issuer: "Platzi", date: "2023-05", credentialUrl: "https://platzi.com/p/tetolivares/curso/2272-course/diploma/detalle/", image: "/certificates/nestjs-backend-platzi.jpg" },
  { category: "Development", name: { en: "Unit Testing for TypeScript & Node.js with Jest", es: "Pruebas unitarias para TypeScript y Node.js con Jest" }, issuer: "Udemy", date: "2023-11", credentialUrl: "https://www.udemy.com/certificate/UC-4712dcfe-2c52-457d-93c8-c94fc4c9b33b/", image: "/certificates/jest-unit-testing-udemy.jpg" },
  { category: "Development", name: "Master NestJS 9 · Node.js Framework", issuer: "Udemy", date: "2023-09", credentialUrl: "", image: "/certificates/nestjs-udemy.jpg" },
  { category: "Development", name: { en: "Advanced React 2", es: "React avanzado 2" }, issuer: "LinkedIn Learning", date: "2023-09", credentialUrl: "", image: "/certificates/react-avanzado-2-linkedin.jpg" },
  { category: "Development", name: { en: "Master in JavaScript: JS, jQuery, Angular 7 and Node.js", es: "Máster en JavaScript: JS, jQuery, Angular 7 y NodeJS" }, issuer: "Udemy", date: "2019-02", credentialUrl: "", image: "/certificates/master-javascript-udemy.jpg" },
  { category: "Development", name: { en: "Advanced Vue.js and Firebase", es: "Vue.js avanzado y Firebase" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: { en: "Professional Vue.js", es: "Vue.js profesional" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "React.js", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Node.js", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Express.js", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: { en: "PHP with Laravel", es: "PHP con Laravel" }, issuer: "Platzi", date: "2018-01", credentialUrl: "https://platzi.com/p/tetolivares/curso/1122-course/diploma/detalle/", image: "/certificates/php-laravel-platzi.jpg" },
  { category: "Development", name: { en: "Advanced PHP", es: "PHP avanzado" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "ECMAScript 6+", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Webpack 4", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Angular 4", issuer: "Platzi", date: "2018-04", credentialUrl: "https://platzi.com/p/tetolivares/curso/1153-course/diploma/detalle/", image: "/certificates/angular-4-platzi.jpg" },
  { category: "Development", name: { en: "Ionic (basic)", es: "Ionic (básico)" }, issuer: "Platzi", date: "2018-05", credentialUrl: "https://platzi.com/p/tetolivares/curso/1281-course/diploma/detalle/", image: "/certificates/ionic-platzi.jpg" },
  { category: "Development", name: "Flutter / Dart", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: { en: "Basic Java", es: "Curso básico de Java" }, issuer: "Platzi", date: "2017-07", credentialUrl: "https://platzi.com/p/tetolivares/curso/1004-course/diploma/detalle/", image: "/certificates/java-basico-platzi.jpg" },
  { category: "Development", name: { en: "Introduction to PHP", es: "Introducción a PHP" }, issuer: "Platzi", date: "2017-07", credentialUrl: "", image: "/certificates/intro-php-platzi.jpg" },
  { category: "Development", name: { en: "Basic Programming", es: "Programación básica" }, issuer: "Platzi", date: "2017-05", credentialUrl: "", image: "/certificates/programacion-basica-platzi.jpg" },
  // The published copy hides the national ID number printed on the original.
  { category: "Development", name: "Java SE", issuer: "Benllisoft", date: "2016-06", credentialUrl: "", image: "/certificates/java-se-benllisoft.jpg" },
  { category: "Data", name: { en: "Database Fundamentals", es: "Fundamentos de bases de datos" }, issuer: "Platzi", date: "2018-01", credentialUrl: "https://platzi.com/p/tetolivares/curso/1183-course/diploma/detalle/", image: "/certificates/database-fundamentals-platzi.jpg" },
  { category: "Data", name: { en: "SQL and MySQL", es: "SQL y MySQL" }, issuer: "Platzi", date: "2018-01", credentialUrl: "https://platzi.com/p/tetolivares/curso/50-course/diploma/detalle/", image: "/certificates/sql-mysql-platzi.jpg" },
  { category: "Data", name: { en: "MongoDB and Redis", es: "MongoDB y Redis" }, issuer: "Platzi", date: "2018-02", credentialUrl: "https://platzi.com/p/tetolivares/curso/1187-course/diploma/detalle/", image: "/certificates/mongodb-redis-platzi.jpg" },
  { category: "Other", name: { en: "Professional Git and GitHub", es: "Git y GitHub profesional" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Other", name: { en: "Introduction to Agile Methodologies", es: "Introducción a las metodologías ágiles" }, issuer: "Platzi", date: "2017-11", credentialUrl: "https://platzi.com/p/tetolivares/curso/1075-course/diploma/detalle/", image: "/certificates/agile-platzi.jpg" },
  { category: "Other", name: { en: "Leadership for Work Teams", es: "Liderazgo para equipos de trabajo" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Other", name: { en: "Problem-Solving Techniques", es: "Técnicas de resolución de problemas" }, issuer: "LinkedIn Learning", date: "2023-07", credentialUrl: "", image: "/certificates/problem-solving-linkedin.jpg" },
  { category: "Other", name: { en: "Conflict Resolution (Zenta)", es: "Resolución de conflictos (Zenta)" }, issuer: "Udemy", date: "2024-09", credentialUrl: "https://zentagroup.udemy.com/certificate/UC-4651f5ac-cbd2-4bfa-bbc8-7fe7992ff664/", image: "/certificates/conflict-resolution-zenta-udemy.jpg" },
  { category: "Other", name: { en: "Persuading Others", es: "Persuadir a los demás" }, issuer: "LinkedIn Learning", date: "2023-06", credentialUrl: "", image: "/certificates/persuadir-linkedin.jpg" },
  { category: "Other", name: { en: "Adobe XD: professional prototypes from scratch", es: "Adobe XD: aprende a crear prototipos profesionales desde 0" }, issuer: "Udemy", date: "2018-09", credentialUrl: "", image: "/certificates/adobe-xd-udemy.jpg" },
];

/** Badge color and initial for each certificate issuer (placeholder thumbnails use them too). */
export const issuers: Record<string, IssuerStyle> = {
  Platzi: { color: "#98CA3F", initial: "P" },
  Udemy: { color: "#A435F0", initial: "U" },
  "Slang App": { color: "#E8553E", initial: "S" },
  ZentaGroup: { color: "#1F5CFF", initial: "Z" },
  "LinkedIn Learning": { color: "#0A66C2", initial: "L" },
  Benllisoft: { color: "#E8501E", initial: "B" },
};

/** Site-level settings (language-independent). UI text lives in copy.ts. */
export const site = {
  /**
   * Public URL of the portfolio. On Vercel the production domain is detected
   * automatically; set NEXT_PUBLIC_SITE_URL to override it.
   */
  url: "TODO: https://your-domain.com",
  pdf: {
    fileName: { en: "Jesus-Olivares-CV.pdf", es: "Jesus-Olivares-CV-ES.pdf" },
    pageSize: "A4" as "A4" | "LETTER",
  },
  /** Sections shown in the desktop header (About lives in the side/mobile menus). */
  headerNav: ["experience", "projects", "skills", "certifications", "english", "contact"] as SectionKey[],
};
