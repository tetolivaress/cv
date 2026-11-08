import { ImageResponse } from "next/og";
import { person, projects, yearsOfExperience } from "@/content";
import { displayUrl, getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const size = { width: 1200, height: 630 };


/** Social preview card, rendered once at build time. */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0d1412",
          color: "#f2f6f4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#3ddcb4",
              color: "#03140f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {person.initials}
          </div>
          <div style={{ fontSize: 28, color: "#a5b3ae" }}>{displayUrl(getSiteUrl())}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{person.name}</div>
          <div style={{ fontSize: 40, color: "#3ddcb4" }}>{person.title}</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 26, color: "#a5b3ae" }}>
          <span>{yearsOfExperience}+ years</span>
          <span>·</span>
          <span>{projects.length} live products</span>
          <span>·</span>
          <span>{person.location}</span>
        </div>
      </div>
    ),
    size,
  );
}
