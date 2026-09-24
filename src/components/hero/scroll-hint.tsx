import { INTRO } from "@/animations/intro-targets";

export function ScrollHint() {
  return (
    <div
      data-intro={INTRO.scrollHint}
      aria-hidden="true"
      className="absolute inset-x-0 bottom-[clamp(1rem,2.5svh,2rem)] flex justify-center text-fg-muted"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[clamp(1.5rem,1.8vw,2.5rem)] motion-safe:animate-nudge"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
