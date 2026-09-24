import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { localizePath, pathLocale } from "./localize-path.ts";

describe("pathLocale", () => {
  test("lê o idioma do começo do caminho", () => {
    assert.equal(pathLocale("/en/x"), "en");
    assert.equal(pathLocale("/pt-br"), "pt-br");
  });

  test("prefixo parecido não conta como idioma", () => {
    assert.equal(pathLocale("/english"), undefined);
  });

  test("home e caminho vazio não têm idioma", () => {
    assert.equal(pathLocale("/"), undefined);
    assert.equal(pathLocale(""), undefined);
  });
});

describe("localizePath", () => {
  test("troca o idioma da home", () => {
    assert.equal(localizePath("/pt-br", "en"), "/en");
    assert.equal(localizePath("/en", "pt-br"), "/pt-br");
  });

  test("troca o idioma e mantém o resto do caminho", () => {
    assert.equal(localizePath("/pt-br/x", "en"), "/en/x");
  });

  test("acrescenta o idioma em caminho sem idioma", () => {
    assert.equal(localizePath("/x", "en"), "/en/x");
    assert.equal(localizePath("/", "pt-br"), "/pt-br");
  });

  test("não confunde prefixo parecido com idioma", () => {
    assert.equal(localizePath("/english", "pt-br"), "/pt-br/english");
  });

  test("a barra no fim da home some", () => {
    assert.equal(localizePath("/pt-br/", "en"), "/en");
  });
});
