import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { negotiateLocale } from "./negotiate-locale.ts";

describe("negotiateLocale", () => {
  test("português do Brasil vira pt-br", () => {
    assert.equal(
      negotiateLocale({ acceptLanguage: "pt-BR,pt;q=0.9" }),
      "pt-br",
    );
  });

  test("inglês vira en", () => {
    assert.equal(negotiateLocale({ acceptLanguage: "en-US,en;q=0.9" }), "en");
  });

  test("português de Portugal também vira pt-br", () => {
    assert.equal(negotiateLocale({ acceptLanguage: "pt-PT" }), "pt-br");
  });

  test("pula idiomas sem suporte e pega o primeiro suportado", () => {
    assert.equal(
      negotiateLocale({ acceptLanguage: "de-DE,pt;q=0.5" }),
      "pt-br",
    );
  });

  test("entre os suportados, vale a ordem de preferência", () => {
    assert.equal(
      negotiateLocale({ acceptLanguage: "de-DE,en;q=0.8,pt;q=0.5" }),
      "en",
    );
  });

  test("vale o peso q, não a posição no cabeçalho", () => {
    assert.equal(
      negotiateLocale({ acceptLanguage: "en;q=0.5,pt;q=0.9" }),
      "pt-br",
    );
  });

  test("nenhum idioma suportado cai no padrão", () => {
    assert.equal(negotiateLocale({ acceptLanguage: "de" }), "en");
  });

  test("cabeçalho vazio ou ausente cai no padrão", () => {
    assert.equal(negotiateLocale({ acceptLanguage: "" }), "en");
    assert.equal(negotiateLocale({ acceptLanguage: null }), "en");
    assert.equal(negotiateLocale({}), "en");
  });

  test("cookie válido vence o navegador", () => {
    assert.equal(
      negotiateLocale({ cookie: "pt-br", acceptLanguage: "en-US" }),
      "pt-br",
    );
  });

  test("cookie inválido é ignorado", () => {
    assert.equal(
      negotiateLocale({ cookie: "fr", acceptLanguage: "pt-BR" }),
      "pt-br",
    );
  });

  test("q=0 quer dizer 'não quero este idioma'", () => {
    assert.equal(negotiateLocale({ acceptLanguage: "pt;q=0,en;q=0.1" }), "en");
  });

  test("maiúsculas e espaços não atrapalham", () => {
    assert.equal(
      negotiateLocale({ acceptLanguage: "  PT-br ; q=0.8 , EN;q=0.2" }),
      "pt-br",
    );
  });

  test("q malformado é tratado como recusado", () => {
    assert.equal(negotiateLocale({ acceptLanguage: "pt;q=abc,en" }), "en");
  });

  test("curinga e nomes herdados de Object não viram idioma", () => {
    assert.equal(
      negotiateLocale({ acceptLanguage: "*, constructor, __proto__" }),
      "en",
    );
  });
});
