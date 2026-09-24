import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { locales } from "./i18n/locales.ts";

// O Next lê o `matcher` do proxy.ts no build, como texto fixo: não dá para
// montar ele com a lista de idiomas. Este teste lê o mesmo texto e confere
// que o proxy só roda onde precisa (e acusa um idioma esquecido lá).
const source = readFileSync(new URL("./proxy.ts", import.meta.url), "utf8");
const literal = source.match(/matcher: \[("(?:[^"\\]|\\.)*")\]/)?.[1];
assert.ok(literal, "matcher não encontrado em proxy.ts");
const matcher = new RegExp(`^${JSON.parse(literal)}$`);
const runsOn = (path: string) => matcher.test(path);

describe("matcher do proxy", () => {
  test("roda em caminhos sem idioma", () => {
    for (const path of ["/", "/x", "/english", "/pt-brx"]) {
      assert.equal(runsOn(path), true, path);
    }
  });

  test("não roda nas páginas com idioma, que são estáticas", () => {
    for (const locale of locales) {
      for (const path of [`/${locale}`, `/${locale}/`, `/${locale}/x`]) {
        assert.equal(runsOn(path), false, path);
      }
    }
  });

  test("não roda em arquivos nem no _next", () => {
    for (const path of [
      "/robots.txt",
      "/hero/card-01.svg",
      "/_next/static/chunk.js",
    ]) {
      assert.equal(runsOn(path), false, path);
    }
  });
});
