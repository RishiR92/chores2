import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { Launch16x9 } from "./Launch16x9";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={1290}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="launch16x9"
      component={Launch16x9}
      durationInFrames={1650}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
