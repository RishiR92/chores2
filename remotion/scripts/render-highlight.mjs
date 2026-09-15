import {bundle} from "@remotion/bundler";
import {openBrowser, renderMedia, renderStill, selectComposition} from "@remotion/renderer";
import {execSync} from "child_process";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bundled = await bundle({entryPoint:path.resolve(__dirname,"../src/index.ts"),webpackOverride:(c)=>c});
const browser = await openBrowser("chrome",{browserExecutable:process.env.PUPPETEER_EXECUTABLE_PATH??"/bin/chromium",chromiumOptions:{args:["--no-sandbox","--disable-gpu","--disable-dev-shm-usage"]},chromeMode:"chrome-for-testing"});
const ids = process.env.COMP ? [process.env.COMP] : ["highlightV10Vertical","highlightV10Widescreen"];
const stems = {highlightV10Vertical:"asmi-story-v10-vertical",highlightV10Widescreen:"asmi-story-v10-widescreen"};

for (const id of ids) {
  const composition=await selectComposition({serveUrl:bundled,id,puppeteerInstance:browser});
  if(process.env.STILLS === "1") {
    for(const frame of [12,34,62,112,165,245,325,405,485,548,625,690,710,735,798,850,910,948]) await renderStill({composition,serveUrl:bundled,output:`/tmp/${id}-v10-${frame}.png`,frame,puppeteerInstance:browser});
    continue;
  }
  const stem=stems[id]; const video=`/tmp/${stem}-silent.mp4`; const audio=`/tmp/${stem}.wav`; const out=`/mnt/documents/${stem}.mp4`;
  await renderMedia({composition,serveUrl:bundled,codec:"h264",outputLocation:video,puppeteerInstance:browser,muted:true,concurrency:1});
  await renderMedia({composition,serveUrl:bundled,codec:"wav",outputLocation:audio,puppeteerInstance:browser,concurrency:1});
  execSync(`ffmpeg -y -i ${video} -i ${audio} -filter:a loudnorm=I=-14:TP=-2:LRA=9 -c:v copy -c:a aac -ar 48000 -b:a 192k -shortest ${out}`,{stdio:"inherit"});
}
await browser.close({silent:false});