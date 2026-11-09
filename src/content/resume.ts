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
      level: { en: "Upper intermediate", es: "Intermedio alto" },
      cefr: "B2",
      note: { en: "certified", es: "certificado" },
    },
  ],
  summary: {
    en: "Software developer with 10 years of experience across web and mobile. Started full-stack with PHP, Laravel, Vue and jQuery, specialized in React and React Native, and now ships full-stack products with Next.js, NestJS and AI-assisted workflows. Strong UI/UX background: able to design, build and deploy a product end to end.",
    es: "Desarrollador de software con 10 años de experiencia en web y móvil. Empecé como full-stack con PHP, Laravel, Vue y jQuery, me especialicé en React y React Native, y hoy entrego productos full-stack con Next.js, NestJS y flujos de trabajo asistidos por IA. Sólida base en UI/UX: puedo diseñar, construir y desplegar un producto de punta a punta.",
  },
};

/** Stack eras used by the "Stack evolution" strip and the timeline headers. Newest first. */
export const eras: RawEra[] = [
  { id: "04", label: "Full-stack · Next.js / NestJS", from: "2023", to: "Now" },
  { id: "03", label: { en: "React & React Native", es: "React y React Native" }, from: "2019", to: "2023" },
  { id: "02", label: { en: "Vue & AngularJS", es: "Vue y AngularJS" }, from: "2017", to: "2019" },
  { id: "01", label: "PHP · Laravel · jQuery", from: "2016", to: "2017" },
];

/** Newest first. `era` must match one of the ids above. */
export const experience: RawExperience[] = [
  {
    company: "Zenta Group",
    role: { en: "Frontend Developer", es: "Desarrollador Frontend" },
    start: "2025-11",
    end: "Present",
    remote: true,
    era: "04",
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
    // The hero "Currently at" badge shows the first 3 tags on one line: keep them short (it overflows on tablets otherwise).
    stack: ["Next.js", "TypeScript", "Leaflet", "TanStack Query", "React Hook Form", "Google Maps"],
  },
  {
    company: "Boxia",
    role: { en: "Frontend Developer", es: "Desarrollador Frontend" },
    start: "TODO",
    end: "Present",
    remote: true,
    era: "04",
    highlights: {
      en: [
        "Maintain and expand product features with minimal design guidelines.",
        "Use a UI/UX background to solve responsive design problems independently.",
      ],
      es: [
        "Mantengo y amplío funcionalidades del producto con lineamientos de diseño mínimos.",
        "Aprovecho mi base en UI/UX para resolver problemas de diseño responsive de forma autónoma.",
      ],
    },
    stack: ["React", "TypeScript", "TailwindCSS"],
  },
  {
    company: "Labarra360",
    role: { en: "Frontend Developer", es: "Desarrollador Frontend" },
    start: "2022",
    end: "2022",
    era: "03",
    highlights: { en: ["Built a back-office application."], es: ["Desarrollé una aplicación de back-office."] },
    stack: ["React"],
  },
  {
    company: "TODO: client name",
    role: { en: "Frontend Developer", es: "Desarrollador Frontend" },
    start: "TODO",
    end: "TODO",
    era: "03",
    highlights: {
      en: ["Built a platform to manage SEO texts for an e-commerce platform."],
      es: ["Desarrollé una plataforma para gestionar los textos SEO de un e-commerce."],
    },
    stack: ["React"],
  },
  {
    company: "Mercately",
    role: { en: "Frontend Developer", es: "Desarrollador Frontend" },
    start: "2021-05",
    end: "2021-09",
    era: "03",
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
    era: "02",
    highlights: {
      en: [
        "Full-stack developer, team lead, UI designer and product manager.",
        "Designed an e-commerce platform's UI/UX in Adobe XD and built it with Laravel, Vue and React.",
        "Introduced end-to-end testing with Cypress.",
      ],
      es: [
        "Desarrollador full-stack, líder de equipo, diseñador UI y product manager.",
        "Diseñé la UI/UX de una plataforma de e-commerce en Adobe XD y la desarrollé con Laravel, Vue y React.",
        "Introduje pruebas end-to-end con Cypress.",
      ],
    },
    stack: ["Laravel", "Vue.js", "React", "Sass", "MySQL", "Adobe XD", "Cypress"],
  },
  {
    company: "AthenaUp / AthenaCryptoBank",
    role: { en: "Full-Stack Developer", es: "Desarrollador Full-Stack" },
    start: "2018-05",
    end: "2018-09",
    era: "02",
    highlights: {
      en: ["Built a single-page application with AngularJS, PHP and MySQL.", "Built the landing page with HTML, CSS and jQuery."],
      es: [
        "Desarrollé una aplicación de una sola página con AngularJS, PHP y MySQL.",
        "Desarrollé la landing page con HTML, CSS y jQuery.",
      ],
    },
    stack: ["AngularJS", "PHP", "MySQL", "Bootstrap", "jQuery"],
  },
  {
    company: "Ministerio de Economía y Finanzas (Venezuela)",
    role: { en: "Full-Stack Developer & Laravel Trainer", es: "Desarrollador Full-Stack e instructor de Laravel" },
    start: "2017-01",
    end: "2018-05",
    era: "01",
    highlights: {
      en: [
        "Built a call-center system with PHP, jQuery, Bootstrap, mPDF and PostgreSQL.",
        "Built an asset-loan management system with PHP, PostgreSQL and JasperReports.",
        "Trained developers in Laravel and maintained internal systems.",
      ],
      es: [
        "Desarrollé un sistema de call center con PHP, jQuery, Bootstrap, mPDF y PostgreSQL.",
        "Desarrollé un sistema de gestión de préstamos de activos con PHP, PostgreSQL y JasperReports.",
        "Formé a desarrolladores en Laravel y mantuve sistemas internos.",
      ],
    },
    stack: ["PHP", "Laravel", "jQuery", "Bootstrap", "PostgreSQL", "JasperReports"],
  },
  {
    company: "TODO: first company",
    role: { en: "Full-Stack Developer", es: "Desarrollador Full-Stack" },
    start: "2016",
    end: "2017",
    era: "01",
    highlights: {
      en: ["Developed and maintained web applications with PHP, Bootstrap, CSS, JavaScript and jQuery."],
      es: ["Desarrollé y mantuve aplicaciones web con PHP, Bootstrap, CSS, JavaScript y jQuery."],
    },
    stack: ["PHP", "JavaScript", "jQuery", "Bootstrap", "CSS"],
  },
];

/**
 * Projects, in display order. Covers are placeholders from the Pencil design:
 * replace /public/projects/<slug>/cover.png with real screenshots.
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
    videos: [{ title: "TODO", youtubeId: "TODO" }],
    images: [],
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
    videos: [{ title: "TODO", youtubeId: "TODO" }],
    images: [],
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
    videos: [],
    images: [],
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
    videos: [],
    images: [],
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
    videos: [],
    images: [],
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
  { group: { en: "Tools", es: "Herramientas" }, items: ["Git", "Webpack", "Vercel", "Claude Code", "Pencil.dev", "Adobe XD"] },
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
  { category: "Development", name: { en: "Frontend Architecture career", es: "Carrera de Arquitectura Frontend" }, issuer: "Platzi", date: "TODO", credentialUrl: "", image: "", featured: true },
  { category: "Development", name: { en: "Vue.js career", es: "Carrera de Vue.js" }, issuer: "Platzi", date: "TODO", credentialUrl: "", image: "", featured: true },
  { category: "Development", name: { en: "Backend Development with PHP career", es: "Carrera de Desarrollo Backend con PHP" }, issuer: "Platzi", date: "TODO", credentialUrl: "", image: "", featured: true },
  { category: "Development", name: { en: "Master in JavaScript", es: "Máster en JavaScript" }, issuer: "Udemy", date: "TODO", credentialUrl: "", image: "" },
  { category: "Development", name: { en: "Advanced Vue.js and Firebase", es: "Vue.js avanzado y Firebase" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: { en: "Professional Vue.js", es: "Vue.js profesional" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "React.js", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Node.js", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Express.js", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: { en: "PHP with Laravel", es: "PHP con Laravel" }, issuer: "Platzi", date: "2017", credentialUrl: "", image: "" },
  { category: "Development", name: { en: "Advanced PHP", es: "PHP avanzado" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "ECMAScript 6+", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Webpack 4", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Angular 4", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: { en: "Ionic (basic)", es: "Ionic (básico)" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Flutter / Dart", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Data", name: { en: "Database Fundamentals", es: "Fundamentos de bases de datos" }, issuer: "Platzi", date: "2017", credentialUrl: "", image: "" },
  { category: "Data", name: { en: "SQL and MySQL", es: "SQL y MySQL" }, issuer: "Platzi", date: "2016", credentialUrl: "", image: "" },
  { category: "Data", name: { en: "MongoDB and Redis", es: "MongoDB y Redis" }, issuer: "Platzi", date: "2017", credentialUrl: "", image: "" },
  { category: "Other", name: { en: "Professional Git and GitHub", es: "Git y GitHub profesional" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Other", name: { en: "Introduction to Agile Methodologies", es: "Introducción a las metodologías ágiles" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Other", name: { en: "Leadership for Work Teams", es: "Liderazgo para equipos de trabajo" }, issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Other", name: "Adobe XD", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
];

/** Badge color and initial for each certificate issuer (placeholder thumbnails use them too). */
export const issuers: Record<string, IssuerStyle> = {
  Platzi: { color: "#98CA3F", initial: "P" },
  Udemy: { color: "#A435F0", initial: "U" },
  "Slang App": { color: "#E8553E", initial: "S" },
  ZentaGroup: { color: "#1F5CFF", initial: "Z" },
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
  headerNav: ["experience", "projects", "skills", "certifications", "contact"] as SectionKey[],
};
