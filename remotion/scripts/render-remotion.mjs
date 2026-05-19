import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.env.OUT || "/mnt/documents/asmi-demo-v5.mp4";
const VIDEO_TMP = "/tmp/asmi-video-only.mp4";
const AUDIO_TMP = "/tmp/asmi-audio-only.wav";

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({
  serveUrl: bundled,
  id: "main",
  puppeteerInstance: browser,
});

console.log("rendering video (silent)…");
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: VIDEO_TMP,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});

console.log("rendering audio (wav)…");
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "wav",
  outputLocation: AUDIO_TMP,
  puppeteerInstance: browser,
  concurrency: 1,
});

await browser.close({ silent: false });

console.log("muxing with native aac…");
execSync(
  `ffmpeg -y -i ${VIDEO_TMP} -i ${AUDIO_TMP} -c:v copy -c:a aac -b:a 192k -shortest ${OUT}`,
  { stdio: "inherit" }
);
console.log("done ->", OUT);
