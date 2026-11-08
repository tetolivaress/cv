import { ui } from "@/content";
import { Header } from "./Header";

/** Skip link, sticky header and the decorative glows shown on ≥1920px screens. */
export function PageShell({ children, onHome = true }: { children: React.ReactNode; onHome?: boolean }) {
  return (
    <div id="top" className="relative isolate overflow-x-clip">
      <a
        href="#main"
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-xl bg-inverse px-4 py-3 text-sm font-semibold text-on-inverse transition-transform focus:translate-y-0"
      >
        {ui.skipToContent}
      </a>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden 3xl:block">
        <div className="absolute -left-[12vw] -top-[300px] aspect-square w-[45vw] rounded-full bg-[radial-gradient(closest-side,#3ddcb422,#3ddcb400)]" />
        <div className="absolute -right-[12vw] top-[2600px] aspect-square w-[40vw] rounded-full bg-[radial-gradient(closest-side,#3ddcb418,#3ddcb400)]" />
      </div>
      <Header onHome={onHome} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
    </div>
  );
}
