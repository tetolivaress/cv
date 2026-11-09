"use client";

import { createContext, useContext } from "react";
import type { SiteClient } from "@/content";

const SiteContext = createContext<SiteClient | null>(null);

/**
 * Hands the current language's labels and a few person/site facts to client
 * components, so they don't import the content modules (which would bundle
 * both languages into the browser JavaScript).
 */
export function SiteProvider({ value, children }: { value: SiteClient; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteClient {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite() must be used inside <SiteProvider>");
  return site;
}
