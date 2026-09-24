# Sinval Martins — Portfólio

Portfólio pessoal de Sinval Martins, desenvolvedor full stack. A home abre com uma intro animada inspirada no site do GTA VI: a logo é desenhada no preloader e voa até a navbar, uma colagem de cards converge para o centro, o nome entra palavra por palavra e, por último, aparecem os links da navbar e as informações de contato.

O site existe em português e inglês: `/pt-br` e `/en`.

Tem tema claro e escuro: segue o sistema operacional ou a escolha feita no painel de preferências.

> Em construção: hoje existe só o hero da home. Veja [o que falta](#o-que-falta).

## Stack

| Ferramenta | Para quê |
| --- | --- |
| [Next.js 16](https://nextjs.org) (App Router, Turbopack) | Framework. A página é pré-renderizada como estática. |
| [React 19](https://react.dev) | Interface. Quase tudo é server component; só a intro, a luz do hero, os seletores de idioma e de tema e as telas de erro rodam no cliente. |
| [TypeScript](https://www.typescriptlang.org) | Tipagem. |
| [Tailwind CSS v4](https://tailwindcss.com) | Estilos. Cores, fontes e animações ficam como tokens no `@theme` do `globals.css`; cada cor que muda com o tema tem os dois valores em `light-dark()`. |
| [GSAP](https://gsap.com) + [`@gsap/react`](https://gsap.com/resources/React) | Animações: timeline da intro, desenho da logo (`DrawSVGPlugin`), voo da logo até a navbar (`Flip`), luz que segue o mouse (`quickTo`) e versão reduzida para quem ativa "reduzir movimento" (`matchMedia`). |
| `next/font` | Fontes servidas pelo próprio site: Source Serif 4 (títulos), Geist (texto) e Geist Mono (detalhes). |
| `next/image` | Imagens da colagem. |
| `next/og` | Imagem de compartilhamento, gerada no build com a logo e as fontes do site. |
| `proxy.ts` + `next/root-params` | Idiomas sem biblioteca: o proxy manda `/` para `/pt-br` ou `/en`, e os server components descobrem o idioma sem receber props. |
| `node:test` | Testes das funções de idioma e de tema, com o Node rodando TypeScript direto. |
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
pnpm test       # testes das funções de idioma e de tema (node --test)
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
│   ├── intro/       # componente client que dispara a intro + preloader
│   ├── layout/      # navbar
│   ├── preferences/ # botão e painel de preferências (idioma e tema)
│   ├── status/      # telas de 404 e de erro
│   └── ui/          # peças genéricas (logo, ícones, botões, indicador de status)
├── data/            # o que não muda com o idioma (nome, redes, ids das seções) e cards da colagem
├── hooks/           # hooks de React (ex.: esperar as imagens carregarem)
├── i18n/            # idiomas, dicionários, escolha do idioma e testes
├── theme/           # temas, script que evita piscar, escolha salva e testes
└── lib/             # fontes, GSAP, URL do site, cores e helpers das imagens geradas
public/              # logo.svg (arquivo original da logo) e ícones do Android
public/hero/         # imagens da colagem (uma versão por tema)
```

Os componentes marcam o que a intro anima com `data-intro`, e a timeline encontra esses elementos pelos nomes definidos em `src/animations/intro-targets.ts`. Assim a animação não depende de classes CSS nem de refs espalhadas.

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
- [ ] Seção **Projetos** (`#projects`): os links da navbar e o botão "Ver projetos" ainda não levam a lugar nenhum
- [ ] Seção **Sobre** (`#about`)
- [ ] Seção **Contato** (`#contact`)
- [ ] Animações de scroll nas novas seções (ScrollTrigger)
- [ ] Textos definitivos em `src/i18n/dictionaries/` (hoje são provisórios)
- [ ] Imagens reais na colagem: os cards em `public/hero/` ainda são ilustrações provisórias (quando chegarem, decidir se cada uma precisa de versão clara)
- [ ] Links reais do GitHub e do LinkedIn
