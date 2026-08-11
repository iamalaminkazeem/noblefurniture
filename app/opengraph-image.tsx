import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Noble Furniture Gallery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#0B3D2E", color: "white" }}>
        <div style={{ fontSize: 72, fontWeight: 600 }}>Noble Furniture Gallery</div>
        <div style={{ fontSize: 28, color: "#C8A951", marginTop: 20, letterSpacing: 4, textTransform: "uppercase" }}>Premium Furniture · Lagos, Nigeria</div>
      </div>
    ),
    { ...size }
  );
}