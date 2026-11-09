"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Certification } from "@/content/types";
import { issuerStyle, t } from "@/content/format";
import { cn } from "@/lib/cn";
import { CertPaper } from "./CertPaper";
import { useSite } from "./site/SiteProvider";
import { cardLift } from "./ui";

interface Props {
  cert: Certification;
  onEnlarge?: () => void;
  className?: string;
  headingLevel?: "h3" | "h4";
}

/** Pencil "CertCard": image (or placeholder paper) that opens the lightbox, issuer, name, date and credential link. */
export function CertCard({ cert, onEnlarge, className, headingLevel: Heading = "h3" }: Props) {
  const { ui, issuers } = useSite();
  const issuer = issuerStyle(issuers, cert.issuer);
  const hasFooter = !!(cert.date || cert.credentialUrl);
  return (
    <article className={cn("flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-inset ring-line", cardLift, className)}>
      <button
        type="button"
        onClick={onEnlarge}
        className="relative flex h-[168px] shrink-0 cursor-zoom-in items-center justify-center overflow-hidden bg-surface-2 focus-visible:outline-offset-[-3px]"
      >
        {cert.image ? (
          <Image src={cert.image} alt="" fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw" className="object-cover" />
        ) : (
          <CertPaper cert={cert} />
        )}
        <span className="sr-only">{t(ui.certs.enlarge, { name: cert.name })}</span>
      </button>
      <div className={cn("flex flex-1 flex-col gap-2 px-4 pt-4", hasFooter ? "pb-2" : "pb-4")}>
        <p className="flex items-center gap-2 text-sm font-medium text-fg-2">
          <span
            aria-hidden="true"
            className="flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: issuer.color }}
          >
            {issuer.initial}
          </span>
          {cert.issuer}
        </p>
        <Heading className="font-heading text-[17px] leading-[22px] font-semibold text-fg">{cert.name}</Heading>
        {hasFooter && (
          <div className="mt-auto flex min-h-11 items-center justify-between gap-2">
            {cert.date ? <p className="font-mono text-[13px] text-fg-3">{cert.date.slice(0, 4)}</p> : <span />}
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center gap-1 text-sm font-semibold text-accent-strong hover:underline"
              >
                {ui.viewCredential}
                <ArrowUpRight size={15} aria-hidden="true" />
                <span className="sr-only">: {cert.name}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
