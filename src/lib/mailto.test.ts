import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { mailtoHref } from "./mailto.ts";

describe("mailtoHref", () => {
  test("sem assunto, é só o endereço", () => {
    assert.equal(mailtoHref("eu@site.dev"), "mailto:eu@site.dev");
  });

  test("assunto vazio conta como sem assunto", () => {
    assert.equal(mailtoHref("eu@site.dev", ""), "mailto:eu@site.dev");
  });

  test("espaço vira %20, e não +", () => {
    const href = mailtoHref("eu@site.dev", "Contact from your portfolio");
    assert.equal(
      href,
      "mailto:eu@site.dev?subject=Contact%20from%20your%20portfolio",
    );
    assert.ok(!href.includes("+"));
  });

  test("acentos e símbolos chegam codificados", () => {
    assert.equal(
      mailtoHref("eu@site.dev", "Portfólio & orçamento?"),
      "mailto:eu@site.dev?subject=Portf%C3%B3lio%20%26%20or%C3%A7amento%3F",
    );
  });
});
