# Seção de Projetos com scroll cinematográfico — Design

- **Data:** 2026-09-25
- **Status:** aprovado na conversa, aguardando revisão desta spec
- **Branch:** `feat/projects`

## Objetivo

Criar a seção **Projetos** (`#projects`) da home. O link da navbar e o botão
"Ver projetos" do hero passam a levar a algum lugar.

A entrada é controlada pelo scroll vertical, numa área fixada na tela:

1. O hero diminui (`scale 1 → 0.75`) e some (`opacity 1 → 0`). Ao mesmo tempo, o
   fundo da seção nova aparece (`opacity 0 → 1`).
2. Os cards sobem de baixo para cima.
3. O scroll vertical passa a mover a fileira de cards na horizontal
   (`translateX`), com a distância calculada pela largura real da fileira.
4. Depois do último card, a área solta e a página segue para baixo.

Tudo volta ao rolar para cima. Não tem scroll horizontal na página, nem
carrossel, nem autoplay. As animações usam só `transform` e `opacity`.

Também é o primeiro uso do ScrollTrigger no projeto. O código explica cada
conceito (pin, scrub, start/end, labels, valores em função,
`invalidateOnRefresh`) nos comentários, como a intro já faz.

## Decisões tomadas

| Pergunta | Decisão |
| --- | --- |
| Fundo que aparece quando o hero some? | **CSS** (`bg-projects-glow`): pontinhos e brilhos das cores de marca, da mesma família do `bg-stack-glow`, com a luz em outro lugar. Versão clara e escura. Sem arquivo novo. |
| Conteúdo? | **Os 4 projetos reais** (seção 4), na ordem da lista. |
| Imagens? | **Nenhuma.** Os cards são só texto, bem tipográficos. |
| Celular? | **Mesmo efeito** em todas as telas. No celular, cada card ocupa ~85% da largura. |
| Arquitetura? | **Um palco só, fixado com o `pin` do ScrollTrigger**, com hero e Projetos sobrepostos e uma timeline com `scrub`. |
| Quem escolhe o layout? | **O CSS** (`@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`), para não ter salto de layout na hidratação. |
| Barra de progresso do slide? | **Não.** O próprio movimento dos cards já mostra que tem mais conteúdo. |
| "current" na lista de projetos? | Vira **"Em andamento" / "Ongoing"**. |

## Fora do escopo

- Seções Sobre e Contato. Hoje não tem nada depois de Projetos: quando o pin
  solta, a página acaba.
- Imagens ou prints dos projetos. Quando chegarem, o card ganha espaço para a
  capa, numa mudança à parte.
- `snap` (parar sempre com um card alinhado). Não foi pedido, e prender o scroll
  pode incomodar.
- Página própria para cada projeto.

## 1. Estrutura

```
src/
├── data/projects.ts                  # id, ano, stack, link e tipo do link (site/código)
├── i18n/dictionaries/{pt-br,en}.ts   # + bloco "projects"
├── components/projects/
│   ├── projects.tsx                  # server: <section id="projects">, fundo, título, fileira
│   ├── project-card.tsx              # server: um card
│   ├── projects-stage.tsx            # client: palco; recebe <Hero/> e <Projects/> por children e liga o GSAP
│   └── projects-stage.module.css     # layouts cinema e estático
├── animations/
│   ├── projects-targets.ts           # nomes dos data-attributes (mesmo padrão do intro-targets)
│   ├── projects-scroll.ts            # timeline com scrub (sem JSX)
│   ├── track-travel.ts               # contas puras: distância da fileira, posição de cada card
│   ├── track-travel.test.ts
│   └── projects-focus.ts             # teclado e âncora #projects levam ao ponto certo
├── lib/gsap.ts                       # + registra o ScrollTrigger
└── app/
    ├── globals.css                   # + utility bg-projects-glow
    └── [lang]/page.tsx               # <ProjectsStage><Hero /><Projects /></ProjectsStage>
```

- `Hero` e `Projects` continuam server components. O `ProjectsStage` é o único
  client novo e recebe os dois por `children`, do mesmo jeito que o `<Intro>`
  recebe a página.
- O pin do GSAP embrulha o elemento fixado numa div (`pin-spacer`). O
  `ProjectsStage` fixa uma div interna dele, e não um nó que o React reordena.
  Assim o React não perde o controle do DOM, e o `useGSAP` desfaz tudo ao
  desmontar.
- Os componentes marcam o que a animação mexe com `data-projects={PROJECTS.x}`
  (`projects-targets.ts`), e a timeline encontra os elementos pelo nome. É o
  mesmo padrão do `data-intro`.
- O `<section>` do hero ganha a marca da camada que diminui e some. O conteúdo
  dele não muda.

## 2. Os dois layouts

O layout vem do CSS, e não do JS, para a página já nascer no formato certo. Se
o JS trocasse o layout na hidratação, os elementos pulariam de lugar (CLS). O
`gsap.matchMedia()` usa a mesma media query, então CSS e animação ligam e
desligam juntos, inclusive se a preferência mudar com a página aberta.

### Cinema

Vale em `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`.

- O palco é um `display: grid` com as duas seções na mesma célula
  (`grid-area: 1 / 1`). Projetos fica por cima.
- A seção de Projetos tem `height: 100svh` e fica presa ao pé do palco
  (`align-self: end`). Se o hero for mais alto que a tela (celular deitado), os
  Projetos ocupam exatamente a tela quando o pin engata (ver `start`, seção 3).
- Estado inicial pelo CSS, antes do GSAP: Projetos com `opacity: 0` e
  `pointer-events: none`. **Nunca `visibility: hidden`**, porque os cards
  precisam continuar alcançáveis pelo Tab (seção 5).
- O palco tem `overflow: clip`, então os cards abaixo e à direita não geram
  scroll. É `clip`, e não `hidden`, para o palco não virar um container de
  scroll.
- Dentro da seção: o título no alto, abaixo da navbar fixa, e a fileira
  (`display: flex`, `width: max-content`) centralizada no espaço que sobra.

### Estático

Vale para "reduzir movimento" ou sem JS.

- O hero fica como hoje, e os Projetos vêm embaixo, no fluxo normal, com o
  mesmo fundo.
- Os cards ficam em grade: 1 coluna no celular, 2 a partir de 48rem.
- Não tem pin nem animação de scroll. A âncora `#projects` funciona sozinha,
  com `scroll-margin-top` para a navbar fixa não cobrir o título.

## 3. A timeline

### ScrollTrigger do palco

| Opção | Valor | Por quê |
| --- | --- | --- |
| `trigger` | a div fixada do palco | |
| `pin` | `true` | Segura o palco na tela enquanto a timeline toca. |
| `start` | `"bottom bottom"` | Começa quando o pé do palco encosta no pé da tela. Com o hero da altura da tela, dá no mesmo que `"top top"`. Com o hero mais alto, a pessoa vê o hero inteiro antes do pin. |
| `end` | `() => "+=" + comprimento` | Uma parte fixa em alturas de tela (fases `reveal` e `rise`) mais a distância real da fileira. Recalculado a cada refresh. |
| `scrub` | `1` | A timeline segue o scroll com 1s de atraso suave (o "cinema"). Rolar para cima desfaz tudo. |
| `invalidateOnRefresh` | `true` | No resize ou na rotação, as funções (`x`, `end`) são recalculadas. |
| `anticipatePin` | `1` | Evita o tranco quando o pin engata. |

A barra de endereço do celular não dispara refresh: o `ignoreMobileResize` do
ScrollTrigger já vem ligado. O palco usa `svh`, que não muda com a barra.

### Fases (labels)

1. **`reveal`**
   - O `<section>` do hero vai para `scale: 0.75, opacity: 0`, com a origem no
     centro.
   - Junto (`"<"`), a seção de Projetos, dona do fundo, vai para `opacity: 1`.
   - No fim da fase, `tl.set(hero, { pointerEvents: "none" })`. Senão um clique
     no vazio acertaria o "Ver projetos", que continua lá invisível. O `set`
     dentro da timeline se desfaz sozinho quando o scroll volta.
2. **`rise`**
   - No começo, `tl.set(projetos, { pointerEvents: "auto" })`.
   - O título e os cards sobem de baixo da tela até o lugar
     (`y: altura da tela → 0`), com `stagger`.
3. **`slide`**
   - A fileira vai de `x: 0` até `x: () => -distância`, com `ease: "none"`:
     velocidade constante, colada ao scroll.
   - No fim, um respiro curto (tween vazio) antes de o pin soltar.

As durações das fases e o `ease` do `reveal` e do `rise` são calibrados no
navegador. O objetivo é que, numa tela comum, a fileira ande perto de 1px por
pixel rolado e o `reveal` ocupe mais ou menos meia tela de scroll.

`will-change: transform` só na fileira e só no modo cinema.

### A conta do `translateX` (`track-travel.ts`)

```ts
/** Quanto a fileira precisa andar para o último card chegar na margem direita. */
trackTravel(larguraDaFileira, larguraDoPalco) = Math.max(0, larguraDaFileira - larguraDoPalco)
```

- A largura do palco é o `clientWidth`, e não `window.innerWidth`. A
  `innerWidth` inclui a barra de rolagem do desktop, e a fileira pararia ~15px
  fora do lugar.
- A fileira tem padding nas duas pontas igual ao da navbar
  (`clamp(1.25rem, 3vw, 5rem)`). No começo, o primeiro card fica alinhado à
  margem esquerda; no fim, o último fica alinhado à direita.
- Com distância 0 (a fileira cabe na tela), o slide vira só uma pausa.
- Larguras dos cards, definidas pelo CSS e não pelo conteúdo: ~85% da tela no
  celular, ~60% a partir de 48rem e ~34% a partir de 64rem. Com 4 cards sempre
  sobra fileira para andar, até em 2540px. Como não depende da fonte, a largura
  não muda quando as fontes carregam.

## 4. Conteúdo e visual

### Dados (`src/data/projects.ts`)

O que não muda com o idioma:

```ts
type ProjectData = {
  id: "almeytour" | "mognus" | "blizzard" | "ecommerce-ddd";
  year: number | "ongoing";
  stack: string[];
  link: { href: string; kind: "site" | "code" };
};
```

| id | year | link | kind |
| --- | --- | --- | --- |
| `almeytour` | `"ongoing"` | https://almeytour.com/ | `site` |
| `mognus` | `2025` | https://github.com/smartinsdev/mognus-company | `code` |
| `blizzard` | `2024` | https://github.com/smartinsdev/blizzardco | `code` |
| `ecommerce-ddd` | `"ongoing"` | https://github.com/smartinsdev/backend-ecommerce-portfolio | `code` |

Stack:

1. Next.js · TypeScript · Tailwind CSS 4 · Framer Motion · Vitest · Playwright
2. Next.js 16 · TypeScript · Tailwind CSS 4 · next-intl 4 · Zod
3. Next.js 16 · TypeScript 7 · Tailwind CSS 4 · shadcn/ui · React Hook Form · Prisma
4. TypeScript · Node.js · CI · Biome

### Textos (dicionários)

```ts
projects: {
  title: "Projetos" | "Projects",
  ongoing: "Em andamento" | "Ongoing",
  viewSite: "Ver site" | "View site",
  viewCode: "Ver código" | "View code",
  items: { [id]: { name, description } },
}
```

O "abre em nova aba" reaproveita `hero.newTab`.

| id | Nome PT / EN | Descrição PT | Descrição EN |
| --- | --- | --- | --- |
| `almeytour` | Almeytour | Site de marketing e conversão para transfers de aeroporto e tours privados na Europa, com foco em Paris. Apresenta serviços, depoimentos e experiências exclusivas, e leva o visitante a falar com a equipe pelo WhatsApp. | Marketing and conversion website for airport transfers and private tours in Europe, focused on Paris. It presents services, testimonials and exclusive experiences, and guides visitors to reach the team on WhatsApp. |
| `mognus` | Mognu's Company | Site institucional multilíngue de uma marcenaria de móveis sob medida: empresa, serviços, projetos selecionados e contato, numa interface responsiva pensada para visitantes de outros países. | Multilingual corporate website for a custom carpentry and furniture business: company, services, selected projects and contact, in a responsive interface built for international visitors. |
| `blizzard` | Blizzard Conquer | Portal de uma comunidade de MMORPG de fantasia: landing page temática, cadastro e login no banco de dados do jogo, rotas protegidas por sessão e central de downloads do cliente. | Web portal for a fantasy MMORPG community: themed landing page, registration and login against the game database, session-protected routes and a download hub for the game client. |
| `ecommerce-ddd` | Back-end de e-commerce com DDD / E-commerce Back-end with DDD | Protótipo de back-end em Node.js e TypeScript que demonstra DDD, Clean Architecture, SOLID, TDD e inversão de dependência, com fronteiras claras entre as camadas. | Node.js and TypeScript back-end prototype that demonstrates DDD, Clean Architecture, SOLID, TDD and dependency inversion, with clear boundaries between layers. |

### Card

```
┌───────────────────────────────────┐
│ 01                  Em andamento  │  número (font-display, grande) · ano (font-mono)
│                                   │
│ Almeytour                         │  <h3> (font-display)
│ Site de marketing e conversão...  │  descrição (fg-muted)
│                                   │
│ [Next.js] [TypeScript] [Tailwind] │  chips (font-mono, pequenos, ring-line)
│ ───────────────────────────────── │
│ Ver site ↗                        │  link
└───────────────────────────────────┘
```

- **Moldura:** `bg-surface`, `ring-1 ring-line`, `rounded-xl`, igual à moldura
  da colagem. Os cards da fileira têm a mesma altura.
- **O card inteiro é clicável:** o link tem um `::after` em `inset-0`, mas
  continua sendo um link só. Nome acessível: "Ver site" + `sr-only` ", Almeytour"
  + `sr-only` "(abre em nova aba)". Abre com `target="_blank" rel="noreferrer"`,
  como os links sociais.
- **Hover:** a borda vai para `highlight` e a seta dá um passinho, como nos
  links sociais do hero.
- **Semântica:** `<section id="projects" aria-labelledby>` com `<h2>`, os cards
  num `<ol>`, `<h3>` por projeto. O número "01" é decorativo (`aria-hidden`); a
  ordem já vem do `<ol>`.
- **Título da seção:** "Projetos" com a contagem "(04)" em mono ao lado
  (`aria-hidden`, porque o `<ol>` já informa a quantidade).
- **Tamanhos:** `clamp()` com `vw` e `svh`, para caber de 320px a 2540px e em
  telas baixas (844×390). Se não couber, a fonte diminui com media query de
  altura. Nunca cortar texto.

### Fundo (`bg-projects-glow`)

Utility nova no `globals.css`, ao lado de `bg-stack-glow`: fundo `page`,
pontinhos iguais aos do hero, um brilho `react` (ciano) no alto e um `ts`
(azul) embaixo à direita. Os valores exatos saem da calibração no navegador,
com `light-dark()`.

### Contraste

Todo texto novo passa AAA (7:1 normal, 4.5:1 para texto ≥ 24px regular) nos
dois temas, medido na tela contra o pior pixel do fundo, de 320 a 1440px. O
título da seção fica sobre o fundo com brilhos; o texto dos cards fica sobre
`surface` liso. Os prints de antes e depois são mostrados antes do commit.

## 5. Acessibilidade e casos de borda

### Âncora `#projects` (`projects-focus.ts`)

No modo cinema, a seção fica em cima do hero, no topo do palco, e o pulo
normal da âncora não levaria a lugar nenhum. O JS intercepta os cliques em
`a[href="#projects"]`:

1. Rola suave (`window.scrollTo({ behavior: "smooth" })`) até
   `scrollTrigger.labelToScroll("slide")`, o ponto em que os cards já chegaram.
   Quem sai do topo vê a transição inteira.
2. Põe `#projects` na URL com `history.pushState`, como faria a âncora normal.
3. Leva o foco para o `<h2>` (`tabindex="-1"`, `preventScroll: true`), para
   quem usa teclado ou leitor de tela cair na seção.

Quem abre `/pt-br#projects` direto cai no mesmo ponto, sem animar o caminho.
O `scrub: 1` faria a timeline correr 1s atrás do scroll, então o tween do
scrub (`scrollTrigger.getTween()`) é completado na hora com `progress(1)`.
No modo estático o JS não intercepta nada.

### Teclado

- A camada de Projetos só usa `opacity`, então o Tab sempre alcança os cards:
  navbar → hero → cards.
- Quando o foco entra num card (`focusin`), a página rola até o ponto em que
  ele aparece inteiro. O `overflow: clip` impede o navegador de rolar para o
  lado sozinho, e sem isso o foco iria para um card fora da tela. A posição sai
  de uma função pura em `track-travel.ts` (esquerda do card − padding ÷
  distância → progresso do slide → posição do scroll, com limites).
- Quando o foco volta para o hero (Shift+Tab), a página volta para o começo do
  pin.

### Outros casos

- **Hero mais alto que a tela:** resolvido pelo `start: "bottom bottom"` e pela
  seção presa ao pé do palco.
- **Resize e rotação:** valores em função com `invalidateOnRefresh`.
- **Sem scroll horizontal:** `overflow: clip` no palco. A verificação confere
  `scrollWidth === clientWidth` em todas as larguras.
- **Intro:** o scroll mexe no `<section>` do hero, e a intro mexe nos filhos
  dele, então uma não briga com a outra. Rolar durante a intro acelera a intro,
  como já acontece hoje.
- **Troca de idioma ou de tema:** o `useGSAP` desfaz o pin e a timeline ao
  desmontar. A troca de tema não mexe na animação.
- **Leitor de tela:** todo o conteúdo fica no DOM o tempo todo, na ordem hero →
  projetos.

## 6. Testes e verificação

1. **`node:test`** para `track-travel.ts`, escritos antes do código: distância
   normal, distância 0, posição de cada card e limites (primeiro card, último
   card, fileira que cabe na tela).
2. `pnpm lint`, `pnpm test` e `pnpm build`.
3. **agent-browser**, com prints em cada fase (topo, meio do `reveal`, `rise`,
   começo, meio e fim do `slide`, e depois do pin):
   - larguras 320, 390, 844×390, 768, 1440 e 2540, nos dois temas;
   - scroll para cima desfazendo tudo;
   - "reduzir movimento" emulado (layout estático);
   - Tab pelos cards e volta para o hero;
   - clique na âncora e abertura direta com `#projects`;
   - `scrollWidth === clientWidth` em todas as larguras.
4. **Contraste AAA** medido na tela com o script do sharp.
5. **PageSpeed** no preview da Vercel depois do push. O Lighthouse local dá
   número falso no mobile.
6. README: tirar Projetos e ScrollTrigger de "O que falta", citar o
   ScrollTrigger na stack e os arquivos novos na estrutura.
