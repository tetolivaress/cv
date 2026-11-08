/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH for the website AND the PDF CV.
 *  Converted from resume-data.json. Edit this file to add a job, project,
 *  video or certification; see README.md for step-by-step instructions.
 *
 *  Any value that is empty or starts with "TODO" is skipped everywhere and
 *  listed in a warning when you run `pnpm dev` or `pnpm build`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type {
  Certification,
  Education,
  Era,
  Experience,
  IssuerStyle,
  Person,
  Project,
  SectionCopy,
} from "./types";

export const person: Person = {
  name: "Jesús Olivares",
  shortName: "Jesús O.",
  initials: "JO",
  title: "Full-Stack Developer · React & React Native",
  tagline:
    "10 years building web and mobile products — from Laravel, Vue and jQuery to React, React Native, Next.js and NestJS.",
  location: "Chacao, Caracas, Venezuela",
  workMode: "Remote (GMT-4)",
  availability: "Available for new projects",
  email: "tetolivares@gmail.com",
  // 166×205 px for now: send a larger original (≥ 800×960) to keep the desktop hero sharp.
  photo: "/images/profile.png",
  photoFocus: "50% 15%",
  links: {
    linkedin: "https://www.linkedin.com/in/frontend-jesus-olivares",
    github: "https://github.com/tetolivaress",
    telegram: "https://t.me/caribote",
    youtube: "TODO: your YouTube channel URL",
  },
  languages: [
    { name: "Spanish", level: "Native", cefr: "C2" },
    { name: "English", level: "Upper intermediate", cefr: "B2", note: "certified" },
  ],
  summary:
    "Software developer with 10 years of experience across web and mobile. Started full-stack with PHP, Laravel, Vue and jQuery, specialized in React and React Native, and now ships full-stack products with Next.js, NestJS and AI-assisted workflows. Strong UI/UX background: able to design, build and deploy a product end to end.",
};

/** Stack eras used by the "Stack evolution" strip and the timeline headers. Newest first. */
export const eras: Era[] = [
  { id: "04", label: "Full-stack · Next.js / NestJS", from: "2023", to: "Now" },
  { id: "03", label: "React & React Native", from: "2019", to: "2023" },
  { id: "02", label: "Vue & AngularJS", from: "2017", to: "2019" },
  { id: "01", label: "PHP · Laravel · jQuery", from: "2016", to: "2017" },
];

/** Newest first. `era` must match one of the ids above. */
export const experience: Experience[] = [
  {
    company: "Boxia",
    role: "Frontend Developer",
    start: "TODO",
    end: "Present",
    remote: true,
    era: "04",
    highlights: [
      "Maintain and expand product features with minimal design guidelines.",
      "Use a UI/UX background to solve responsive design problems independently.",
    ],
    stack: ["React", "TypeScript", "TailwindCSS"],
  },
  {
    company: "Labarra360",
    role: "Frontend Developer",
    start: "2022",
    end: "2022",
    era: "03",
    highlights: ["Built a back-office application."],
    stack: ["React"],
  },
  {
    company: "TODO: client name",
    role: "Frontend Developer",
    start: "TODO",
    end: "TODO",
    era: "03",
    highlights: ["Built a platform to manage SEO texts for an e-commerce platform."],
    stack: ["React"],
  },
  {
    company: "Mercately",
    role: "Frontend Developer",
    start: "2021-05",
    end: "2021-09",
    era: "03",
    highlights: [
      "Built the front end of a messaging hub that centralizes MercadoLibre, Instagram and WhatsApp chats.",
      "Maintained and added features to the React Native app for Android and iOS.",
      "Used Redux extensively for state management.",
    ],
    stack: ["React", "React Native", "Redux", "Bootstrap"],
  },
  {
    company: "API Trips",
    role: "Node.js Developer",
    start: "2020-03",
    end: "2020-04",
    era: "03",
    highlights: [
      "Built a REST API and designed the MySQL database.",
      "Implemented the authentication flow with Passport.js.",
    ],
    stack: ["Node.js", "Express", "MySQL", "Passport.js"],
  },
  {
    company: "Yotalis",
    role: "Software Architect (Laravel · React · Vue)",
    start: "2018-10",
    end: "2021-04",
    remote: true,
    era: "02",
    highlights: [
      "Full-stack developer, team lead, UI designer and product manager.",
      "Designed an e-commerce platform's UI/UX in Adobe XD and built it with Laravel, Vue and React.",
      "Introduced end-to-end testing with Cypress.",
    ],
    stack: ["Laravel", "Vue.js", "React", "Sass", "MySQL", "Adobe XD", "Cypress"],
  },
  {
    company: "AthenaUp / AthenaCryptoBank",
    role: "Full-Stack Developer",
    start: "2018-05",
    end: "2018-09",
    era: "02",
    highlights: [
      "Built a single-page application with AngularJS, PHP and MySQL.",
      "Built the landing page with HTML, CSS and jQuery.",
    ],
    stack: ["AngularJS", "PHP", "MySQL", "Bootstrap", "jQuery"],
  },
  {
    company: "Ministerio de Economía y Finanzas (Venezuela)",
    role: "Full-Stack Developer & Laravel Trainer",
    start: "2017-01",
    end: "2018-05",
    era: "01",
    highlights: [
      "Built a call-center system with PHP, jQuery, Bootstrap, mPDF and PostgreSQL.",
      "Built an asset-loan management system with PHP, PostgreSQL and JasperReports.",
      "Trained developers in Laravel and maintained internal systems.",
    ],
    stack: ["PHP", "Laravel", "jQuery", "Bootstrap", "PostgreSQL", "JasperReports"],
  },
  {
    company: "TODO: first company",
    role: "Full-Stack Developer",
    start: "2016",
    end: "2017",
    era: "01",
    highlights: ["Developed and maintained web applications with PHP, Bootstrap, CSS, JavaScript and jQuery."],
    stack: ["PHP", "JavaScript", "jQuery", "Bootstrap", "CSS"],
  },
];

/**
 * Projects, in display order. Covers are placeholders from the Pencil design:
 * replace /public/projects/<slug>/cover.png with real screenshots.
 * Summaries/stacks marked "drafted" came from ~/personal/CLAUDE.md, please review.
 */
export const projects: Project[] = [
  {
    slug: "caribito",
    name: "Caribito",
    url: "https://caribito.com",
    summary: "Venezuelan tourism marketplace that connects trip operators with travelers.",
    role: "Founder · full-stack developer",
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
    summary: "App for personal trainers to track every client's progress.",
    role: "Founder · full-stack developer",
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
    summary: "Showcase site for a family carpentry business, with catalog, blog and a 3D design service.",
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
    summary: "Luxury e-commerce store with bank-transfer payments, an admin panel and a blog.",
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
    summary: "Privacy-first browser toolbox where every tool runs 100% on your device.",
    role: "TODO",
    stack: ["React"],
    cover: "/projects/reactool/cover.png",
    videos: [],
    images: [],
  },
];

export const skills: Record<string, string[]> = {
  Frontend: [
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
  Mobile: ["React Native"],
  Backend: ["Node.js", "NestJS", "Express", "PHP", "Laravel", "REST APIs", "OAuth / Passport.js"],
  Databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  Languages: ["TypeScript", "JavaScript (ES6+)", "PHP", "SQL"],
  Testing: ["Jest", "React Testing Library", "Cypress"],
  Tools: ["Git", "Webpack", "Vercel", "Claude Code", "Pencil.dev", "Adobe XD"],
  Practices: ["UI/UX design", "Agile", "SOLID", "Software architecture", "Microfrontends (learning)"],
};

export const education: Education[] = [
  {
    degree: "Systems Engineer",
    school: "Universidad Nacional Experimental Politécnica de la Fuerza Armada Nacional (UNEFA)",
    year: "2018",
  },
];

/** Add a new certificate here and (optionally) its image to /public/certificates. */
export const certifications: Certification[] = [
  { category: "English", name: "English B2 certification", issuer: "Slang App", date: "TODO", credentialUrl: "", image: "" },
  { category: "English", name: "English B2 certification", issuer: "ZentaGroup", date: "TODO", credentialUrl: "", image: "", featured: true },
  { category: "Development", name: "Frontend Architecture career", issuer: "Platzi", date: "TODO", credentialUrl: "", image: "", featured: true },
  { category: "Development", name: "Vue.js career", issuer: "Platzi", date: "TODO", credentialUrl: "", image: "", featured: true },
  { category: "Development", name: "Backend Development with PHP career", issuer: "Platzi", date: "TODO", credentialUrl: "", image: "", featured: true },
  { category: "Development", name: "Master in JavaScript", issuer: "Udemy", date: "TODO", credentialUrl: "", image: "" },
  { category: "Development", name: "Advanced Vue.js and Firebase", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Professional Vue.js", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "React.js", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Node.js", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Express.js", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "PHP with Laravel", issuer: "Platzi", date: "2017", credentialUrl: "", image: "" },
  { category: "Development", name: "Advanced PHP", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "ECMAScript 6+", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Webpack 4", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Angular 4", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Ionic (basic)", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Development", name: "Flutter / Dart", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Data", name: "Database Fundamentals", issuer: "Platzi", date: "2017", credentialUrl: "", image: "" },
  { category: "Data", name: "SQL and MySQL", issuer: "Platzi", date: "2016", credentialUrl: "", image: "" },
  { category: "Data", name: "MongoDB and Redis", issuer: "Platzi", date: "2017", credentialUrl: "", image: "" },
  { category: "Other", name: "Professional Git and GitHub", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Other", name: "Introduction to Agile Methodologies", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Other", name: "Leadership for Work Teams", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
  { category: "Other", name: "Adobe XD", issuer: "Platzi", date: "", credentialUrl: "", image: "" },
];

/** Badge color and initial for each certificate issuer (placeholder thumbnails use them too). */
export const issuers: Record<string, IssuerStyle> = {
  Platzi: { color: "#98CA3F", initial: "P" },
  Udemy: { color: "#A435F0", initial: "U" },
  "Slang App": { color: "#E8553E", initial: "S" },
  ZentaGroup: { color: "#1F5CFF", initial: "Z" },
};
export const defaultIssuer: IssuerStyle = { color: "#6F7D78", initial: "·" };

/** Site-level settings and every piece of UI copy. Components never hard-code text. */
export const site = {
  /**
   * Public URL of the portfolio. On Vercel the production domain is detected
   * automatically; set NEXT_PUBLIC_SITE_URL to override it.
   */
  url: "TODO: https://your-domain.com",
  locale: "en",
  pdf: {
    fileName: "Jesus-Olivares-CV.pdf",
    pageSize: "A4" as "A4" | "LETTER",
  },
  meta: {
    title: "Jesús Olivares · Full-Stack Developer (React & React Native)",
    description:
      "Online CV and portfolio of Jesús Olivares, a full-stack developer with 10 years of experience in React, React Native, Next.js and NestJS. Live projects, video tutorials and a downloadable PDF CV.",
  },
  sections: {
    about: {
      id: "about",
      index: "01",
      nav: "About",
      eyebrow: "About",
      title: "Product-minded engineer, ten years in.",
    },
    experience: {
      id: "experience",
      index: "02",
      nav: "Experience",
      eyebrow: "Experience",
      title: "Ten years, four eras.",
      description: "{count} roles, from PHP and jQuery to full-stack TypeScript. Newest first.",
    },
    projects: {
      id: "projects",
      index: "03",
      nav: "Projects",
      eyebrow: "Projects",
      title: "Live products you can try.",
      description: "{count} products in production. Visit them live{videos}.",
    },
    skills: {
      id: "skills",
      index: "04",
      nav: "Skills",
      eyebrow: "Skills",
      title: "Tools I reach for.",
      description: "Grouped by where they live in the stack. No percentage bars, just what I use in production.",
    },
    certifications: {
      id: "certifications",
      index: "05",
      nav: "Certifications",
      eyebrow: "Education & certifications",
      title: "Always learning.",
      description: "A systems engineering degree, plus {count} courses and certifications since {since}.",
    },
    contact: {
      id: "contact",
      index: "06",
      nav: "Contact",
      eyebrow: "Contact",
      title: "Let’s build your next product.",
      description: "Open to full-time remote roles and freelance projects. I usually reply within 24 hours.",
    },
  } satisfies Record<string, SectionCopy>,
  /** Sections shown in the desktop header (About lives in the side/mobile menus). */
  headerNav: ["experience", "projects", "skills", "certifications", "contact"] as const,
  ui: {
    downloadCv: "Download CV (PDF)",
    downloadCvShort: "CV",
    fullCv: "Full CV (PDF)",
    contact: "Contact",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuTitle: "Menu",
    theme: "Theme",
    themeLight: "Light theme",
    themeDark: "Dark theme",
    skipToContent: "Skip to content",
    stackEvolution: "Stack evolution",
    eraPrefix: "Era",
    now: "Now",
    to: "to",
    present: "Present",
    remote: "Remote",
    currentlyAt: "Currently at",
    yearsOfExperience: "{n} years of experience",
    stats: {
      years: "Years of experience",
      companies: "Companies",
      projects: "Live products",
      certifications: "Certifications",
    },
    projectDetails: "Details",
    visitSite: "Visit site",
    visitLiveSite: "Visit live site",
    watchTutorial: "Watch tutorial",
    watchTutorials: "Watch tutorials ({n})",
    tutorialsChip: "{n} tutorial|{n} tutorials",
    projectsVideosSuffix: ", or watch the walkthrough videos",
    githubTile: {
      title: "More on GitHub",
      text: "Libraries, experiments and code samples from ten years of shipping.",
      cta: "Open GitHub",
    },
    tools: "{n} tools",
    degree: "Degree",
    languages: "Languages",
    viewCredential: "View credential",
    viewAllCerts: "View all certifications ({n})",
    certsHint: "Showing {shown} of {n} · opens a searchable gallery",
    certsHintMobile: "Swipe for more · tap a card to enlarge",
    copyEmail: "Copy email address",
    copied: "Email copied to clipboard",
    backToTop: "Back to top",
    footer: "© {year} {name} · Built with Next.js",
    project: {
      allProjects: "All projects",
      counter: "Project {i} / {n}",
      role: "Role",
      dates: "Dates",
      platform: "Platform",
      stack: "Stack",
      tutorialsEyebrow: "Tutorial videos",
      tutorialsTitle: "Watch it in action.",
      tutorialsDescription: "Short walkthroughs recorded for {name} users. Hosted on YouTube.",
      playlist: "Playlist",
      videosCount: "{n} video|{n} videos",
      part: "Part {n}",
      nowPlaying: "Now playing",
      play: "Play video: {title}",
      galleryEyebrow: "Screenshots",
      galleryTitle: "Inside the product.",
      galleryHint: "Click any image to enlarge",
      storyEyebrow: "Case study",
      storyTitle: "Problem → Solution → Result",
      problem: "Problem",
      solution: "Solution",
      result: "Result",
      previous: "Previous",
      next: "Next",
    },
    certs: {
      title: "Certifications",
      subtitle: "{n} certificates · {range}",
      all: "All",
      search: "Search certificates…",
      searchLabel: "Search certificates",
      clearSearch: "Clear search",
      close: "Close certifications",
      showing: "Showing {n} · sorted by date",
      emptyTitle: "No certificates match “{q}”",
      emptyText: "Try a different keyword or clear the filters to see all {n} certificates.",
      clearFilters: "Clear filters",
      enlarge: "Enlarge certificate: {name}",
      certificate: "Certificate",
      certificateOfCompletion: "Certificate of completion",
      lightboxLabel: "Certificate viewer",
      previous: "Previous certificate",
      next: "Next certificate",
      closeLightbox: "Close viewer",
    },
    notFound: {
      title: "Page not found",
      text: "The page you are looking for does not exist or was moved.",
      cta: "Back to home",
    },
    pdf: {
      summary: "Summary",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      education: "Education",
      certifications: "Certifications",
      languages: "Languages",
      moreCerts: "{n} more courses and certifications at {url}",
      portfolio: "Portfolio",
    },
  },
};
