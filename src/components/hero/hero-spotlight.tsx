"use client";

import { useRef } from "react";
import { createSpotlightFollow } from "@/animations/spotlight-follow";
import { useIntroDone } from "@/components/intro/intro-done";
import { gsap, useGSAP } from "@/lib/gsap";

const POINTER_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
// Uma camada por cor. No claro, cor sobre fundo claro pesa mais: as
// camadas têm metade da força.
const LAYERS = [
  "from-ts/35 light:from-ts/18",
  "from-react/22 light:from-react/12",
  "from-node/35 light:from-node/18",
];

export function HeroSpotlight() {
  const area = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const introDone = useIntroDone();

  useGSAP(
    () => {
      if (!introDone) return;
      gsap.matchMedia().add(POINTER_QUERY, () => {
        if (!area.current || !light.current) return;
        return createSpotlightFollow(area.current, light.current);
      });
    },
    { scope: area, dependencies: [introDone] },
  );

  return (
    <div
      ref={area}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        ref={light}
        className="invisible absolute top-0 left-0 size-[clamp(30rem,60vmax,80rem)] opacity-0 will-change-transform"
      >
        {LAYERS.map((color, index) => (
          <div
            key={color}
            className={`absolute inset-0 rounded-full bg-radial ${color} to-transparent to-70% ${index > 0 ? "opacity-0" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
