"use client";

import type { Certification } from "@/content/types";
import { issuerStyle } from "@/content/format";
import { cn } from "@/lib/cn";
import { useSite } from "./site/SiteProvider";

/**
 * Stylized certificate used when a certification has no image yet (Pencil
 * "CertCard / Paper" and the lightbox "CertificateImage"). It is always light,
 * like a printed page, in both themes. The large variant scales with its
 * container through container-query units.
 */
export function CertPaper({ cert, size = "sm", className }: { cert: Certification; size?: "sm" | "lg"; className?: string }) {
  const { issuers, ui, person } = useSite();
  const { color } = issuerStyle(issuers, cert.issuer);
  if (size === "sm") {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex h-[120px] w-[172px] flex-col gap-[7px] rounded bg-white px-3.5 py-3 shadow-[0_4px_12px_#0d141218] ring-1 ring-[#d9ded9]",
          className,
        )}
      >
        <span className="h-1 w-7 rounded-sm" style={{ backgroundColor: color }} />
        <span className="font-mono text-[7px] uppercase tracking-[1px] text-[#5f6d68]">{ui.certs.certificate}</span>
        <span className="line-clamp-2 font-heading text-[10px] leading-3 font-semibold text-[#0d1412]">{cert.name}</span>
        <span className="h-[3px] w-[110px] rounded-sm bg-[#dfe5e2]" />
        <span className="mt-auto flex items-end justify-between">
          <span className="h-0.5 w-[52px] bg-[#c5cfca]" />
          <span className="size-[18px] rounded-full border-[1.5px]" style={{ borderColor: color, backgroundColor: `${color}22` }} />
        </span>
      </div>
    );
  }
  const meta = [person.name, cert.issuer, cert.date].filter(Boolean).join(" · ");
  return (
    <div className={cn("@container w-full", className)}>
      <div
        role="img"
        aria-label={`${cert.name}, ${cert.issuer}`}
        className="flex aspect-[760/547] w-full flex-col gap-[3cqw] rounded-lg bg-white px-[9.3cqw] py-[8cqw] shadow-[0_24px_64px_#00000055] ring-1 ring-[#d9ded9]"
      >
        <span className="h-[1.05cqw] w-[10.6cqw] rounded-[3px]" style={{ backgroundColor: color }} />
        <span className="font-mono text-[max(9px,1.97cqw)] uppercase tracking-[0.26cqw] text-[#5f6d68]">
          {ui.certs.certificateOfCompletion}
        </span>
        <span className="font-heading text-[5.66cqw] leading-[1.14] font-semibold text-balance text-[#0d1412]">{cert.name}</span>
        <span className="text-[max(11px,2.5cqw)] text-[#4a5853]">{meta}</span>
        <span className="mt-auto flex items-end justify-between">
          <span className="flex flex-col gap-[0.8cqw]">
            <span className="h-[1.5px] w-[26.7cqw] bg-[#c5cfca]" />
            <span className="font-mono text-[max(9px,1.84cqw)] text-[#5f6d68]">{cert.issuer}</span>
          </span>
          <span className="size-[12cqw] rounded-full border-2" style={{ borderColor: color, backgroundColor: `${color}22` }} />
        </span>
      </div>
    </div>
  );
}
