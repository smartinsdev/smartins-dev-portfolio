import { ImageResponse } from "next/og";
import { Logo } from "@/components/ui/logo";
import { site } from "@/data/site";
import { loadOgFonts } from "@/lib/og-fonts";
import { themeColors as c } from "@/lib/theme-colors";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** "#3178c6" + 0.24 -> "rgba(49, 120, 198, 0.24)". */
function alpha(hex: string, opacity: number) {
  const [r, g, b] = [1, 3, 5].map((i) =>
    Number.parseInt(hex.slice(i, i + 2), 16),
  );
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: c.ink900,
        backgroundImage: [
          `radial-gradient(circle at 0% 35%, ${alpha(c.ts, 0.3)}, transparent 55%)`,
          `radial-gradient(circle at 100% 75%, ${alpha(c.node, 0.22)}, transparent 50%)`,
        ].join(", "),
      }}
    >
      <Logo
        id="og-logo"
        width={120}
        height={56}
        style={{ position: "absolute", top: 52, left: 72 }}
      />

      <div
        style={{
          fontFamily: "Display",
          fontSize: 132,
          lineHeight: 1,
          letterSpacing: "-0.025em",
          color: c.fg,
        }}
      >
        {site.name}
      </div>

      <div
        style={{
          marginTop: 32,
          fontFamily: "Body",
          fontSize: 46,
          letterSpacing: "-0.01em",
          backgroundImage: `linear-gradient(90deg, ${c.tsLight}, ${c.react}, ${c.nodeLight})`,
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {site.role}
      </div>
    </div>,
    { ...size, fonts: await loadOgFonts() },
  );
}
