import type { PageKind } from "@/lib/section-nav";
import { Header } from "./Header";
import { SectionRouter } from "./SectionRouter";
import { SkipLink } from "./SkipLink";

interface Props {
  children: React.ReactNode;
  page: PageKind;
  /** Section to scroll to on load (for clean URLs such as /experience). */
  initialSection?: string;
}

/** Skip link, sticky header, section routing and the decorative glows shown on ≥1920px screens. */
export function PageShell({ children, page, initialSection }: Props) {
  return (
    <div id="top" data-page={page} className="relative isolate overflow-x-clip">
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
  );
}
