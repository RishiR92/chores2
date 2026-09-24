import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { Launch16x9 } from "./Launch16x9";
import { HighlightVideo } from "./HighlightVideo";
import { HighlightVideoV9 } from "./HighlightVideoV9";
import { HighlightVideoV10 } from "./HighlightVideoV10";
import { HighlightVideoV11 } from "./HighlightVideoV11";
import { ChaseEngineFilm } from "./ChaseEngineFilm";
import { AiToAiFilm } from "./AiToAiFilm";
import { AiToAiFilmV2 } from "./AiToAiFilmV2";
import { AiToAiFilmV3 } from "./AiToAiFilmV3";
import { AiToAiFilmV4 } from "./AiToAiFilmV4";
import { AiToAiFilmV5 } from "./AiToAiFilmV5";
import { AiToAiFilmV6 } from "./AiToAiFilmV6";
import { AiToAiFilmV7 } from "./AiToAiFilmV7";
import { WineFranceFilm } from "./WineFranceFilm";

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
    <Composition
      id="highlightV11Vertical"
      component={HighlightVideoV11}
      defaultProps={{ vertical: true }}
      durationInFrames={960}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="highlightV11Widescreen"
      component={HighlightVideoV11}
      defaultProps={{ vertical: false }}
      durationInFrames={960}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="chaseEngineVertical"
      component={ChaseEngineFilm}
      defaultProps={{ vertical: true }}
      durationInFrames={990}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="chaseEngineWidescreen"
      component={ChaseEngineFilm}
      defaultProps={{ vertical: false }}
      durationInFrames={990}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="aiToAiWidescreen"
      component={AiToAiFilm}
      defaultProps={{ vertical: false }}
      durationInFrames={960}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="aiToAiVertical"
      component={AiToAiFilm}
      defaultProps={{ vertical: true }}
      durationInFrames={960}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="aiToAiV2Widescreen"
      component={AiToAiFilmV2}
      defaultProps={{ vertical: false }}
      durationInFrames={1170}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="aiToAiV2Vertical"
      component={AiToAiFilmV2}
      defaultProps={{ vertical: true }}
      durationInFrames={1170}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="aiToAiV3Widescreen"
      component={AiToAiFilmV3}
      defaultProps={{ vertical: false }}
      durationInFrames={1170}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="aiToAiV3Vertical"
      component={AiToAiFilmV3}
      defaultProps={{ vertical: true }}
      durationInFrames={1170}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="aiToAiV4Widescreen"
      component={AiToAiFilmV4}
      defaultProps={{ vertical: false }}
      durationInFrames={1170}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="aiToAiV4Vertical"
      component={AiToAiFilmV4}
      defaultProps={{ vertical: true }}
      durationInFrames={1170}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="aiToAiV5Widescreen"
      component={AiToAiFilmV5}
      defaultProps={{ vertical: false }}
      durationInFrames={1170}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="aiToAiV5Vertical"
      component={AiToAiFilmV5}
      defaultProps={{ vertical: true }}
      durationInFrames={1170}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="aiToAiV6Widescreen"
      component={AiToAiFilmV6}
      defaultProps={{ vertical: false }}
      durationInFrames={1170}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="aiToAiV6Vertical"
      component={AiToAiFilmV6}
      defaultProps={{ vertical: true }}
      durationInFrames={1170}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="aiToAiV7Widescreen"
      component={AiToAiFilmV7}
      defaultProps={{ vertical: false }}
      durationInFrames={1170}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="aiToAiV7Vertical"
      component={AiToAiFilmV7}
      defaultProps={{ vertical: true }}
      durationInFrames={1170}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="wineFranceWidescreen"
      component={WineFranceFilm}
      defaultProps={{ vertical: false }}
      durationInFrames={960}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="wineFranceVertical"
      component={WineFranceFilm}
      defaultProps={{ vertical: true }}
      durationInFrames={960}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
