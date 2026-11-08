import { cn } from "@/lib/cn";
import { eyebrow } from "./ui";

interface Props {
  index?: string;
  label: string;
  title: string;
  description?: string;
  /** Id for the heading, so the section can use aria-labelledby. */
  id?: string;
  className?: string;
  as?: "h1" | "h2";
}

/** Pencil "SectionHead": eyebrow ("02 — EXPERIENCE"), title, optional description. */
export function SectionHead({ index, label, title, description, id, className, as: Heading = "h2" }: Props) {
  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      <p className={eyebrow}>{index ? `${index} — ${label}` : label}</p>
      <Heading
        id={id}
        className="font-heading text-h2 leading-[1.04] font-semibold tracking-[-0.025em] text-fg"
      >
        {title}
      </Heading>
      {description && <p className="measure text-lede leading-normal text-fg-2 text-pretty">{description}</p>}
    </div>
  );
}
