import assert from "node:assert/strict";
import { describe, test } from "node:test";

type Store = typeof import("./theme-store.ts");

/** Um localStorage falso, com o que foi gravado à vista em `data`. */
function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}

let loads = 0;

/**
 * Carrega uma cópia nova do store: a query string muda a URL, e o Node
 * trata como outro módulo (o store guarda estado no módulo). "blocked"
 * imita o navegador com o storage bloqueado: só tocar nele já lança erro.
 */
async function loadStore(
  storage: ReturnType<typeof fakeStorage> | "blocked",
): Promise<Store> {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get: () => {
      if (storage === "blocked") throw new Error("SecurityError");
      return storage;
    },
  });
  loads += 1;
  return import(`./theme-store.ts?load=${loads}`);
}

describe("theme-store", () => {
  test("sem nada salvo, o tema é o do sistema", async () => {
    const { readTheme } = await loadStore(fakeStorage());
    assert.equal(readTheme(), "system");
  });

  test("lê a escolha salva", async () => {
    const { readTheme } = await loadStore(fakeStorage({ theme: "dark" }));
    assert.equal(readTheme(), "dark");
  });

  test("valor salvo estranho vira sistema", async () => {
    for (const value of ["blue", "Dark", '"dark"']) {
      const { readTheme } = await loadStore(fakeStorage({ theme: value }));
      assert.equal(readTheme(), "system", value);
    }
  });

  test("salvar claro grava no storage e muda a leitura", async () => {
    const storage = fakeStorage();
    const { readTheme, saveTheme } = await loadStore(storage);
    saveTheme("light");
    assert.equal(storage.data.get("theme"), "light");
    assert.equal(readTheme(), "light");
  });

  test("salvar sistema apaga a chave", async () => {
    const storage = fakeStorage({ theme: "dark" });
    const { readTheme, saveTheme } = await loadStore(storage);
    saveTheme("system");
    assert.equal(storage.data.has("theme"), false);
    assert.equal(readTheme(), "system");
  });

  test("storage bloqueado: começa no sistema e a escolha vale na memória", async () => {
    const { readTheme, saveTheme } = await loadStore("blocked");
    assert.equal(readTheme(), "system");
    assert.doesNotThrow(() => saveTheme("dark"));
    assert.equal(readTheme(), "dark");
  });

  test("avisa quem assinou, até cancelar", async () => {
    const { saveTheme, subscribeTheme } = await loadStore(fakeStorage());
    let calls = 0;
    const unsubscribe = subscribeTheme(() => {
      calls += 1;
    });
    saveTheme("light");
    unsubscribe();
    saveTheme("dark");
    assert.equal(calls, 1);
  });
});
