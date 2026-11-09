import { Inter, JetBrains_Mono } from "next/font/google";

// Headings use Inter too: "Inter Tight" is Inter with tighter sidebearings, which
// globals.css reproduces with letter-spacing. One font file instead of two keeps
// the mobile LCP fast.
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Mono is only used for small labels; skipping its preload frees bandwidth for the LCP image on mobile.
export const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", preload: false });

export const fontVariables = `${inter.variable} ${jetbrains.variable}`;
