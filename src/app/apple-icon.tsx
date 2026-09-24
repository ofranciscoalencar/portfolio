import { ImageResponse } from "next/og";

/**
 * iOS home-screen icon — 180×180 PNG. Apple's spec is 180×180 and they
 * apply rounded corners themselves, so we render edge-to-edge with the
 * brand background. Same composition as the 32px favicon, scaled up so
 * the vermillion period stays a clearly visible accent rather than a
 * sub-pixel dot.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

async function loadUnboundedBold(): Promise<ArrayBuffer> {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Unbounded:wght@700&display=swap",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      },
    }
  ).then((r) => r.text());
  const match = css.match(/src:\s*url\((.+?)\)\s*format/);
  if (!match) throw new Error("Could not locate Unbounded Bold font URL");
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export default async function AppleIcon() {
  const fontData = await loadUnboundedBold();

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
