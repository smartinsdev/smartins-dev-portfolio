import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isPlainClick } from "./is-plain-click.ts";

const plain = {
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
};

describe("isPlainClick", () => {
  test("aceita o clique com o botão esquerdo, sem tecla", () => {
    assert.equal(isPlainClick(plain), true);
  });

  test("recusa o botão do meio e o direito", () => {
    assert.equal(isPlainClick({ ...plain, button: 1 }), false);
    assert.equal(isPlainClick({ ...plain, button: 2 }), false);
  });

  test("recusa o clique com Ctrl, Cmd, Shift ou Alt", () => {
    for (const key of ["ctrlKey", "metaKey", "shiftKey", "altKey"] as const) {
      assert.equal(isPlainClick({ ...plain, [key]: true }), false, key);
    }
  });
});
