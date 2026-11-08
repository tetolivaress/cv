"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import type { ReactNode } from "react";
import { button } from "./ui";

export interface LightboxItem {
  key: string;
  title: string;
  meta?: string;
  /** Optional call to action, e.g. "View credential". */
  action?: { href: string; label: string };
  content: ReactNode;
}

interface Props {
  items: LightboxItem[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
  labels: { dialog: string; close: string; previous: string; next: string };
}

const round =
  "flex size-11 shrink-0 items-center justify-center rounded-full bg-white/12 text-white transition-colors duration-150 hover:bg-white/20";

/**
 * Pencil "Lightbox": dark full-screen viewer with counter, prev/next (buttons
 * and arrow keys) and a caption. Radix handles the focus trap, Esc and scroll lock.
 */
export function Lightbox({ items, index, onIndexChange, labels }: Props) {
  const open = index !== null && items.length > 0;
  const i = index ?? 0;
  const item = items[Math.min(i, items.length - 1)];
  const go = (delta: number) => onIndexChange((i + delta + items.length) % items.length);
  const many = items.length > 1;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onIndexChange(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[#050908e0] backdrop-blur-[6px] animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={(event) => {
            if (!many) return;
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
          }}
          className="on-dark fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))] animate-fade-in md:p-12"
        >
          <Dialog.Title className="sr-only">{labels.dialog}</Dialog.Title>
          {item && (
            <>
              <div className="flex w-full items-center justify-between">
                <p className="font-mono text-[13px] text-white" aria-live="polite">
                  {i + 1} / {items.length}
                </p>
                <Dialog.Close className={round} aria-label={labels.close}>
                  <X size={22} aria-hidden="true" />
                </Dialog.Close>
              </div>

              <div className="flex min-h-0 w-full flex-1 flex-wrap items-center justify-center gap-4 md:flex-nowrap md:justify-between md:gap-6">
                {many && (
                  <button type="button" onClick={() => go(-1)} aria-label={labels.previous} className={`${round} order-2 md:order-1`}>
                    <ChevronLeft size={22} aria-hidden="true" />
                  </button>
                )}
                <div className="order-1 flex max-h-full w-full min-w-0 items-center justify-center md:order-2 md:w-auto md:flex-1">
                  <div key={item.key} className="w-full max-w-[760px] animate-fade-in">
                    {item.content}
                  </div>
                </div>
                {many && (
                  <button type="button" onClick={() => go(1)} aria-label={labels.next} className={`${round} order-3`}>
                    <ChevronRight size={22} aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="flex w-full flex-col items-center gap-4 text-center sm:w-auto sm:flex-row sm:gap-6 sm:text-left">
                <div className="flex flex-col gap-0.5">
                  <p className="text-xl text-white">{item.title}</p>
                  {item.meta && <p className="text-base text-[#c9d3cf]">{item.meta}</p>}
                </div>
                {item.action && (
                  <a href={item.action.href} target="_blank" rel="noopener noreferrer" className={button.primary}>
                    <ExternalLink size={18} aria-hidden="true" />
                    {item.action.label}
                  </a>
                )}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
