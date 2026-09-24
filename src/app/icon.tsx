import { ImageResponse } from "next/og";
import { loadUnbounded } from "@/lib/og-font";

/**
 * Browser tab favicon — 32×32 PNG generated via Next's ImageResponse so
 * it stays in lockstep with the brand tokens.
 *
 * Design rationale: at 16–32px the full "CHAMPS" wordmark is unreadable,
 * so the favicon is reduced to the minimum recognizable mark — a single
 * white "C" with the vermillion period accent that signs every brand
 * surface (home wordmark, OG card, CTA hover state). Background is the
 * site's #0A0A0A so the icon reads as a window on the same page.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
          fontSize: 26,
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        <span>C</span>
        <span style={{ color: "#FF2D1A", marginLeft: -1 }}>.</span>
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
