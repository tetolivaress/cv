import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { button } from "@/components/ui";
import { ui } from "@/content";

export default function NotFound() {
  return (
    <PageShell onHome={false}>
      <section className="wrap flex min-h-[60dvh] flex-col items-start justify-center gap-5 py-24">
        <p className="font-mono text-[13px] text-accent-strong">404</p>
        <h1 className="font-heading text-h2 font-semibold tracking-[-0.025em] text-fg">{ui.notFound.title}</h1>
        <p className="text-lede text-fg-2">{ui.notFound.text}</p>
        <Link href="/" className={button.secondary}>
          <ArrowLeft size={18} aria-hidden="true" />
          {ui.notFound.cta}
        </Link>
      </section>
    </PageShell>
  );
}
