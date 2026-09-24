import { Composition } from "remotion";
import { Ad15sVertical, FPS, DURATION_IN_FRAMES, WIDTH, HEIGHT } from "./Ad";

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
    </>
  );
};
