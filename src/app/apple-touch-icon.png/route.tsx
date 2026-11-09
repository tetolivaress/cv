import { ImageResponse } from "next/og";
import { getContent } from "@/content";

export const dynamic = "force-static";
const size = { width: 180, height: 180 };


export function GET() {
  const { person } = getContent("en");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1412",
          color: "#3ddcb4",
          fontSize: 84,
          fontWeight: 700,
        }}
      >
        {person.initials}
      </div>
    ),
    size,
  );
}
