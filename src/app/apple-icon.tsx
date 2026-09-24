import { ImageResponse } from "next/og";
import { loadUnbounded } from "@/lib/og-font";

/**
 * iOS home-screen icon — 180×180 PNG. Apple's spec is 180×180 and they
 * apply rounded corners themselves, so we render edge-to-edge with the
 * brand background. Same composition as the 32px favicon, scaled up so
 * the vermillion period stays a clearly visible accent rather than a
 * sub-pixel dot.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fontData = await loadUnbounded(700);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          color: "#F5F5F1",
          fontFamily: "Unbounded",
          fontWeight: 700,
          fontSize: 140,
          letterSpacing: -5,
          lineHeight: 1,
        }}
      >
        <span>C</span>
        <span style={{ color: "#FF2D1A", marginLeft: -2 }}>.</span>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Unbounded", data: fontData, weight: 700, style: "normal" },
      ],
    }
  );
}
