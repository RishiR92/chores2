import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.env.OUT || "/mnt/documents/asmi-launch-16x9-v1.mp4";
const VIDEO_TMP = "/tmp/asmi-launch-video-only.mp4";
const AUDIO_TMP = "/tmp/asmi-launch-audio-only.wav";
const COMP = "launch16x9";
const STILLS = process.env.STILLS === "1";

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
  id: COMP,
  puppeteerInstance: browser,
});

if (STILLS) {
  const checks = [
    { name: "intro",   frame: 30 },
    { name: "wa-doc",  frame: 100 },
    { name: "doc",     frame: 250 },
    { name: "hvac",    frame: 500 },
    { name: "gp",      frame: 820 },
    { name: "done",    frame: 1080 },
    { name: "tasks",   frame: 1260 },
    { name: "langs",   frame: 1390 },
    { name: "outro",   frame: 1500 },
  ];
  for (const c of checks) {
    const p = `/tmp/launch-${c.name}.png`;
    console.log("still", c.name, c.frame);
    await renderStill({
      composition,
      serveUrl: bundled,
      output: p,
      frame: c.frame,
      puppeteerInstance: browser,
    });
  }
  await browser.close({ silent: false });
  console.log("stills done");
  process.exit(0);
}

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
