import { ImageResponse } from "next/og";
import { loadUnbounded } from "@/lib/og-font";

/**
 * 1200×630 OpenGraph card for social previews (LinkedIn, X, Slack,
 * WhatsApp, link unfurls).
 *
 * Logo-led rather than photographic. The mark is a broken ring that reads
 * both as a "C" for Champs and as a camera aperture; the gap is closed by
 * the vermillion dot that already signs the wordmark, the favicon and the
 * social-cut outro, so the mark is derived from the existing system rather
 * than bolted on. Geometric, so it survives being scaled down to a feed
 * thumbnail — which is the size that actually matters.
 *
 * Tokens match src/app/globals.css: #0A0A0A / #F5F5F1 / #FF2D1A.
 */

export const alt =
  "Francisco Alencar — Creative Director, Screenwriter, Strategist. franciscoalencar.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#FF2D1A";
const FG = "#F5F5F1";
const BG = "#0A0A0A";

/** Broken-ring mark. Arc spans -52°→+52° the long way, leaving a gap right. */
function Mark({ size: s, stroke = 13 }: { size: number; stroke?: number }) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const R = 36;
  const c = 50;
  const a = 52;
  const x1 = (c + R * Math.cos(rad(-a))).toFixed(2);
  const y1 = (c + R * Math.sin(rad(-a))).toFixed(2);
  const x2 = (c + R * Math.cos(rad(a))).toFixed(2);
  const y2 = (c + R * Math.sin(rad(a))).toFixed(2);

  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: "block" }}>
      <path
        d={`M ${x1} ${y1} A ${R} ${R} 0 1 0 ${x2} ${y2}`}
        stroke={FG}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={c + R} cy={c} r={stroke / 2 + 1.5} fill={ACCENT} />
    </svg>
  );
}

export default async function Image() {
  const [regular, bold] = await Promise.all([
    loadUnbounded(400),
    loadUnbounded(700),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(ellipse at 50% 42%, rgba(255,45,26,0.10) 0%, transparent 62%), ${BG}`,
          fontFamily: "Unbounded",
        }}
      >
        <div style={{ display: "flex" }}>
          <Mark size={190} />
        </div>

        <div
          style={{
            marginTop: 44,
            fontSize: 70,
            fontWeight: 700,
            letterSpacing: -2.5,
            color: FG,
            display: "flex",
          }}
        >
          FRANCISCO ALENCAR
        </div>

        <div
          style={{
            marginTop: 16,
            fontSize: 25,
            fontWeight: 400,
            color: "rgba(245,245,241,0.86)",
            display: "flex",
          }}
        >
          Creative Director, Screenwriter, Strategist
        </div>

        <div
          style={{
            marginTop: 34,
            width: 96,
            height: 3,
            background: ACCENT,
            display: "flex",
          }}
        />

        <div
          style={{
            marginTop: 30,
            fontSize: 16,
            letterSpacing: 3.5,
            textTransform: "uppercase",
            color: "rgba(245,245,241,0.62)",
            display: "flex",
          }}
        >
          franciscoalencar.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Unbounded", data: regular, weight: 400, style: "normal" },
        { name: "Unbounded", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
