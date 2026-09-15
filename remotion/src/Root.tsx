import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { Launch16x9 } from "./Launch16x9";
import { HighlightVideo } from "./HighlightVideo";
import { HighlightVideoV9 } from "./HighlightVideoV9";
import { HighlightVideoV10 } from "./HighlightVideoV10";

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
    <Composition
      id="highlightVertical"
      component={HighlightVideo}
      defaultProps={{ vertical: true }}
      durationInFrames={960}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="highlightWidescreen"
      component={HighlightVideo}
      defaultProps={{ vertical: false }}
      durationInFrames={960}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="highlightV9Vertical"
      component={HighlightVideoV9}
      defaultProps={{ vertical: true }}
      durationInFrames={960}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="highlightV9Widescreen"
      component={HighlightVideoV9}
      defaultProps={{ vertical: false }}
      durationInFrames={960}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="highlightV10Vertical"
      component={HighlightVideoV10}
      defaultProps={{ vertical: true }}
      durationInFrames={960}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="highlightV10Widescreen"
      component={HighlightVideoV10}
      defaultProps={{ vertical: false }}
      durationInFrames={960}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
