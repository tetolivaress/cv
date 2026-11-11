# Jesús Olivares — online CV & portfolio

One-page CV, project pages with YouTube tutorials, a searchable certifications gallery, and a downloadable **ATS-friendly PDF**, in **English and Spanish**. It's built from the Pencil design in `design.pen` and statically exported for Vercel.

- **Stack:** Next.js 16 (App Router, `output: "export"`), React 19, TypeScript, Tailwind CSS 4, Radix Dialog, `@react-pdf/renderer`, Playwright + axe-core.
- **Single source of truth:** `src/content/resume.ts` (CV data, both languages) and `src/content/copy.ts` (UI labels). The website **and** the PDFs read from them.

## Commands

```bash
pnpm install          # once
pnpm dev              # http://localhost:3000 (also regenerates the PDF and image variants)
pnpm build            # static site in ./out (prebuild: PDF + images)
pnpm start            # serve ./out on http://localhost:3000
pnpm cv               # rebuild only the PDFs (English + Spanish)
pnpm typecheck
pnpm test             # all Playwright tests against ./out (run `pnpm build` first)
pnpm screenshots      # responsive screenshots → ./screenshots
```

The first Playwright run needs `npx playwright install chromium`.

## Editing content

Everything visible on the site lives in two files, so components never hard-code text:

- **`src/content/resume.ts`**: your CV data (jobs, projects, skills, certifications…).
- **`src/content/copy.ts`**: UI labels (buttons, section titles, menus), one block per language.

Edit them, then run `pnpm dev` or `pnpm build`.

### English and Spanish

In `resume.ts`, any text can be written once, when it's the same in both languages (company names, technologies):

```ts
company: "Mercately",
```

…or as one value per language:

```ts
role: { en: "Frontend Developer", es: "Desarrollador Frontend" },
highlights: {
  en: ["Built the front end of a messaging hub."],
  es: ["Desarrollé el front end de un hub de mensajería."],
},
```

> **Empty or `TODO` values are skipped automatically**, on the site and in the PDFs. Each build prints a yellow list of the fields that were skipped. Lines starting with `[es]` are missing Spanish translations; the rest apply to both languages.

The Spanish text was drafted from the English CV. Please review it.

### Add a job

Add an object to `experience` (newest first):

```ts
{
  company: "Acme",
  role: { en: "Senior Frontend Developer", es: "Desarrollador Frontend Senior" },
  start: "2025-02",        // "YYYY" or "YYYY-MM"
  end: "Present",          // or "2026-01"
  remote: true,
  era: "04",               // which era header it appears under (see `eras`)
  highlights: {
    en: ["What you did, with impact.", "Up to 3 show in the PDF."],
    es: ["Qué hiciste y su impacto.", "Hasta 3 aparecen en el PDF."],
  },
  stack: ["React", "TypeScript"],
},
```

Durations ("2 yrs 7 mos" / "2 años 7 meses") are computed from the dates. To start a new stack era, add it to the top of `eras`.

### Add a project

1. Add an object to `projects`. The `slug` becomes the URL (`/projects/<slug>` and `/es/proyectos/<slug>`):

   ```ts
   {
     slug: "my-app",
     name: "My App",
     url: "https://my-app.com",
     summary: { en: "One line for cards and the PDF.", es: "Una línea para las tarjetas y el PDF." },
     description: { en: "Optional longer text.", es: "Texto más largo, opcional." },
     role: { en: "Founder · full-stack developer", es: "Fundador · desarrollador full-stack" },
     dates: "Mar 2024 — Present",          // optional
     platform: "iOS · Android · Web",      // optional
     stack: ["Next.js", "NestJS"],
     cover: "/projects/my-app/cover.png",
     videos: [],
     images: [],
     // story: { problem: {title, text}, solution: {title, text}, result: {title, text, metrics: [{ value: "3×", label: "Faster" }]} },
   },
   ```

2. Put the cover in `public/projects/my-app/cover.png` (any size ≥ 1600 px wide; WebP variants are generated at build time).

The page, the sitemap entry, the previous/next links and the PDF line are all generated from that object.

### Add a YouTube tutorial

Add it to the project's `videos` array:

```ts
videos: [
  { title: { en: "Tour: booking in 2 minutes", es: "Recorrido: reserva en 2 minutos" }, youtubeId: "dQw4w9WgXcQ", duration: "4:12" },
],
```

`youtubeId` is the part after `v=` in the YouTube URL. The card shows "N tutorials", the "Watch tutorial" button appears, and the project page gets a player with a playlist. The YouTube iframe only loads after the visitor clicks play.

### Add screenshots to a project

Copy the images to `public/projects/<slug>/` and list them:

```ts
images: [{ src: "/projects/my-app/checkout.png", alt: { en: "Checkout screen", es: "Pantalla de pago" } }],
```

### Add a certification

1. Add an object to `certifications`:

   ```ts
   { category: "Development", name: { en: "Next.js App Router", es: "Next.js App Router" }, issuer: "Udemy", date: "2025-06",
     credentialUrl: "https://…", image: "/certificates/nextjs-app-router.jpg", featured: false },
   ```

   - `category` is one of `English`, `Development`, `Data`, `Other` (these are the filter chips).
   - `featured: true` shows it on the home page and in the PDF (keep about 4).
   - Without an `image`, a styled certificate placeholder is shown instead.

2. Optionally drop the image in `public/certificates/`.

A new issuer gets a grey badge. Give it a color and initial in `issuers`.

### Other things you might change

| What | Where |
| --- | --- |
| Name, title, tagline, email, links, languages, summary | `person` in `resume.ts` |
| "Available for new projects" pill (currently hidden) | add `availability: { en, es }` to `person` |
| Profile photo | `public/images/profile.png` (+ `person.photoFocus` to choose the crop) |
| Skills | `skills` |
| Section titles, buttons and every label | `src/content/copy.ts` (`en` and `es`) |
| URL words (`/es/experiencia`, …) | `src/i18n/routes.ts` |
| PDF page size (A4 / Letter) and file names | `site.pdf` in `resume.ts` |
| Production URL | Detected on Vercel. Override with the `NEXT_PUBLIC_SITE_URL` env var or `site.url` |

## How it works

```
src/
  content/
    resume.ts        ← CV data in both languages (edit this)
    copy.ts          ← UI labels per language (edit this)
    index.ts         ← getContent(locale): picks the language, drops TODO/empty values, derives stats, warnings
    format.ts        ← dates, durations, plurals (no data, safe in client components)
  i18n/              ← languages and URL structure
  app/
    (en)/            ← English: /, /[section], /projects, /projects/[slug](/tutorials)
    (es)/es/         ← Spanish: /es, /es/[section], /es/proyectos, /es/proyectos/[slug](/tutoriales)
    global-not-found.tsx, sitemap.ts, robots.ts, og.png, og-es.png
  components/        ← Header, Hero, Timeline, TimelineItem, ProjectCard, VideoEmbed, SkillGroup,
                       CertModal, CertCard, Footer, … (one per Pencil component)
  lib/               ← theme, site URL, image loader
scripts/
  build-cv.tsx       ← PDF generator + content warnings (runs before dev/build)
  optimize-images.ts ← WebP variants for next/image (static export has no image server)
tests/               ← Playwright: e2e, axe accessibility, responsive screenshots
```

### Languages

English lives at the root and Spanish under `/es`, with translated URLs:

| English | Spanish |
| --- | --- |
| `/experience` | `/es/experiencia` |
| `/projects/caribito/tutorials` | `/es/proyectos/caribito/tutoriales` |

- **The switch:** the **EN | ES** switch (header from 1024 px up, "Language" row in the mobile menu) opens the same page in the other language.
- **Remembering the choice:** the choice is saved in `localStorage`. Opening a link in the other language later redirects to the chosen one. First-time visitors and search engines stay on the URL they opened.
- **Two root layouts:** the `(en)` and `(es)` route groups each have one, so Spanish pages get `<html lang="es">`. The 404 page is `app/global-not-found.tsx`, a Next.js experimental option enabled in `next.config.ts`.
- **SEO:** every page declares its translation with `hreflang`, the sitemap lists both languages, and each language has its own OG image and PDF.

Client components never import the content modules; `SiteProvider` hands them the current language's labels. That keeps the JavaScript bundle free of CV data.

### Clean URLs (no `#`)

Every home section has its own address: `/about`, `/experience`, `/projects`, `/skills`, `/certifications` and `/contact` (`/es/sobre-mi`, `/es/experiencia`… in Spanish). Project tutorials live at `/projects/<slug>/tutorials`.

- On the home page, nav links smooth-scroll and update the address bar with `history.pushState`, so the page never reloads.
- Opening or reloading one of those URLs loads the same one-page CV and jumps to the section.
- Back and Forward move between sections.

These pages are generated from `src/i18n/routes.ts`. Their canonical URL is the home page of their language, so search engines index the CV once per language. The logic lives in `src/lib/section-nav.ts`, `SectionLink` and `SectionRouter`.

### PDF CV

`scripts/build-cv.tsx` renders `public/Jesus-Olivares-CV.pdf` and `public/Jesus-Olivares-CV-ES.pdf` (plus `cv.pdf` / `cv-es.pdf`) with `@react-pdf/renderer`. The Download buttons serve the PDF in the page's language. It's a single column with standard Helvetica and real selectable text. There's no photo, skill bars or icons, and every URL is written out in full and clickable. Sections, in order: Header, Summary, Experience, Projects, Skills, Education, Certifications ("N more at <site>/?certs=all") and Languages.

After rendering, the script re-reads each PDF with pdf.js and **fails the build** if any of these checks fails:

- it is 2 pages or fewer;
- every project URL appears as text;
- every project URL is a clickable link.

The Download buttons are plain `<a download>` links, so they work instantly, including on iOS Safari.

### Certifications modal

The modal has filter chips, a search box and a lightbox with keyboard arrows. It's a full-screen sheet on phones and a centered modal (max 1100 px) from 768 px up. Radix handles the focus trap, Esc to close, the body scroll lock and `aria-labelledby`. The URL stays in sync, so `/?certs=english` opens the modal already filtered.

### 2D / 3D view

The header (and the mobile menu) has a **2D | 3D** switch on the home page, saved in `localStorage` (`view`). The server
always renders the plain site; three.js, react-three-fiber, drei and react-spring are downloaded only when 3D is chosen.

- `src/lib/view-mode.ts`: the saved choice and the inline head script that applies it before first paint.
In 3D the whole page is in the ring, one card each: the hero ("Intro"), the stack evolution, the six sections and
contact. The plain hero and the contact footer are hidden (`[data-plain-only]`, `[data-site-footer="home"]`).

- `src/components/HomeView.tsx`: renders the page stacked (plain) or hands every part of it to the 3D track.
- `src/components/three/Track3D.tsx`: a tall scroll track with a stage pinned under the header. Each step of the track is
  an element with the section's id, so header links, clean URLs and the active-section highlight work as on the plain
  page. The front card's section is described in HTML and opens in full (the same server-rendered section) in a dialog.
  Vertical scrolling turns the ring; so do a sideways wheel or trackpad swipe, a finger swipe across the stage and the
  left/right arrow keys, all by moving the page's own scroll.
- `src/components/three/Scene3D.tsx`: the ring of cards. Page scroll turns it (react-spring). Each card is a
  `MeshPortalMaterial` window onto its own small world; hover drives the shaders in `shaders.ts` (warped backdrop,
  glow around the card) and the distortion of the floating shapes. Opening a section blends its portal to full screen.
- `src/content/panels3d.ts`: the few lines drawn inside each card, and each card's colour and shape.
- Text inside the canvas uses the Inter files in `public/fonts` (troika cannot read the woff2 that `next/font` serves).
- Everything that can suspend inside the canvas (card text waiting for its font) sits under a `Suspense` there. Left to
  bubble, it suspends the page around the canvas: the track is hidden for a moment and the scroll position is lost.
- Without WebGL the plain site is shown. With "reduce motion" the ring jumps instead of springing and the shaders stay still.

### Theme

Light and dark tokens come from the Pencil variables (`src/app/globals.css`). The theme defaults to the system preference and a manual choice is saved in `localStorage`. An inline script applies it before the first paint, so the page never flashes the wrong theme.

### Design notes and deliberate deviations

- **Breakpoints and gutters** match the Pencil frames: 16 / 20 / 40 / 48 / 120 px. Content is capped at 1280 px; the project grid widens to 1760 px with 4 columns from 1920 px. Fluid type and section spacing use `clamp()`.
- **Contrast:** three tokens are a touch darker/lighter than the design so all small text passes WCAG AA: `--text-tertiary` (light and dark) and `--accent-strong` (light). In dark mode the logo monogram is inverted (accent background) for the same reason.
- **Inter Tight:** headings use Inter with the exact extra negative tracking that Inter Tight applies (−0.0377 em at 600, −0.043 em at 500, measured in the browser). The result looks the same, and the page avoids a second 44 KB font, which keeps mobile Lighthouse ≥ 95 on project pages.
- **Projects at 1920 px:** the brief asks for 4 columns from 1920 px. The design shows 3 at 1920 and 4 at 3440, so the 3440 layout is used from 1920 up.
- **No fake player controls:** the video facade shows the title and play button only. YouTube's real controls appear once it loads.

## Quality checks

| Check | Result |
| --- | --- |
| Lighthouse mobile, home (EN and ES) | Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100 |
| Lighthouse mobile, project pages | 95–99 · 100 · 100 · 100 (LCP is the cover image) |
| Lighthouse desktop, all pages | 100 · 100 · 100 · 100 |
| axe-core WCAG 2.1 AA | 0 violations: home, project, modal, lightbox, menu; English and Spanish; light and dark; 393 px and 1440 px |
| Responsive | 17 viewports (360 → 3440, portrait and landscape), both languages, no horizontal overflow; screenshots in `./screenshots` |
| PDFs | 2 pages A4 each, selectable text, all links clickable |

Lighthouse was measured locally against `pnpm start`, in both color schemes, with:

```bash
npx lighthouse http://localhost:3000/projects/caribito --view                  # mobile
npx lighthouse http://localhost:3000/ --preset=desktop --view                  # desktop
```

## Deploying to Vercel

Import the repo in Vercel (framework preset: Next.js) or run `vercel`. No settings are needed. `pnpm build` runs the PDF and image scripts first, and the production domain is picked up from `VERCEL_PROJECT_PRODUCTION_URL`. That domain is used for canonical URLs, the sitemap, JSON-LD and the portfolio link in the PDF. If you use a custom domain, set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` so previews also print it.

`resume-data.json` is the original data export. `src/content/resume.ts` replaced it, so the JSON can be deleted.
