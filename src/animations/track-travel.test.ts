import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { cardProgress, trackTravel } from "./track-travel.ts";

describe("trackTravel", () => {
  test("anda o quanto a fileira passa da largura do palco", () => {
    assert.equal(trackTravel(2132, 1425), 707);
  });

  test("não anda quando a fileira cabe no palco", () => {
    assert.equal(trackTravel(1000, 1440), 0);
  });

  test("não anda quando a fileira tem a largura exata do palco", () => {
    assert.equal(trackTravel(1440, 1440), 0);
  });
});

describe("cardProgress", () => {
  // Palco de 1425px: margem de 43px, cards de 490px com 29px entre eles.
  const margin = 43;
  const step = 490 + 29;
  const travel = 707;

  test("o primeiro card já aparece no começo do slide", () => {
    assert.equal(cardProgress(margin, margin, travel), 0);
  });

  test("o segundo card aparece quando a fileira andou um card", () => {
    assert.equal(cardProgress(margin + step, margin, travel), step / travel);
  });

  test("os cards do fim param no fim do slide", () => {
    assert.equal(cardProgress(margin + 2 * step, margin, travel), 1);
    assert.equal(cardProgress(margin + 3 * step, margin, travel), 1);
  });

  test("sem slide (a fileira cabe na tela), todo card fica no começo", () => {
    assert.equal(cardProgress(margin + step, margin, 0), 0);
  });

  test("nunca fica antes do começo", () => {
    assert.equal(cardProgress(0, margin, travel), 0);
  });
});
