import {bundle} from "@remotion/bundler";
import {openBrowser, renderMedia, renderStill, selectComposition} from "@remotion/renderer";
import {execSync} from "child_process";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bundled = await bundle({entryPoint:path.resolve(__dirname,"../src/index.ts"),webpackOverride:(c)=>c});
const browser = await openBrowser("chrome",{browserExecutable:process.env.PUPPETEER_EXECUTABLE_PATH??"/bin/chromium",chromiumOptions:{args:["--no-sandbox","--disable-gpu","--disable-dev-shm-usage"]},chromeMode:"chrome-for-testing"});
const ids = process.env.COMP ? [process.env.COMP] : ["wineFranceV6Widescreen","wineFranceV6Vertical"];
const stems = {highlightV11Vertical:"asmi-story-v11-vertical",highlightV11Widescreen:"asmi-story-v11-widescreen",chaseEngineVertical:"asmi-chase-engine-vertical",chaseEngineWidescreen:"asmi-chase-engine-widescreen",aiToAiWidescreen:"asmi-ai-to-ai-widescreen",aiToAiVertical:"asmi-ai-to-ai-vertical",aiToAiV2Widescreen:"asmi-ai-to-ai-v2-widescreen",aiToAiV2Vertical:"asmi-ai-to-ai-v2-vertical",aiToAiV3Widescreen:"asmi-ai-to-ai-v3-widescreen",aiToAiV3Vertical:"asmi-ai-to-ai-v3-vertical",aiToAiV4Widescreen:"asmi-ai-to-ai-v4-widescreen",aiToAiV4Vertical:"asmi-ai-to-ai-v4-vertical",aiToAiV5Widescreen:"asmi-ai-to-ai-v5-widescreen",aiToAiV5Vertical:"asmi-ai-to-ai-v5-vertical",aiToAiV6Widescreen:"asmi-ai-to-ai-v6-widescreen",aiToAiV6Vertical:"asmi-ai-to-ai-v6-vertical",aiToAiV7Widescreen:"asmi-ai-to-ai-v7-widescreen",aiToAiV7Vertical:"asmi-ai-to-ai-v7-vertical",wineFranceWidescreen:"asmi-wine-france-widescreen",wineFranceVertical:"asmi-wine-france-vertical",wineFranceV2Widescreen:"asmi-wine-france-v2-widescreen",wineFranceV2Vertical:"asmi-wine-france-v2-vertical",wineFranceV3Widescreen:"asmi-wine-france-v3-widescreen",wineFranceV3Vertical:"asmi-wine-france-v3-vertical",wineFranceV4Widescreen:"asmi-wine-france-v4-widescreen",wineFranceV4Vertical:"asmi-wine-france-v4-vertical",wineFranceV5Widescreen:"asmi-wine-france-v5-widescreen",wineFranceV5Vertical:"asmi-wine-france-v5-vertical",wineFranceV6Widescreen:"asmi-wine-france-v6-widescreen",wineFranceV6Vertical:"asmi-wine-france-v6-vertical"};

for (const id of ids) {
  const composition=await selectComposition({serveUrl:bundled,id,puppeteerInstance:browser});
  if(process.env.STILLS === "1") {
    for(const frame of [20,70,105,125,170,230,270,300,340,390,450,475,520,570,600,640,690,715,750,800,840,875,915]) await renderStill({composition,serveUrl:bundled,output:`/tmp/${id}-review-${frame}.png`,frame,puppeteerInstance:browser});
    continue;
  }
  const stem=process.env.STEM ? `${process.env.STEM}-${id.endsWith("Vertical")?"vertical":"widescreen"}` : stems[id]; const video=`/tmp/${stem}-silent.mp4`; const audio=`/tmp/${stem}.wav`; const out=`/mnt/documents/${stem}.mp4`;
  await renderMedia({composition,serveUrl:bundled,codec:"h264",outputLocation:video,puppeteerInstance:browser,muted:true,concurrency:1});
  await renderMedia({composition,serveUrl:bundled,codec:"wav",outputLocation:audio,puppeteerInstance:browser,concurrency:1});
  execSync(`ffmpeg -y -i ${video} -i ${audio} -filter:a loudnorm=I=-14:TP=-2:LRA=9 -c:v copy -c:a aac -ar 48000 -b:a 192k -shortest ${out}`,{stdio:"inherit"});
}
await browser.close({silent:false});