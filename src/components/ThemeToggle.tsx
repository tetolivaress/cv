"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { getTheme, setTheme, subscribeTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/cn";
import { useSite } from "./site/SiteProvider";


/** Pencil "ThemeToggle": a segmented sun/moon switch. Saved in localStorage. */
export function ThemeToggle({ className }: { className?: string }) {
  const { ui } = useSite();
  const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
    { value: "light", label: ui.themeLight, Icon: Sun },
    { value: "dark", label: ui.themeDark, Icon: Moon },
  ];
  // Server render has no theme; the inline head script already applied it to <html>.
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => null);
  return (
    <div role="group" aria-label={ui.theme} className={cn("flex h-11 items-center gap-0.5 rounded-full p-1 ring-1 ring-inset ring-line", className)}>
      {options.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={theme === null ? undefined : active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "flex size-9 items-center justify-center rounded-full transition-colors duration-200",
              active ? "bg-surface-2 text-fg" : "text-fg-3 hover:text-fg",
            )}
          >
            <Icon size={18} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
