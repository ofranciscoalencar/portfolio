import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";

// ─── Composition constants ──────────────────────────────────────────────
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// 15 seconds × 30fps = 450 frames
export const DURATION_IN_FRAMES = 15 * FPS;

// Site design tokens (matches _build/01-identity/tokens.json)
const ACCENT = "#FF2D1A";
const FG = "#F5F5F1";
const BG = "#0A0A0A";

// Load Unbounded via the Remotion Google Fonts helper — it resolves
// the current Google CDN URL at load time (the static URLs rotate so
// we can't hardcode them).
const { fontFamily: UNBOUNDED } = loadUnbounded("normal", {
  weights: ["400", "700"],
});

// ─── Scene timetable (locked to beat) ───────────────────────────────────
// Each entry: start frame, clip filename, word (null = no overlay)
// 0–60: 2s intro (no word, establishing aerial)
// 60–390: 11 words × 30 frames each
// 390–450: 2s outro card
type Scene = {
  start: number;
  duration: number;
  clip?: string;
  word?: string;
  /** Word gets a vermillion period (only on the final BRAZIL) */
  trailingDot?: boolean;
  /** Subtle "flash" at scene entry — used on CHAMPS + BRAZIL beats */
  beatFlash?: boolean;
};

const SCENES: Scene[] = [
  { start: 0, duration: 60, clip: "scene-00.mp4" }, // intro Rio aerial (2s)
  { start: 60, duration: 30, clip: "scene-01.mp4", word: "HELLO" },
  { start: 90, duration: 30, clip: "scene-02.mp4", word: "I" },
  { start: 120, duration: 30, clip: "scene-03.mp4", word: "AM" },
  { start: 150, duration: 30, clip: "scene-04.mp4", word: "FRANCISCO" },
  { start: 180, duration: 30, clip: "scene-05.mp4", word: "CHAMPS", beatFlash: true },
  { start: 210, duration: 30, clip: "scene-06.mp4", word: "CREATIVE" },
  { start: 240, duration: 30, clip: "scene-07.mp4", word: "STRATEGIST" },
  { start: 270, duration: 30, clip: "scene-08.mp4", word: "SCREENWRITER" },
  { start: 300, duration: 30, clip: "scene-09.mp4", word: "AI MAKER" },
  { start: 330, duration: 30, clip: "scene-10.mp4", word: "FROM" },
  {
    start: 360,
    duration: 30,
    clip: "scene-11.mp4",
    word: "BRAZIL",
    trailingDot: true,
    beatFlash: true,
  },
  // Outro: CHAMPS. wordmark + URL over black (no clip)
  { start: 390, duration: 60 },
];

// ─── Sub-components ─────────────────────────────────────────────────────

/**
 * Single scene = OffthreadVideo with a slow Ken Burns push-in plus an
 * entry/exit fade. The push (scale 1.0 → 1.06) carries motion energy
 * even when the source clip itself has little movement.
 */
const SceneClip: React.FC<{
  clip: string;
  durationInFrames: number;
  pushDirection: "in" | "left" | "right";
}> = ({ clip, durationInFrames, pushDirection }) => {
  const frame = useCurrentFrame();

  // Scale push-in (Ken Burns)
  const scale = interpolate(
    frame,
    [0, durationInFrames],
    [1.0, 1.08],
    { extrapolateRight: "clamp" }
  );

  // Subtle horizontal drift to add poetry between cuts
  const driftX =
    pushDirection === "left"
      ? interpolate(frame, [0, durationInFrames], [0, -2], { extrapolateRight: "clamp" })
      : pushDirection === "right"
      ? interpolate(frame, [0, durationInFrames], [0, 2], { extrapolateRight: "clamp" })
      : 0;

  // Hard cuts — punchier and beat-driven. Ken Burns push within each
  // scene + the audio beat carry the motion; crossfades softened the
  // edit too much for a 15s ad.
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <OffthreadVideo
        src={staticFile(`clips/${clip}`)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${driftX}%)`,
        }}
      />
      {/* Bottom darkening gradient for word legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.05) 0%, rgba(10,10,10,0.0) 35%, rgba(10,10,10,0.45) 70%, rgba(10,10,10,0.85) 100%)",
        }}
      />
      {/* Subtle vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.4) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Word overlay. Enters fade+scale-up over 4 frames, holds, exits with
 * fade+upward drift over the last 6 frames of its window. Positioned
 * bottom-center, Unbounded Bold all-caps.
 */
const WordOverlay: React.FC<{
  word: string;
  durationInFrames: number;
  trailingDot?: boolean;
}> = ({ word, durationInFrames, trailingDot }) => {
  const frame = useCurrentFrame();

  const enterScale = interpolate(frame, [0, 6], [0.92, 1], {
    extrapolateRight: "clamp",
  });
  const enterOpacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const exitTranslate = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [0, -18],
    { extrapolateLeft: "clamp" }
  );

  // Auto-size: long words shrink so they fit in the 1080-wide frame
  const fontSize = word.length <= 5 ? 200 : word.length <= 9 ? 160 : 130;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 280, // safe area above the bottom edge
      }}
    >
      <div
        style={{
          fontFamily: `${UNBOUNDED}, sans-serif`,
          fontWeight: 700,
          fontSize,
          letterSpacing: -4,
          lineHeight: 0.95,
          color: FG,
          textTransform: "uppercase",
          textShadow:
            "0 4px 24px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.6)",
          opacity: Math.min(enterOpacity, exitOpacity),
          transform: `scale(${enterScale}) translateY(${exitTranslate}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {word}
        {trailingDot && (
          <span style={{ color: ACCENT, marginLeft: 4 }}>.</span>
        )}
      </div>
    </AbsoluteFill>
  );
};

/**
 * 2-frame white flash that lands on the same frame the bass-drop hits
 * — used on CHAMPS (frame 180) and BRAZIL (frame 360). Reads as a
 * camera-flash punctuation that aligns image and audio.
 */
const BeatFlash: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 1, 4], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity, mixBlendMode: "screen" }} />;
};

/**
 * Outro card — CHAMPS. wordmark + URL, fading in over 12 frames.
 */
const OutroCard: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14, durationInFrames - 8, durationInFrames], [0, 1, 1, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 18], [0.94, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        opacity,
        // Subtle warm radial echo of the OG card
        backgroundImage:
          "radial-gradient(ellipse at 50% 40%, rgba(255,45,26,0.10) 0%, transparent 60%)",
      }}
    >
      <div
        style={{
          fontFamily: `${UNBOUNDED}, sans-serif`,
          fontWeight: 700,
          // 170px with light tracking fits CHAMPS + period inside the
          // 1080-wide frame with breathing room. Remotion's text
          // metrics run wider than browser dev-tools would suggest.
          fontSize: 170,
          letterSpacing: -4,
          color: FG,
          lineHeight: 0.95,
          transform: `scale(${scale})`,
          textShadow: "0 4px 32px rgba(0,0,0,0.4)",
          padding: "0 40px",
        }}
      >
        CHAMPS<span style={{ color: ACCENT }}>.</span>
      </div>
      <div
        style={{
          marginTop: 36,
          fontFamily: `${UNBOUNDED}, sans-serif`,
          fontWeight: 400,
          fontSize: 36,
          letterSpacing: 6,
          color: "rgba(245,245,241,0.85)",
          textTransform: "uppercase",
        }}
      >
        franciscoalencar.com
      </div>
      <div
        style={{
          marginTop: 12,
          width: 100,
          height: 3,
          background: ACCENT,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Main composition ───────────────────────────────────────────────────

export const Ad15sVertical: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Background beat — single audio track for the full duration */}
      <Audio src={staticFile("beat.m4a")} volume={1} />

      {SCENES.map((scene, i) => {
        // Alternate the Ken Burns drift direction per scene for organic motion
        const pushDir =
          i === 0 || i === SCENES.length - 1
            ? "in"
            : i % 2 === 0
            ? "left"
            : "right";

        return (
          <Sequence
            key={i}
            from={scene.start}
            durationInFrames={scene.duration}
            name={scene.word ?? (scene.clip ? "intro" : "outro")}
          >
            {scene.clip ? (
              <>
                <SceneClip
                  clip={scene.clip}
                  durationInFrames={scene.duration}
                  pushDirection={pushDir}
                />
                {scene.beatFlash && <BeatFlash durationInFrames={scene.duration} />}
                {scene.word && (
                  <WordOverlay
                    word={scene.word}
                    durationInFrames={scene.duration}
                    trailingDot={scene.trailingDot}
                  />
                )}
              </>
            ) : (
              <OutroCard durationInFrames={scene.duration} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
