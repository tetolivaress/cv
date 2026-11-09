import { RootDocument } from "@/components/RootDocument";
import { layoutMetadata, viewport } from "@/lib/metadata";
import "../globals.css";

export const metadata = layoutMetadata("en");
export { viewport };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
