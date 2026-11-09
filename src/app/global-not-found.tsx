import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 · Page not found / Página no encontrada",
  robots: { index: false },
};

/** 404 for unknown URLs (the site has two root layouts, one per language). */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <main className="wrap flex min-h-dvh flex-col items-start justify-center gap-5 py-24">
          <p className="font-mono text-[13px] text-accent-strong">404</p>
          <h1 className="font-heading text-h2 font-semibold tracking-[-0.025em] text-fg">Page not found</h1>
          <p className="text-lede text-fg-2">The page you are looking for does not exist or was moved.</p>
          <p lang="es" className="text-lede text-fg-2">
            La página que buscas no existe o fue movida.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="inline-flex h-12 items-center rounded-xl bg-surface px-5 text-[15px] font-semibold text-fg ring-1 ring-inset ring-line-strong hover:bg-surface-2"
            >
              ← Home
            </a>
            <a
              href="/es"
              lang="es"
              className="inline-flex h-12 items-center rounded-xl bg-surface px-5 text-[15px] font-semibold text-fg ring-1 ring-inset ring-line-strong hover:bg-surface-2"
            >
              ← Inicio
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
