import { ArrowUp } from "lucide-react";
import { getContent, t } from "@/content";
import type { Locale } from "@/i18n/config";
import { BackToTop } from "./BackToTop";
import { CopyEmail } from "./CopyEmail";
import { DownloadCv } from "./DownloadCv";
import { SocialLinks } from "./SocialLinks";

/**
 * Pencil "Contact": dark panel with the call to action, email, CV, socials and the footer bar.
 * `page` marks the home page's footer, which the 3D view hides (contact is a card there).
 * `embedded`: the same panel inside the 3D view's dialog (no landmark, no section id, no "back to top").
 */
export function Footer({ locale, page, embedded = false }: { locale: Locale; page?: string; embedded?: boolean }) {
  const c = getContent(locale);
  const { person, ui } = c;
  const s = c.sections.contact;
  const Panel = embedded ? "section" : "footer";
  const titleId = embedded ? `${s.id}-title-3d` : `${s.id}-title`;
  return (
    <Panel
      id={embedded ? undefined : s.id}
      data-site-footer={embedded ? undefined : (page ?? "")}
      aria-labelledby={titleId}
      className="on-panel bg-panel pb-[max(24px,env(safe-area-inset-bottom))] pt-[var(--space-section)] text-on-panel md:pb-8"
    >
      <div className="wrap flex flex-col gap-12 md:gap-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex min-w-0 flex-col gap-5">
            <p className="font-mono text-[13px] uppercase text-accent">
              {s.index} — {s.eyebrow}
            </p>
            <h2
              id={titleId}
              className="max-w-[760px] font-heading text-contact leading-[1.02] font-semibold tracking-[-0.033em] text-on-panel"
            >
              {s.title}
            </h2>
            <p className="max-w-[560px] text-lede leading-[1.55] text-on-panel-muted">{s.description}</p>
            <div className="flex min-w-0 items-center gap-3">
              <a
                href={`mailto:${person.email}`}
                className="flex min-h-11 min-w-0 items-center break-all font-heading text-xl font-semibold tracking-[-0.5px] text-accent hover:underline md:text-[28px]"
              >
                {person.email}
              </a>
              <CopyEmail email={person.email} />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <DownloadCv pdf={c.pdf} ui={ui} className="w-full lg:w-auto" />
            <SocialLinks links={c.socialLinks} onPanel />
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-panel-line pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-base text-on-panel-muted md:text-sm">
            {t(ui.footer, { year: new Date().getFullYear(), name: person.name })}
          </p>
          {!embedded && (
          <BackToTop className="flex h-11 w-fit items-center gap-1.5 text-base font-medium text-on-panel hover:text-accent md:text-sm">
            {ui.backToTop}
            <ArrowUp size={16} aria-hidden="true" />
          </BackToTop>
          )}
        </div>
      </div>
    </Panel>
  );
}
