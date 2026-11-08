import { ui } from "@/content";

/**
 * The "→" between years. Google's font subsets do not include U+2192, so the
 * glyph is drawn to match the design instead of falling back to a system font.
 */
export function ArrowGlyph() {
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-[0.35em] inline-block h-[0.62em] w-[0.8em] align-[0.02em]"
      >
        <path d="M0.75 4h10.25M7.75 0.9 10.9 4 7.75 7.1" />
      </svg>
      <span className="sr-only"> {ui.to} </span>
    </>
  );
}
