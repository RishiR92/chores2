import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy · asmi" },
      {
        name: "description",
        content:
          "How asmi collects, uses, and protects your data when you use our AI assistant.",
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <main className="landing-theme min-h-screen px-5 sm:px-8 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="font-serif italic"
          style={{ color: "var(--color-stone-dim)", fontSize: 14 }}
        >
          ← back to asmi
        </Link>

        <h1
          className="font-serif mt-8"
          style={{
            color: "var(--color-espresso-strong)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          Privacy Policy
        </h1>

        <p
          className="font-serif italic mt-2"
          style={{ color: "var(--color-stone-dim)", fontSize: 14 }}
        >
          Last updated: May 2026
        </p>

        <div
          className="mt-10 space-y-6 font-sans"
          style={{
            color: "var(--color-ink)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
          }}
        >
          <p>
            asmi is an AI assistant that handles personal chores in the physical
            world on your behalf. To do that well, we collect the minimum data
            needed to act for you, and we never sell it.
          </p>

          <h2
            className="font-serif"
            style={{
              color: "var(--color-espresso-strong)",
              fontSize: "1.5rem",
              marginTop: "2rem",
            }}
          >
            What we collect
          </h2>
          <p>
            Account details (name, email, phone), the tasks you ask asmi to
            complete, and call recordings or transcripts created while asmi
            acts on your behalf.
          </p>

          <h2
            className="font-serif"
            style={{
              color: "var(--color-espresso-strong)",
              fontSize: "1.5rem",
              marginTop: "2rem",
            }}
          >
            How we use it
          </h2>
          <p>
            To complete the tasks you request, to improve asmi's quality, and
            to keep your account secure. We do not sell your personal data.
          </p>

          <h2
            className="font-serif"
            style={{
              color: "var(--color-espresso-strong)",
              fontSize: "1.5rem",
              marginTop: "2rem",
            }}
          >
            Contact
          </h2>
          <p>
            Questions or requests about your data:{" "}
            <a
              href="mailto:support@asmiai.com"
              style={{ color: "var(--color-terracotta)" }}
            >
              support@asmiai.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
