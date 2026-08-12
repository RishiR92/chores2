import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/asmi/Nav";
import { Cursor } from "@/components/asmi/Cursor";
import { ScrollProgress } from "@/components/asmi/ScrollProgress";
import { Hero } from "@/components/asmi/Hero";
import { Receipts } from "@/components/asmi/Receipts";
import { GenerativeUI } from "@/components/asmi/GenerativeUI";
import { ChaseEngine } from "@/components/asmi/ChaseEngine";

import { ChoreGrid } from "@/components/asmi/ChoreGrid";
import { LangCluster } from "@/components/asmi/LangCluster";
import { ScrollSection } from "@/components/asmi/Reveal";
import asmiLogo from "@/assets/asmi-logo-black.png.asset.json";


export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "asmi — the most irritating assistant in the world" },
      {
        name: "description",
        content:
          "she calls, texts, emails and chases — until your thing is actually done. cancel the gym, fight the charge, book the dentist. just text her on iMessage or WhatsApp.",
      },
      { property: "og:title", content: "asmi — the most irritating assistant in the world" },
      {
        property: "og:description",
        content: "she calls, texts, emails and chases — she won't leave people alone until it's done.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <main className="landing-theme relative" style={{ overflowX: "clip" }}>
      <ScrollProgress />
      <Cursor />
      <Nav />
      <Hero />
      <Receipts />

      <ScrollSection>
        <GenerativeUI />
      </ScrollSection>
      <ScrollSection strength={18}>
        <ChaseEngine />
      </ScrollSection>
      <ScrollSection>
        <ChoreGrid />
      </ScrollSection>
      <ScrollSection>
        <LangCluster />
      </ScrollSection>

      <footer className="px-5 sm:px-8" style={{ background: "var(--paper-deep)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 py-7">
          <a href="#" aria-label="asmi home" className="shrink-0">
            <img src={asmiLogo.url} alt="asmi" width={78} height={28} className="h-7 w-auto" />
          </a>

          <div className="flex items-center gap-2 font-sans" style={{ color: "var(--ink-dim)", fontSize: 14 }}>
            <a href="mailto:support@asmiai.com" style={{ color: "inherit" }}>
              support@asmiai.com
            </a>
            <span aria-hidden>·</span>
            <a href="/privacy" style={{ color: "inherit" }}>
              Privacy
            </a>
          </div>
        </div>
      </footer>


    </main>
  );
}
