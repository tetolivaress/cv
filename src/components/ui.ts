/**
 * Class recipes for the design-system components (Pencil: Button/*, ButtonSm/*,
 * IconButton, Tag, Badge, RemoteBadge, FilterChip, StatusPill). Hover: 150ms
 * ease-out color/border change, per "DS · Motion & states".
 */
const base =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold transition-colors duration-150 ease-out select-none";

export const button = {
  primary: `${base} h-12 gap-2 rounded-xl px-5 text-[15px] bg-accent text-on-accent hover:bg-accent-hover`,
  secondary: `${base} h-12 gap-2 rounded-xl px-5 text-[15px] bg-surface text-fg ring-1 ring-inset ring-line-strong hover:ring-fg-3 hover:bg-surface-2`,
  primarySm: `${base} h-11 gap-1.5 rounded-[10px] px-3.5 text-sm bg-inverse text-on-inverse hover:opacity-90`,
  secondarySm: `${base} h-11 gap-1.5 rounded-[10px] px-3.5 text-sm bg-surface text-fg ring-1 ring-inset ring-line-strong hover:ring-fg-3 hover:bg-surface-2`,
  ghost: `${base} h-11 gap-1 text-sm text-fg hover:text-accent-strong`,
  icon: "inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-fg ring-1 ring-inset ring-line transition-colors duration-150 ease-out hover:bg-surface-2 hover:ring-line-strong",
  iconOnPanel:
    "inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-on-panel ring-1 ring-inset ring-panel-line transition-colors duration-150 ease-out hover:bg-white/10",
};

export const iconSize = { md: 18, sm: 16, xs: 13, lg: 20 } as const;

export const tag = "inline-flex rounded-md bg-surface-2 px-2.5 py-[5px] font-mono text-[13px] leading-[1.2] text-fg-2";

export const badge =
  "inline-flex h-9 items-center gap-2 rounded-full bg-accent-soft px-3.5 text-sm font-medium text-fg [&_svg]:text-accent-strong";

export const remoteBadge =
  "inline-flex h-[26px] items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-fg-2 ring-1 ring-inset ring-line-strong";

export const eyebrow = "font-mono text-[13px] uppercase leading-none text-accent-strong";

export const cardLift =
  "transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_24px_#0d141214] motion-reduce:hover:translate-y-0";
