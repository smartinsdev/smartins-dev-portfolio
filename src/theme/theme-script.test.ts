import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { runInNewContext } from "node:vm";
import { themeScript } from "./theme-script.ts";

type Stored = string | null | { blocked: true };

/**
 * Roda o script como o navegador rodaria, mas num contexto separado, com
 * um <html> e um localStorage falsos. Devolve o data-theme gravado, ou
 * undefined se nada foi gravado.
 */
function runScript(stored: Stored) {
  const attributes = new Map<string, string>();
  const context = {
    document: {
      documentElement: {
        setAttribute: (name: string, value: string) => {
          attributes.set(name, value);
        },
      },
    },
    localStorage: {
      getItem: () => {
        if (stored !== null && typeof stored === "object") {
          throw new Error("SecurityError");
        }
        return stored;
      },
    },
  };
  runInNewContext(themeScript, context);
  return attributes.get("data-theme");
}

describe("script inline do tema", () => {
  test("claro salvo vira data-theme=light", () => {
    assert.equal(runScript("light"), "light");
  });

  test("escuro salvo vira data-theme=dark", () => {
    assert.equal(runScript("dark"), "dark");
  });

  test("sistema ou nada salvo não grava atributo", () => {
    assert.equal(runScript("system"), undefined);
    assert.equal(runScript(null), undefined);
  });

  test("valor estranho é ignorado", () => {
    for (const value of ["blue", "", "Dark", '"dark"', "light "]) {
      assert.equal(runScript(value), undefined, value);
    }
  });

  test("storage bloqueado não quebra a página", () => {
    assert.doesNotThrow(() => runScript({ blocked: true }));
    assert.equal(runScript({ blocked: true }), undefined);
  });
});
