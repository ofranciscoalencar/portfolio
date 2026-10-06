import { Composition } from "remotion";
import {
  Ad15sVertical,
  FPS,
  DURATION_IN_FRAMES,
  WIDTH,
  HEIGHT,
  FEED_HEIGHT,
} from "./Ad";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Ad15sVertical"
        component={Ad15sVertical}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* 4:5 — LinkedIn and Instagram feed. Same component; overlays read
          useVideoConfig() so nothing else changes. */}
      <Composition
        id="Ad15sFeed"
        component={Ad15sVertical}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={FEED_HEIGHT}
      />
    </>
  );
};
