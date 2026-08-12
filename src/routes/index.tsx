import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Nav } from "@/components/asmi/Nav";
import { ScrollProgress } from "@/components/asmi/ScrollProgress";
import { Act1Opening } from "@/components/asmi/Act1Opening";
import { Act2CallViz } from "@/components/asmi/Act2CallViz";
import { Act3ThreeMoments } from "@/components/asmi/Act3Moments";
import { Act4Cloud } from "@/components/asmi/Act4Cloud";
import { Act5, Act5Stories } from "@/components/asmi/Act5";
import { Act6Close } from "@/components/asmi/Act6Close";
import { OrganicDivider } from "@/components/asmi/Atmosphere";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Asmi — AI that handles your personal chores in the physical world" },
      { name: "description", content: "Asmi makes real phone calls — plumbers, prescriptions, family check-ins. You text. Asmi handles it." },
      { property: "og:title", content: "Asmi — The screen era is over." },
      { property: "og:description", content: "AI that handles your personal chores in the physical world." },
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
      <Act2CallViz />
      <div aria-hidden className="hidden md:block" style={{ height: "40svh" }} />
      <Act3ThreeMoments />
      <Act5Stories />
      <OrganicDivider />
      <Act4Cloud />
      <Act5 />
      <Act6Close />

      {/* Footer */}
      <footer
        className="relative"
        style={{ background: "#EDE6DC" }}
      >
        {/* Organic wavy separator */}
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
          <a
            href="#"
            className="font-serif italic"
            style={{ color: "var(--color-espresso)", fontSize: 20 }}
          >
            asmi
          </a>
          <p
            className="font-serif italic"
            style={{ color: "var(--color-stone-dim)", fontSize: 14, maxWidth: 420 }}
          >
            AI that handles your personal chores in the physical world.
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
