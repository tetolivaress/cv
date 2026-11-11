import { localeMeta, type Locale } from "@/i18n/config";
import { fontVariables } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme";
import { viewInitScript } from "@/lib/view-mode";

/** <html>/<body> shared by the English and Spanish root layouts. */
export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={localeMeta[locale].htmlLang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript + viewInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
