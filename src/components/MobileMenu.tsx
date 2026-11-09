"use client";

import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import { useRef, useState } from "react";
import { useSite } from "./site/SiteProvider";
import { button } from "./ui";

const loadSheet = () => import("./MobileMenuSheet");
const MobileMenuSheet = dynamic(loadSheet, { ssr: false });

interface Props {
  active: string | null;
}

/** Hamburger button. The sheet (and Radix) is fetched on hover/touch/focus, before the click lands. */
export function MobileMenu({ active }: Props) {
  const { ui } = useSite();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const warm = () => void loadSheet();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={button.icon}
        aria-label={ui.menuOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={warm}
        onTouchStart={warm}
        onFocus={warm}
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
      >
        <Menu size={22} aria-hidden="true" />
      </button>
      {mounted && (
        <MobileMenuSheet
          open={open}
          onOpenChange={setOpen}
          returnFocus={() => buttonRef.current?.focus()}
          active={active}
        />
      )}
    </>
  );
}
