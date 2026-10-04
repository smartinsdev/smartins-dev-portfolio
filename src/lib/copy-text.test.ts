import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { copyText } from "./copy-text.ts";

describe("copyText", () => {
  test("copia o texto e avisa que deu certo", async () => {
    const written: string[] = [];
    const clipboard = {
      writeText: async (text: string) => {
        written.push(text);
      },
    };
    assert.equal(await copyText(clipboard, "eu@site.dev"), "copied");
    assert.deepEqual(written, ["eu@site.dev"]);
  });

  test("avisa que falhou quando o navegador recusa", async () => {
    const clipboard = {
      writeText: async () => {
        throw new DOMException("Sem permissão", "NotAllowedError");
      },
    };
    assert.equal(await copyText(clipboard, "eu@site.dev"), "failed");
  });

  test("avisa que falhou quando a API não existe", async () => {
    assert.equal(await copyText(undefined, "eu@site.dev"), "failed");
  });
});
