# Sinval Martins — Portfólio

Portfólio pessoal de Sinval Martins, desenvolvedor full stack. A home abre com uma intro animada inspirada no site do GTA VI: a logo é desenhada no preloader e voa até a navbar, uma colagem de cards converge para o centro, o nome entra palavra por palavra e, por último, aparecem os links da navbar e as informações de contato. Rolando a página, o hero diminui e some enquanto o fundo muda, os cards de projetos sobem, e o scroll vertical passa a mover a fileira de cards para o lado.

O site existe em português e inglês: `/pt-br` e `/en`.

Tem tema claro e escuro: segue o sistema operacional ou a escolha feita no painel de preferências.

> Em construção: hoje a home tem o hero e a seção de Projetos. Veja [o que falta](#o-que-falta).

## Stack

| Ferramenta | Para quê |
| --- | --- |
| [Next.js 16](https://nextjs.org) (App Router, Turbopack) | Framework. A página é pré-renderizada como estática. |
| [React 19](https://react.dev) | Interface. Quase tudo é server component; só a intro, a luz do hero, o palco dos projetos, o fundo da navbar, os seletores de idioma e de tema e as telas de erro rodam no cliente. |
| [TypeScript](https://www.typescriptlang.org) | Tipagem. |
| [Tailwind CSS v4](https://tailwindcss.com) | Estilos. Cores, fontes e animações ficam como tokens no `@theme` do `globals.css`; cada cor que muda com o tema tem os dois valores em `light-dark()`. |
| [GSAP](https://gsap.com) + [`@gsap/react`](https://gsap.com/resources/React) | Animações: timeline da intro, desenho da logo (`DrawSVGPlugin`), voo da logo até a navbar (`Flip`), luz que segue o mouse (`quickTo`), passagem do hero para os projetos (`ScrollTrigger`, com `pin` e `scrub`) e versão reduzida para quem ativa "reduzir movimento" (`matchMedia`). |
| `next/font` | Fontes servidas pelo próprio site: Source Serif 4 (títulos), Geist (texto) e Geist Mono (detalhes). |
| `next/image` | Imagens da colagem. |
| `next/og` | Imagem de compartilhamento, gerada no build com a logo e as fontes do site. |
| `proxy.ts` + `next/root-params` | Idiomas sem biblioteca: o proxy manda `/` para `/pt-br` ou `/en`, e os server components descobrem o idioma sem receber props. |
| `node:test` | Testes das funções de idioma, de tema, das contas da fileira de projetos e do "clique simples", com o Node rodando TypeScript direto. |
| [Biome](https://biomejs.dev) | Lint e formatação. |
| [pnpm](https://pnpm.io) | Gerenciador de pacotes. |

## Como rodar

Precisa de Node.js 22.18 ou mais novo (o `pnpm test` roda TypeScript direto no Node) e pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Outros comandos:

```bash
pnpm build      # build de produção
pnpm start      # serve o build
pnpm lint       # checa lint e formatação (Biome)
pnpm format     # formata o código
pnpm test       # testes das funções puras (node --test)
```

### Variáveis de ambiente

| Variável | Para quê |
| --- | --- |
| `SITE_URL` | Endereço público do site (ex.: `https://meudominio.dev`). Entra no `robots.txt`, no `sitemap.xml`, na URL canônica e na imagem de compartilhamento. É lida no build. |

Na Vercel ela é opcional: sem ela, o site usa o domínio de produção do projeto. Fora da Vercel, defina antes do `pnpm build`, senão essas URLs apontam para `http://localhost:3000`.

## Idiomas

Quem abre `/` é redirecionado pelo `src/proxy.ts`. Vale primeiro o idioma escolhido no painel de preferências (cookie `locale`), depois o idioma do navegador e, por último, o inglês.

- Os textos ficam em `src/i18n/dictionaries/`. O `pt-br.ts` define o formato, e o `en.ts` precisa ter as mesmas chaves: o TypeScript acusa se faltar ou sobrar alguma.
- Server components leem os textos com `getDictionary()` (`src/i18n/get-dictionary.ts`), sem receber o idioma por props.
- As telas de erro rodam no navegador e usam `src/i18n/error-texts.ts`.
- Para divulgar o site, use `smartins.dev/pt-br` ou `smartins.dev/en`: o endereço sem idioma passa por um redirecionamento.

## Tema

O painel de preferências tem três opções: **Sistema** (o padrão), **Claro** e **Escuro**.

- As cores ficam em `src/app/globals.css`. Cada cor que muda com o tema é declarada uma vez, com os dois valores: `light-dark(claro, escuro)`. Quem escolhe o lado é o `color-scheme` do `<html>`: `light dark` segue o sistema; `data-theme="light"` ou `"dark"` força um lado.
- A escolha fica no `localStorage` (chave `theme`). Um script inline no `<head>` (`src/theme/theme-script.ts`) aplica a escolha antes da primeira pintura, então o tema errado não pisca.
- Para o que não é cor, use as variantes `light:` e `dark:` (ex.: `light:hidden`). Elas seguem a mesma regra: escolha forçada primeiro, sistema depois.
- Todo texto passa AAA (7:1) nos dois temas, medido na tela contra o pior pixel do fundo (pontinhos, brilhos e colagem incluídos), de 320 a 1440px. O subtítulo do hero fica em cima da colagem e depende da almofada atrás dele: a névoa do `hero-grid.module.css` e o `subtitle-glow`. Ao criar uma cor nova, ou mexer nessa almofada, confira o contraste nos dois temas.
- Os cards da colagem têm uma versão por tema (`public/hero/card-NN.svg` e `card-NN-light.svg`).
- A imagem de compartilhamento e o manifest são sempre escuros.

## Projetos

A lista fica em `src/data/projects.ts` (ano, stack e link) e nos dicionários (`projects.items`: nome e descrição em cada idioma). Para acrescentar um projeto, crie o id no tipo `ProjectId`, o item na lista e o texto nos dois dicionários; o TypeScript acusa se faltar um deles. A ordem da lista é a ordem da fileira.

A seção tem dois layouts, escolhidos pelo CSS com a variante `cinema:` (definida no `globals.css`):

- **Cinema** (JS ligado, sem "reduzir movimento" e tela alta o bastante para o card mais longo caber): o hero e os Projetos ficam empilhados num palco fixado pelo ScrollTrigger (`src/components/projects/projects-stage.tsx`). A timeline (`src/animations/projects-scroll.ts`) tem três fases: `reveal` (o hero diminui e some, o fundo novo aparece), `rise` (o título e os cards sobem) e `slide` (a fileira anda na horizontal, pela largura real dela). Os links `#projects` e o Tab levam ao ponto certo da timeline (`src/animations/projects-focus.ts`), e a troca de idioma mantém a página onde estava.
- **Estático** (o resto, inclusive sem JavaScript): a seção vem depois do hero, com os cards em grade. Quando a página sai do topo, a navbar ganha um fundo (`src/components/layout/navbar-backdrop.tsx`) para os cards não passarem por baixo dos links.

A altura mínima do modo cinema depende da largura, porque quanto mais estreito o card, mais linhas o texto ocupa:

| Largura | Altura mínima |
| --- | --- |
| 412px ou mais | 640px |
| 360 a 411px | 656px |
| 320 a 359px | 712px |
| menos de 320px | sempre estático |

Esses valores foram medidos de 280 a 2560px de largura e deixam pelo menos 16px livres embaixo do card mais longo. Ao mudar um texto ou um tamanho dos cards, meça de novo: abra a página já no tamanho (sem só redimensionar a janela) e confira que o card mais alto não passa do pé da tela.

A condição do modo cinema está escrita em dois lugares, e os dois precisam ser iguais: a variante `cinema` no `globals.css` e o `CINEMA_QUERY` no `projects-stage.tsx`.

## Estrutura

Cada arquivo tem uma responsabilidade só.

```
src/
├── proxy.ts         # manda endereços sem idioma para /pt-br ou /en
├── app/
│   ├── [lang]/      # layout raiz, home, 404, erro e imagem de Open Graph de cada idioma
│   └── ...          # erro global, robots, sitemap, manifest, ícones e CSS global
├── animations/      # timelines e efeitos do GSAP, sem JSX
├── assets/fonts/    # fonte de títulos (woff2) e cópias .ttf para as imagens geradas
├── components/
│   ├── hero/        # partes do hero: colagem, título, informações, luz
│   ├── projects/    # seção de projetos, card e o palco que liga o scroll
│   ├── intro/       # componente client que dispara a intro + preloader
│   ├── layout/      # navbar e o fundo dela
│   ├── preferences/ # botão e painel de preferências (idioma e tema)
│   ├── status/      # telas de 404 e de erro
│   └── ui/          # peças genéricas (logo, ícones, botões, indicador de status)
├── data/            # o que não muda com o idioma (nome, redes, ids das seções), cards da colagem e projetos
├── hooks/           # hooks de React (ex.: esperar as imagens carregarem, saber se a página rolou)
├── i18n/            # idiomas, dicionários, escolha do idioma e testes
├── theme/           # temas, script que evita piscar, escolha salva e testes
└── lib/             # fontes, GSAP, URL do site, cores e helpers das imagens geradas
public/              # logo.svg (arquivo original da logo) e ícones do Android
public/hero/         # imagens da colagem (uma versão por tema)
```

Os componentes marcam o que a intro anima com `data-intro`, e a timeline encontra esses elementos pelos nomes definidos em `src/animations/intro-targets.ts`. A passagem para os projetos faz o mesmo com `data-projects` e `src/animations/projects-targets.ts`. Assim a animação não depende de classes CSS nem de refs espalhadas.

## O que falta

- [x] Intro com preloader e colagem animada
- [x] Hero com nome, cargo, chamada para ação e redes sociais
- [x] Luz que segue o mouse no desktop
- [x] Versão com pouco movimento para "reduzir movimento"
- [x] Páginas de 404 e de erro
- [x] `robots.txt`, `sitemap.xml` e metadados de compartilhamento (Open Graph e X)
- [x] Favicon, ícone da Apple e imagem de compartilhamento próprios
- [x] Site em português e inglês, com o idioma escolhido pelo navegador
- [x] Tema sistema/claro/escuro no painel de preferências, com contraste AAA
- [x] Seção **Projetos** (`#projects`) com scroll cinematográfico
- [ ] Imagens dos projetos nos cards
- [ ] Seção **Sobre** (`#about`)
- [ ] Seção **Contato** (`#contact`)
- [ ] Animações de scroll nas seções Sobre e Contato
- [ ] Textos definitivos do hero em `src/i18n/dictionaries/` (hoje são provisórios)
- [ ] Imagens reais na colagem: os cards em `public/hero/` ainda são ilustrações provisórias (quando chegarem, decidir se cada uma precisa de versão clara)
- [ ] Links reais do GitHub e do LinkedIn
