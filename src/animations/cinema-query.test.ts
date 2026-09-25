import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { CINEMA_QUERY } from "./cinema-query.ts";

/** Sem espaços nem quebras de linha: o Biome quebra a condição do CSS. */
const compact = (text: string) => text.replace(/\s+/g, "");

test("a variante cinema: do CSS e o CINEMA_QUERY do GSAP são a mesma condição", () => {
  const css = readFileSync(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  // O que vem entre o "@media" da variante e a chave que abre o @slot.
  const match = css.match(/@custom-variant cinema\s*\{\s*@media([^{]+)\{/);
  assert.ok(match, "a variante cinema não está no globals.css");
  assert.equal(compact(match[1]), compact(CINEMA_QUERY));
});
