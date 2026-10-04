import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { PINNED_CLASS } from "./projects-targets.ts";

test("a variante stage-pinned: do CSS procura a classe que o GSAP põe no palco", () => {
  const css = readFileSync(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const match = css.match(/@custom-variant stage-pinned \(([^;]+)\);/);
  assert.ok(match, "a variante stage-pinned não está no globals.css");
  assert.ok(
    match[1].includes(`.${PINNED_CLASS})`),
    `a variante não procura por .${PINNED_CLASS}: ${match[1]}`,
  );
});
