import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontsDir = join(process.cwd(), "src/assets/fonts/og");
const fontsPromise = Promise.all([
  readFile(join(fontsDir, "source-serif-4-600-opsz60.ttf")),
  readFile(join(fontsDir, "geist-500.ttf")),
]).then(([display, body]) => [
  {
    name: "Display",
    data: display,
    weight: 600 as const,
    style: "normal" as const,
  },
  { name: "Body", data: body, weight: 500 as const, style: "normal" as const },
]);

export function loadOgFonts() {
  return fontsPromise;
}
