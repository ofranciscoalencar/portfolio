import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Custom 1200×630 OpenGraph card for social previews (LinkedIn, X,
 * Slack, WhatsApp, link unfurls).
 *
 * Composition:
 * - Background: a frame from "Beyond the Map" — Rio aerial with Cristo
 *   Redentor silhouetted left and Sugarloaf right. Instantly
 *   geo-positions the work as Brazilian and reads cinematic at
 *   thumbnail size where pure typography flattens out.
 * - A dark gradient mask (left → transparent) keeps the typography
 *   readable while preserving the image's right side.
 * - Typography: Unbounded fetched from Google Fonts at build time and
 *   baked into the static PNG.
 * - Same design tokens as the site: bg #0A0A0A · fg #F5F5F1 · accent #FF2D1A
 */

export const alt =
  "Francisco Alencar — Creative Director, Screenwriter, Strategist. 20+ films, 100M+ views for Google, YouTube, Netflix, CazéTV, Nubank, TikTok, Motorola, Mercado Livre, Waze.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(weight: 400 | 700): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Unbounded:wght@${weight}&display=swap`;
  const css = await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    },
  }).then((r) => r.text());
  const match = css.match(/src:\s*url\((.+?)\)\s*format/);
  if (!match) throw new Error("Could not locate Unbounded font URL");
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

/**
 * Read the JPEG backdrop from the public folder and inline it as a
 * data URL so the OG generator never needs to make a network round
 * trip — important because the OG image is built before the deployment
 * URL exists.
 */
async function loadBackgroundDataUrl(): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "og-bg.jpg");
  const buf = await fs.readFile(filePath);
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

export default async function Image() {
  const [unboundedRegular, unboundedBold, bgDataUrl] = await Promise.all([
    loadFont(400),
    loadFont(700),
    loadBackgroundDataUrl(),
  ]);

  const accent = "#FF2D1A";
  const fg = "#F5F5F1";
  const muted = "rgba(245,245,241,0.65)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0A0A0A",
          fontFamily: "Unbounded",
          position: "relative",
        }}
      >
        {/* Backdrop image — full-bleed, slight saturation/contrast
            handled at extract time. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgDataUrl}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Left-anchored darkening gradient — keeps text legible on the
            left, lets the image breathe on the right. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.78) 35%, rgba(10,10,10,0.35) 65%, rgba(10,10,10,0.05) 100%)",
            display: "flex",
          }}
        />

        {/* Subtle top + bottom darkening for the rails */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, transparent 18%, transparent 75%, rgba(10,10,10,0.7) 100%)",
            display: "flex",
          }}
        />

        {/* Content frame */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 72px",
            color: fg,
          }}
        >
          {/* Top rail — domain + location */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 16,
              letterSpacing: 3.5,
              color: muted,
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            <span>franciscoalencar.com</span>
            <span>São Paulo · Working Globally</span>
          </div>

          {/* Center: tagline + wordmark + role triplet */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              flex: 1,
              paddingTop: 8,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: "rgba(245,245,241,0.85)",
                letterSpacing: 0.5,
                marginBottom: 14,
              }}
            >
              Connecting Brands with Entertainment.
            </div>

            <div
              style={{
                fontSize: 200,
                fontWeight: 700,
                letterSpacing: -7,
                lineHeight: 0.88,
                color: fg,
                display: "flex",
                alignItems: "center",
                textShadow: "0 2px 24px rgba(0,0,0,0.45)",
              }}
            >
              <span>CHAMPS</span>
              <span style={{ color: accent, marginLeft: 4 }}>.</span>
            </div>

            <div
              style={{
                marginTop: 18,
                fontSize: 28,
                fontWeight: 400,
                color: "rgba(245,245,241,0.95)",
                letterSpacing: -0.2,
              }}
            >
              Creative Director, Screenwriter, Strategist.
            </div>
          </div>

          {/* Bottom rail */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                height: 3,
                width: 120,
                background: accent,
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 16,
                letterSpacing: 3,
                color: fg,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              <span>20+ Films</span>
              <span style={{ color: muted }}>·</span>
              <span>100M+ Views</span>
              <span style={{ color: muted }}>·</span>
              <span style={{ color: accent }}>AI-Native Practice</span>
            </div>

            <div
              style={{
                fontSize: 14,
                letterSpacing: 3.5,
                color: muted,
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              Google · YouTube · TikTok · Netflix · Nubank · CazéTV · Waze · Motorola · Mercado Livre
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Unbounded",
          data: unboundedRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Unbounded",
          data: unboundedBold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
