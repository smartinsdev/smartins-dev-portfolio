import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isTheme } from "./themes.ts";

describe("isTheme", () => {
  test("aceita os três temas", () => {
    for (const value of ["system", "light", "dark"]) {
      assert.equal(isTheme(value), true, value);
    }
  });

  test("recusa qualquer outra coisa", () => {
    for (const value of ["blue", "", "Dark", '"dark"', "light ", null, 1]) {
      assert.equal(isTheme(value), false, String(value));
    }
  });
});
