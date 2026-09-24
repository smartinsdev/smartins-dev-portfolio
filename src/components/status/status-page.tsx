import type { ReactNode } from "react";

type StatusPageProps = {
  code: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function StatusPage({
  code,
  title,
  description,
  children,
}: StatusPageProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-stack-glow px-6 py-16 text-center">
      <p
        aria-hidden="true"
        className="bg-linear-to-b from-fg/25 to-fg/0 bg-clip-text font-display text-[clamp(7rem,24vw,16rem)] font-semibold leading-none tracking-tight text-transparent"
      >
        {code}
      </p>
      <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight text-fg title-glow">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-lg text-fg-muted">{description}</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-base md:text-lg">
        {children}
      </div>
    </main>
  );
}
