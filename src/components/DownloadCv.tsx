import { Download, FileDown } from "lucide-react";
import { pdfPath, site, ui } from "@/content";
import { cn } from "@/lib/cn";
import { button } from "./ui";

type Variant = "primary" | "compact" | "outline";

/**
 * Plain link with the download attribute: the PDF is generated at build time,
 * so the download is instant and works on iOS Safari.
 */
export function DownloadCv({ variant = "primary", className }: { variant?: Variant; className?: string }) {
  const styles: Record<Variant, string> = {
    primary: button.primary,
    compact: cn(button.primary, "h-11 px-3.5 text-sm"),
    outline: button.secondary,
  };
  const label = variant === "compact" ? ui.downloadCvShort : variant === "outline" ? ui.fullCv : ui.downloadCv;
  const Icon = variant === "outline" ? FileDown : Download;
  return (
    <a
      href={pdfPath}
      download={site.pdf.fileName}
      type="application/pdf"
      className={cn(styles[variant], className)}
      aria-label={variant === "compact" ? ui.downloadCv : undefined}
    >
      <Icon size={variant === "compact" ? 16 : 18} aria-hidden="true" />
      {label}
    </a>
  );
}
