# Tema sistema / claro / escuro — Design

- **Data:** 2026-09-24
- **Status:** aprovado na conversa, aguardando revisão desta spec
- **Branch:** `feat/theme`

## Objetivo

Dar ao portfólio um tema claro tão bem-acabado quanto o escuro de hoje, e um
seletor com três opções: **Sistema**, **Claro** e **Escuro**. Na primeira
visita vale o sistema operacional. Como macOS e Windows vêm no claro por
padrão, muita gente (recrutadores inclusive) vai ver o claro primeiro.

Este é o **subprojeto 2 de 2** (o 1 foi o i18n). O seletor mora no painel de
preferências criado no subprojeto 1.

## Decisões tomadas

| Pergunta | Decisão |
| --- | --- |
| Tema na primeira visita? | **Sistema** (`prefers-color-scheme`). |
| A colagem do hero no claro? | **Tudo claro.** Cards com versão clara "calma" (linhas coloridas a 42%), halo branco atrás do subtítulo e gradiente do subtítulo mais escuro. |
| Nível de contraste? | **WCAG AAA** para texto nos dois temas: 7:1 (normal) e 4.5:1 (grande). |
| Seletor no painel? | **Controle segmentado** com ícone + texto (monitor, sol, lua). |
| Animação na troca? | **Fade curto** (~250ms) com View Transitions. Sem suporte ou com "reduzir movimento": troca direta. |
| Mecanismo? | **`light-dark()` + `color-scheme`.** "Sistema" é só CSS; o script inline só aplica a escolha forçada. |
| Onde guardar a escolha? | `localStorage`. O servidor nunca precisa saber o tema. |
| Biblioteca? | Nenhuma (sem `next-themes`). Segue o guia `preventing-flash-before-hydration` do Next 16. |

## Fora do escopo

- Sincronizar a escolha entre abas abertas (evento `storage`).
- Trocar o seletor de idioma para controle segmentado. Fica para avaliar
  depois, se o segmentado do tema funcionar bem.
- Versão clara da imagem de compartilhamento (Open Graph) e do `manifest`:
  quem mostra esses dois é o LinkedIn ou o sistema, que não sabem o tema.
- Acertar a cor da barra do navegador antes da hidratação quando a escolha
  forçada difere do sistema (ver seção 2, "Custo aceito").

## 1. Tokens e paleta

### Nomes pela função

`ink-900` e `ink-800` querem dizer "tinta escura" e seriam quase brancos no
claro. Viram nomes pela função. `ink-700` não é usado e sai. `ink-950` só
servia ao texto do botão, que passa a ter o valor direto.

### Valores

Cada token de papel é declarado **uma vez**, com `light-dark(claro, escuro)`:

| Token | Uso | Claro | Escuro (= hoje) |
| --- | --- | --- | --- |
| `page` (era `ink-900`) | fundo da página | `#f4f7fb` | `#070c17` |
| `surface` (era `ink-800`) | painel, fundo da colagem | `#ffffff` | `#0c1424` |
| `line` | anéis e bordas | `#d9e1ec` | `#1e2b45` |
| `fg` | texto principal | `#0b1220` | `#f3f6fb` |
| `fg-muted` | texto secundário | `#455369` | `#93a1b8` |
| `highlight` (novo) | anel de foco, hover dos links sociais | `#085975` | `#61dafb` |
| `gradient-from` (novo) | subtítulo, começo | `#1a5299` | `#6aa8f5` |
| `gradient-via` (novo) | subtítulo, meio | `#085975` | `#61dafb` |
| `gradient-to` (novo) | subtítulo, fim | `#265e1d` | `#8cc84b` |
| `shade` (novo) | "almofada" atrás do texto (vinheta, sombra do título) | `#f4f7fb` | `#04070e` |

```css
@theme {
  --color-page: light-dark(#f4f7fb, #070c17);
  --color-surface: light-dark(#ffffff, #0c1424);
  /* e assim por diante: uma linha por token da tabela acima */
}

/* "Sistema": o navegador escolhe o lado do light-dark() pelo SO. */
:root { color-scheme: light dark; }
/* Escolha forçada: só um lado vale. */
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }
```

**Não mudam com o tema** (identidade e botão):

- Marca: `ts #3178c6`, `ts-light #6aa8f5`, `react #61dafb`, `node #5fa04e`,
  `node-light #8cc84b`, `node-lighter #a6db6c`. Continuam nos brilhos, no
  holofote e na logo.
- Botão: `accent` = verde-limão, `accent-strong` no hover,
  `accent-foreground #04070e`.

Os modificadores de opacidade do Tailwind (`from-ts/35`, `from-fg/25`) viram
`color-mix(... var(--color-x) ...)` e continuam funcionando com
`light-dark()`. Confirmar no CSS gerado pelo build.

### Contraste (medido com a fórmula da WCAG)

| Par | Claro | Escuro |
| --- | --- | --- |
| `fg` / `page` | 17.42 | 18.05 |
| `fg-muted` / `page` | 7.25 | 7.48 |
| `fg-muted` / `surface` | 7.79 | 7.04 |
| `gradient-from` / `page` · `surface` | 7.21 · 7.75 | 7.94 · 7.48 |
| `gradient-via` / `page` · `surface` | 7.25 · 7.79 | 12.04 · 11.33 |
| `gradient-to` / `page` · `surface` | 7.24 · 7.77 | 9.76 · 9.18 |
| `highlight` / `page` | 7.25 | 12.04 |
| texto do botão / `accent` | 10.06 | 10.06 |
| `fg` sobre a seleção (`ts` a 55%) | 8.39 | 8.72 |

- O preenchimento do botão contra `page` no claro dá 1.87:1. É permitido:
  quem identifica o botão é o texto (10:1). Para dar definição, o botão ganha
  uma sombra verde suave no claro.
- O ponto verde de "disponível" é decorativo (o texto diz a mesma coisa).
- O "404" gigante é `aria-hidden` e decorativo; o `<h1>` carrega o sentido.
- Os números acima são contra fundo liso. Título e subtítulo ficam em cima da
  colagem, então a verificação mede os pixels reais (seção 6).

### Efeitos que não são um token só

Valores de partida (os mesmos do mockup aprovado). O escuro não muda.

| Efeito | Claro |
| --- | --- |
| `bg-stack-glow` | brilho `ts` a 14% e `node` a 12% sobre `page`; pontinhos `#0b1220` a 6% |
| vinheta da colagem | `rgb(244 247 251 / .82)` no centro, `/ .35` a 60% |
| `title-glow` | `0 1px 2px rgb(255 255 255/.7)`, `0 8px 40px rgb(244 247 251/.95)`, `0 0 90px` `ts` a 22% |
| `subtitle-glow` (novo) | `drop-shadow(0 0 1px rgb(255 255 255/.9))` `drop-shadow(0 0 10px rgb(255 255 255/.95))` `drop-shadow(0 2px 22px #f4f7fb)` |
| brilho do botão | `0 6px 24px -10px rgb(63 130 40/.6)` |
| sombra do painel | `0 20px 40px -16px rgb(11 18 32/.18)` |
| holofote que segue o mouse | calibrar no navegador (cor sobre claro pesa diferente) |

`subtitle-glow` é uma utility nova no `globals.css`, ao lado de `title-glow`.
No escuro ela é a sombra de hoje (`drop-shadow(0 2px 18px rgb(4 7 14/.95))`).

### Variantes `light:` e `dark:`

Para o que não é cor (mostrar um card ou outro, halo versus sombra), duas
variantes em `globals.css`. A `dark:` de fábrica do Tailwind só olha o SO,
então as duas são redefinidas para seguir a mesma regra do `color-scheme`:
escolha forçada primeiro, sistema depois.

```css
@custom-variant dark {
  &:where([data-theme="dark"], [data-theme="dark"] *) { @slot; }
  @media (prefers-color-scheme: dark) {
    &:where(:root:not([data-theme]), :root:not([data-theme]) *) { @slot; }
  }
}

@custom-variant light {
  &:where([data-theme="light"], [data-theme="light"] *) { @slot; }
  @media (prefers-color-scheme: light) {
    &:where(:root:not([data-theme]), :root:not([data-theme]) *) { @slot; }
  }
}
```

Confirmar na implementação a sintaxe de bloco com `@slot` do Tailwind v4
instalado.

### Cards claros

8 arquivos novos `public/hero/card-0N-light.svg`, derivados dos escuros por
substituição de cor (a mesma receita do mockup aprovado):

| No escuro | No claro |
| --- | --- |
| fundo `#0c1424` | `#ffffff` |
| linhas e pontos `#ffffff` | `#0b1220`, mesma opacidade (pontos: 0.07 → 0.06) |
| `#e2e8f0` | `#334155` |
| `#61dafb` | `#1b9ccb` |
| linhas de marca `fill-opacity="0.85"` | `0.42` |
| brilho `stop-opacity` 0.55 / 0.12 | 0.20 / 0.08 |

## 2. Aplicar o tema sem piscar

### Por que um script inline

As páginas são geradas no build, iguais para todos, e o servidor não sabe a
escolha. Num `useEffect`, a pessoa veria o tema errado até o React carregar.
Um `<script>` inline no `<head>` roda enquanto o navegador lê o HTML, antes
de pintar. Ele faz uma coisa só:

```js
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
})();
```

"Sistema" ou nada salvo = sem atributo, e o CSS segue o SO. O `try/catch`
cobre o storage bloqueado (aba anônima, cookies desligados).

### Arquivos em `src/theme/`

Mesmo desenho do `src/i18n/`:

```
src/theme/
├── themes.ts              # lista, tipo, chave do storage, isTheme()
├── themes.test.ts
├── theme-script.ts        # texto do script inline
├── theme-script.test.ts
├── theme-store.ts         # cliente: ler, salvar, avisar, aplicar no <html>
├── fade-theme-change.ts   # cliente: fade com View Transitions
├── use-theme.ts           # hook [theme, setTheme]
└── theme-sync.tsx         # cliente: reaplica o tema salvo depois do React
```

- **`themes.ts`**: `themes = ["system", "light", "dark"] as const`,
  `type Theme`, `THEME_STORAGE_KEY = "theme"`, `isTheme(value)`. Puro.
  Importa com extensão `.ts` e sem `@/`, como os arquivos testados do i18n.
- **`theme-script.ts`**: exporta a string do script, montada a partir das
  constantes de `themes.ts` (valores entram com `JSON.stringify`).
- **`theme-store.ts`**:
  - `readTheme(): Theme`. Lê o storage; valor inválido, ausente ou erro vira
    `"system"`.
  - `saveTheme(theme)`. `"system"` apaga a chave; os outros gravam.
  - `applyTheme(theme)`. Põe ou tira `data-theme` do `<html>` e ajusta as
    `<meta name="theme-color">`: escolha forçada = as duas com a cor de
    `page` daquele tema; `"system"` = cada uma com a cor da sua `media`.
  - `subscribeTheme(callback)`. Para o `useSyncExternalStore`; avisado a
    cada `saveTheme`.
- **`fade-theme-change.ts`**: `fadeThemeChange(update)`.
  - Sem `document.startViewTransition` ou com
    `prefers-reduced-motion: reduce`: chama `update()` direto.
  - Senão: `document.startViewTransition(update)`.
  - Nos dois caminhos, marca `<html data-theme-switching>` durante a troca.
    Uma regra CSS desliga todas as `transition` enquanto a marca existe; sem
    isso, cada link com `transition-colors` desbota no seu ritmo.
- **`use-theme.ts`**: `useTheme(): [Theme, (theme: Theme) => void]`.
  - `useSyncExternalStore(subscribeTheme, readTheme, () => "system")`. O
    servidor sempre responde `"system"`; o navegador, o valor salvo. O React
    sabe lidar com essa diferença na hidratação sem erro.
  - `setTheme` = `fadeThemeChange(() => { saveTheme(t); applyTheme(t); })`.
- **`theme-sync.tsx`**: componente cliente que não desenha nada.
  `useLayoutEffect(() => applyTheme(readTheme()), [])`.
  - No modo dev, o Strict Mode remonta o `<html>` e apaga o atributo que o
    script pôs. Isto põe de volta antes da pintura. Em produção não muda nada
    visível.
  - Acerta a `<meta name="theme-color">` depois da hidratação.

CSS do fade, em `globals.css`:

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 250ms;
}

[data-theme-switching] *,
[data-theme-switching] *::before,
[data-theme-switching] *::after {
  transition: none !important;
}
```

### Layout e telas de erro

- **`app/[lang]/layout.tsx`**:
  - `<html suppressHydrationWarning>`: o script mexe no `<html>` antes do
    React, e isto diz ao React para aceitar o que está no DOM;
  - `<head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>`;
  - `<ThemeSync />` no começo do `<body>`;
  - `viewport.colorScheme: "light dark"`;
  - `viewport.themeColor`: duas entradas, uma por `prefers-color-scheme`,
    com a cor de `page` de cada tema.
- **`app/global-error.tsx`**: desenha o próprio `<html>` depois que a página
  já carregou, e script inserido pelo React não roda. Usa só o
  `<ThemeSync />`, mais `suppressHydrationWarning` no `<html>`.
- **`lib/theme-colors.ts`**: ganha `pageLight: "#f4f7fb"` (a barra do
  navegador no claro). O restante continua servindo à imagem de OG e ao
  manifest, que ficam escuros.

### Custo aceito

Com escolha forçada diferente do SO, a cor da barra do navegador (Chrome no
Android) só acerta depois da hidratação, uns décimos de segundo. A página
não pisca. Resolver isso no script inline dependeria da ordem das tags no
`<head>`, que o Next controla.

### Sem JavaScript

"Sistema" continua funcionando (é só CSS). O grupo "Tema" some do painel com
`@media (scripting: none)`, a mesma técnica que a intro usa.

### Troca de idioma

A troca de idioma é navegação no cliente dentro do mesmo layout raiz, então o
`<html>` (e o `data-theme`) continua o mesmo. Confirmar no navegador.

## 3. Seletor no painel

### Arquivos

```
src/components/preferences/
└── theme-switch.tsx   # cliente: controle segmentado
src/components/ui/
├── monitor-icon.tsx
├── sun-icon.tsx
└── moon-icon.tsx
```

### `theme-switch.tsx`

- **HTML nativo:** `<fieldset>` com `<legend>` "Tema" e três
  `<input type="radio" name="theme">`, cada um dentro do seu `<label>`. O
  navegador cuida de Tab (entra no grupo), setas (trocam a opção) e do anúncio
  no leitor de tela ("Claro, botão de opção, 2 de 3"). Nenhum `role` ou
  `aria-*` inventado.
- **Visual:** o `<input>` fica `sr-only`; o `<label>` desenha o segmento, com
  `has-[:checked]` e `has-[:focus-visible]`. O anel de foco (`highlight`, 2px)
  fica no segmento inteiro.
- **Estado marcado não depende só de cor.** O segmento marcado tem fundo
  elevado (`surface`), borda com pelo menos 3:1 contra a faixa, texto `fg` (os
  outros `fg-muted`) e ícone colorido.
- **Tamanho:** cerca de 61×48px por segmento (painel de 224px), acima dos
  44×44 do AAA (2.5.5).
- **Props:** `legend` e `labels: Record<Theme, string>`, vindos do
  dicionário pelo `preferences-menu.tsx` (server). Os dicionários continuam
  só no servidor.
- **Comportamento:** `onChange` chama `setTheme`. O painel continua aberto e
  o foco continua no rádio; não precisa do truque de devolver o foco que o
  seletor de idioma usa, porque não há navegação.
- **Hidratação:** o servidor marca "Sistema". Com JS, logo depois de
  hidratar, o hook devolve o valor salvo e o rádio certo fica marcado. É
  invisível, porque o painel começa fechado.

### Ícones

Um arquivo por ícone, no formato do `sliders-icon.tsx`. SVG inline com
`stroke="currentColor"` e `aria-hidden` (o texto ao lado já diz o que é).

### `preferences-menu.tsx`

- Grupo "Tema" abaixo de "Idioma", com o `<ThemeSwitch />`.
- `bg-ink-800` → `bg-surface`; `shadow-black/40` no escuro e a sombra leve
  da seção 1 no claro.

### `preferences-menu.module.css`

- Esconde o grupo "Tema" com `@media (scripting: none)`.

### Dicionários

```ts
preferences: {
  // ...o que já existe
  theme: "Tema",               // en: "Theme"
  themes: {
    system: "Sistema",         // en: "System"
    light: "Claro",            // en: "Light"
    dark: "Escuro",            // en: "Dark"
  },
},
```

## 4. Mudanças nos componentes existentes

| Arquivo | Mudança |
| --- | --- |
| `app/globals.css` | tokens com `light-dark()`; `color-scheme`; variantes `light:`/`dark:`; `bg-stack-glow`, `title-glow` e `subtitle-glow`; foco em `highlight`; CSS do fade |
| `app/[lang]/layout.tsx` | ver seção 2; `bg-ink-900` → `bg-page` |
| `app/global-error.tsx` | ver seção 2; `bg-ink-900` → `bg-page` |
| `components/hero/hero-grid.tsx` | `bg-ink-800` → `bg-surface` |
| `components/hero/hero-grid.module.css` | vinheta com `light-dark()` |
| `data/hero-cards.ts` | cada card ganha `lightSrc` |
| `components/hero/hero-card.tsx` | duas `<Image>`: a escura com `light:hidden`, a clara com `dark:hidden`. As duas `loading="eager"`, para o `useImagesReady` da intro esperar imagens que de fato carregam |
| `public/hero/card-0N-light.svg` | 8 arquivos novos (seção 1) |
| `components/hero/hero-title.tsx` | subtítulo com `from-gradient-from via-gradient-via to-gradient-to` e `subtitle-glow` no lugar do `drop-shadow` fixo |
| `components/hero/hero-info.tsx` | `hover:text-react` → `hover:text-highlight`; links sociais mantêm `min-h-11` no desktop (sai o `md:min-h-0`), para os 44px do AAA 2.5.5 |
| `components/hero/hero-spotlight.tsx` | intensidade das camadas no claro, calibrada no navegador |
| `components/ui/button-styles.ts` | brilho do botão com a variante `light:` |
| `components/ui/logo.tsx` | contornos com `stroke="currentColor"`: na página, a logo herda o `text-fg` do `<body>` (navbar e preloader não mudam) |
| `app/[lang]/opengraph-image.tsx` | passa a cor fixa para a logo (a imagem continua escura) |
| `lib/theme-colors.ts` | ganha `pageLight` |
| `README.md` | estrutura (`src/theme/`), tokens e roadmap (marca o tema como feito) |

**Risco a confirmar:** a imagem de OG é gerada pelo Satori, que implementa só
parte do CSS. Se ele não aceitar `currentColor` no SVG, a logo ganha uma prop
de cor, com `var(--color-fg)` como padrão, e a OG passa o hex.

**Sem mudança** (seguem os tokens sozinhos): `status-page.tsx`,
`navbar.tsx`, `language-switch.tsx`, `status-dot.tsx`, `intro.tsx`,
`preloader.tsx`.

## 5. Arquivos (resumo)

**Novos**

- `src/theme/themes.ts`, `theme-script.ts`, `theme-store.ts`,
  `fade-theme-change.ts`, `use-theme.ts`, `theme-sync.tsx`
- `src/theme/themes.test.ts`, `theme-script.test.ts`
- `src/components/preferences/theme-switch.tsx`
- `src/components/ui/monitor-icon.tsx`, `sun-icon.tsx`, `moon-icon.tsx`
- `public/hero/card-01-light.svg` … `card-08-light.svg`

**Alterados**

- `src/app/globals.css`, `src/app/[lang]/layout.tsx`,
  `src/app/global-error.tsx`, `src/app/[lang]/opengraph-image.tsx`
- `src/components/hero/hero-grid.tsx`, `hero-grid.module.css`,
  `hero-card.tsx`, `hero-title.tsx`, `hero-info.tsx`, `hero-spotlight.tsx`
- `src/components/preferences/preferences-menu.tsx`,
  `preferences-menu.module.css`
- `src/components/ui/logo.tsx`, `button-styles.ts`
- `src/data/hero-cards.ts`, `src/lib/theme-colors.ts`
- `src/i18n/dictionaries/pt-br.ts`, `en.ts`
- `README.md`

## 6. Testes e verificação

### Automatizados

`pnpm test` (mesmo esquema do i18n, sem dependência nova).

`themes.test.ts`:

- `isTheme("system")`, `("light")`, `("dark")` → `true`
- `isTheme("blue")`, `("")`, `(null)` → `false`

`theme-script.test.ts` roda a string do script com um `<html>` e um
`localStorage` falsos:

| Salvo no storage | Resultado |
| --- | --- |
| `light` | `data-theme="light"` |
| `dark` | `data-theme="dark"` |
| `system` | sem atributo |
| nada | sem atributo |
| `blue` | sem atributo |
| `getItem` lança erro | não quebra, sem atributo |

### No navegador (agent-browser)

`set media dark|light` simula o SO; `set media ... reduced-motion`, o
"reduzir movimento".

- **Sem piscar:** gravar o carregamento (`record start ... --contact-sheet`)
  e conferir os primeiros quadros em: claro forçado com SO escuro; escuro
  forçado com SO claro; "Sistema" com SO claro e com SO escuro.
- **"Sistema" ao vivo:** com a página aberta, trocar o SO emulado; o site
  acompanha sem recarregar.
- **Troca pelo painel:** o fade acontece; com "reduzir movimento" não; a
  intro não repete; a rolagem não muda; o painel fica aberto; F5 mantém a
  escolha; "Sistema" tira o atributo.
- **Troca de idioma** com tema forçado: o tema continua.
- **Teclado:** Tab entra no grupo, setas trocam o tema, anel de foco visível
  no segmento.
- **Contraste AAA na tela:** amostrar os pixels atrás do título, do subtítulo
  (nos três trechos do gradiente) e dos textos `fg-muted`, nos dois temas e em
  320px, 375px e desktop. Mínimo 7:1 (normal) e 4.5:1 (grande). Se falhar em
  cima da colagem, reforçar a vinheta ou o halo, não mudar a cor do texto.
- **Telas:** 320px, 375px e desktop; o painel com o segmentado não estoura;
  o hero claro no celular (grade de 2 colunas) fica legível.
- **404 e erro** nos dois temas.
- **Modo dev:** o tema forçado sobrevive à remontagem do Strict Mode.
- **Barra do navegador:** as `<meta name="theme-color">` mudam de conteúdo
  com a escolha (conferir no DOM).
- **Sem JavaScript:** o agent-browser não desliga JS. Conferir que o HTML
  estático sai sem `data-theme` e que a regra `@media (scripting: none)` está
  no CSS gerado.

### Build

- `pnpm build`: `/pt-br` e `/en` continuam páginas estáticas.
- `pnpm lint` e `pnpm test` passam.

### Depois do deploy

- PageSpeed em `/pt-br` e `/en` (não o Lighthouse local), comparando com a
  nota de antes. O script inline tem cerca de 200 bytes.

## Critérios de aceite

1. As três opções funcionam, a escolha sobrevive ao F5 e "Sistema" é o
   padrão.
2. Nenhum tema errado aparece no carregamento, em nenhuma combinação de
   escolha e sistema.
3. Todo texto passa AAA nos dois temas, medido na tela.
4. As páginas continuam estáticas e nenhuma dependência nova entra em
   `package.json`.
5. `pnpm test`, `pnpm lint` e `pnpm build` passam.
6. Cada arquivo novo tem uma responsabilidade só, e os conceitos novos
   (`light-dark()`, `color-scheme`, script inline, `useSyncExternalStore`,
   View Transitions, `@custom-variant`) estão explicados em comentários curtos
   no código.
