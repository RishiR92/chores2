import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Nav } from "@/components/asmi/Nav";
import { ScrollProgress } from "@/components/asmi/ScrollProgress";
import { Act1Opening } from "@/components/asmi/Act1Opening";
import { Act2Dread } from "@/components/asmi/Act2Dread";
import { Act3Work } from "@/components/asmi/Act3Work";
import { Act4Cloud } from "@/components/asmi/Act4Cloud";
import { Act5, Act5Stories } from "@/components/asmi/Act5";
import { Act6Close } from "@/components/asmi/Act6Close";
import { OrganicDivider } from "@/components/asmi/Atmosphere";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "asmi — just text her. she handles the calls." },
      {
        name: "description",
        content:
          "text asmi and she calls, texts, emails and chases until it's done — cancel the gym, fight the charge, book the dentist. no app, no signup.",
      },
      { property: "og:title", content: "asmi — just text her." },
      {
        property: "og:description",
        content: "she calls, texts, emails and chases — until the thing is actually done.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const heroRef = useRef<HTMLElement>(null);
  return (
    <main className="landing-theme relative" style={{ overflowX: "clip" }}>
      <ScrollProgress />
      <Nav />
      <Act1Opening sectionRef={heroRef} />
      <Act2Dread />
      <Act3Work />
      <OrganicDivider />
      <Act4Cloud />
      <Act5Stories />
      <Act5 />
      <Act6Close />

      {/* Footer */}
      <footer className="relative" style={{ background: "#EDE6DC" }}>
        <svg
          viewBox="0 0 1440 24"
          className="w-full block"
          preserveAspectRatio="none"
          style={{ height: 24, marginTop: -1 }}
          aria-hidden
        >
          <path
            d="M0,12 C180,4 360,20 540,12 C720,4 900,20 1080,12 C1260,4 1380,16 1440,12"
            stroke="#7A6F64"
            strokeOpacity="0.2"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <a href="#" className="font-serif italic" style={{ color: "var(--color-espresso)", fontSize: 20 }}>
            asmi
          </a>
          <p className="font-serif italic" style={{ color: "var(--color-stone-dim)", fontSize: 14, maxWidth: 420 }}>
            she calls, texts, emails and chases — until it's done.
          </p>
          <div
            className="font-serif italic flex items-center gap-2"
            style={{ color: "var(--color-stone-dim)", fontSize: 14 }}
          >
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
