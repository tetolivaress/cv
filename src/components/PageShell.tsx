import { getSiteClient } from "@/content";
import type { Locale } from "@/i18n/config";
import { translatePath } from "@/i18n/routes";
import type { PageKind } from "@/lib/section-nav";
import { languageRedirectScript } from "@/lib/language-pref";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SectionRouter } from "./SectionRouter";
import { SiteProvider } from "./site/SiteProvider";
import { SkipLink } from "./SkipLink";

interface Props {
  children: React.ReactNode;
  locale: Locale;
  page: PageKind;
  /** This page's own path, e.g. "/es/experiencia". */
  path: string;
  /** Section to scroll to on load (for clean URLs such as /experience). */
  initialSection?: string;
}

/** Language context, skip link, sticky header, section routing, footer and the ≥1920px glows. */
export function PageShell({ children, locale, page, path, initialSection }: Props) {
  const other: Locale = locale === "en" ? "es" : "en";
  return (
    <SiteProvider value={getSiteClient(locale)}>
      {/* Visitors who picked the other language before are sent to this page in that language. */}
      <script dangerouslySetInnerHTML={{ __html: languageRedirectScript(locale, translatePath(path, other)) }} />
      <div id="top" data-page={page} data-locale={locale} className="relative isolate overflow-x-clip">
        <SkipLink />
        <SectionRouter page={page} initial={initialSection} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden 3xl:block">
          <div className="absolute -left-[12vw] -top-[300px] aspect-square w-[45vw] rounded-full bg-[radial-gradient(closest-side,#3ddcb422,#3ddcb400)]" />
          <div className="absolute -right-[12vw] top-[2600px] aspect-square w-[40vw] rounded-full bg-[radial-gradient(closest-side,#3ddcb418,#3ddcb400)]" />
        </div>
        <Header page={page} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </div>
      <Footer locale={locale} page={page} />
    </SiteProvider>
  );
}
