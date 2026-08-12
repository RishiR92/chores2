import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/asmi/Nav";
import { ScrollProgress } from "@/components/asmi/ScrollProgress";
import { Hero } from "@/components/asmi/Hero";
import { Receipts } from "@/components/asmi/Receipts";
import { GenerativeUI } from "@/components/asmi/GenerativeUI";
import { ChaseEngine } from "@/components/asmi/ChaseEngine";

import { ChoreGrid } from "@/components/asmi/ChoreGrid";
import { LangCluster } from "@/components/asmi/LangCluster";
import { CloseCTA } from "@/components/asmi/CloseCTA";
import { StickyChannelBar } from "@/components/asmi/ChannelCTA";

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
      <Nav />
      <Hero />
      <Receipts />
      <ChaseEngine />
      <ChoreGrid />
      <LangCluster />
      <CloseCTA />

      <footer className="px-5 sm:px-8" style={{ background: "var(--paper-deep)" }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <a href="#" className="font-display" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em" }}>
            asmi
          </a>
          <p className="font-sans" style={{ color: "var(--ink-dim)", fontSize: 14, maxWidth: 420 }}>
            she calls, texts, emails and chases — until it's done.
          </p>
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
        <div className="h-16 md:h-0" aria-hidden />
      </footer>

      <StickyChannelBar />
    </main>
  );
}
