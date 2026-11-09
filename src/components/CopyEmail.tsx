"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useSite } from "./site/SiteProvider";
import { button } from "./ui";

/** Copies the email address and announces it to screen readers. */
export function CopyEmail({ email }: { email: string }) {
  const { ui } = useSite();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <>
      <button
        type="button"
        className={button.iconOnPanel}
        aria-label={ui.copyEmail}
        title={ui.copyEmail}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
          } catch {
            window.location.href = `mailto:${email}`;
          }
        }}
      >
        {copied ? <Check size={18} aria-hidden="true" className="text-accent" /> : <Copy size={18} aria-hidden="true" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? ui.copied : ""}
      </span>
    </>
  );
}
