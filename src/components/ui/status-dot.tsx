export function StatusDot() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex size-[0.42em] shrink-0"
    >
      <span className="absolute inset-0 rounded-full bg-accent opacity-70 motion-safe:animate-ping" />
      <span className="relative size-full rounded-full bg-accent" />
    </span>
  );
}
