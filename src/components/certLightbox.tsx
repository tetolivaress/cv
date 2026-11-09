import Image from "next/image";
import type { UiCopy } from "@/content/copy";
import type { Certification } from "@/content/types";
import { CertPaper } from "./CertPaper";
import type { LightboxItem } from "./Lightbox";

/** Turns certifications into lightbox slides: the real image when there is one, the paper placeholder otherwise. */
export function certLightboxItems(certs: Certification[], ui: UiCopy): LightboxItem[] {
  return certs.map((cert) => ({
    key: cert.key,
    title: cert.name,
    meta: [cert.issuer, cert.date?.slice(0, 4)].filter(Boolean).join(" · "),
    action: cert.credentialUrl ? { href: cert.credentialUrl, label: ui.viewCredential } : undefined,
    content: cert.image ? (
      <Image
        src={cert.image}
        alt={`${cert.name}, ${cert.issuer}`}
        width={1600}
        height={1131}
        sizes="(min-width: 768px) 760px, 100vw"
        className="mx-auto h-auto max-h-[65dvh] w-auto rounded-lg object-contain shadow-[0_24px_64px_#00000055]"
      />
    ) : (
      <CertPaper cert={cert} size="lg" />
    ),
  }));
}

export const certLightboxLabels = (ui: UiCopy) => ({
  dialog: ui.certs.lightboxLabel,
  close: ui.certs.closeLightbox,
  previous: ui.certs.previous,
  next: ui.certs.next,
});
