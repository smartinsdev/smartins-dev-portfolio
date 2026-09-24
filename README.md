# Sinval Martins — Portfólio

Portfólio pessoal de Sinval Martins, desenvolvedor full stack. A home abre com uma intro animada inspirada no site do GTA VI: a logo é desenhada no preloader e voa até a navbar, uma colagem de cards converge para o centro, o nome entra palavra por palavra e, por último, aparecem os links da navbar e as informações de contato.

> Em construção: hoje existe só o hero da home. Veja [o que falta](#o-que-falta).

## Stack

| Ferramenta | Para quê |
| --- | --- |
| [Next.js 16](https://nextjs.org) (App Router, Turbopack) | Framework. A página é pré-renderizada como estática. |
| [React 19](https://react.dev) | Interface. Quase tudo é server component; só a intro e a luz do hero rodam no cliente. |
| [TypeScript](https://www.typescriptlang.org) | Tipagem. |
| [Tailwind CSS v4](https://tailwindcss.com) | Estilos. Cores, fontes e animações ficam como tokens no `@theme` do `globals.css`. |
| [GSAP](https://gsap.com) + [`@gsap/react`](https://gsap.com/resources/React) | Animações: timeline da intro, desenho da logo (`DrawSVGPlugin`), voo da logo até a navbar (`Flip`), luz que segue o mouse (`quickTo`) e versão reduzida para quem ativa "reduzir movimento" (`matchMedia`). |
| `next/font` | Fontes servidas pelo próprio site: Source Serif 4 (títulos), Geist (texto) e Geist Mono (detalhes). |
| `next/image` | Imagens da colagem. |
| `next/og` | Imagem de compartilhamento, gerada no build com a logo e as fontes do site. |
| [Biome](https://biomejs.dev) | Lint e formatação. |
| [pnpm](https://pnpm.io) | Gerenciador de pacotes. |

## Como rodar

Precisa de Node.js 20 ou mais novo e pnpm.

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
```

### Variáveis de ambiente

| Variável | Para quê |
| --- | --- |
| `SITE_URL` | Endereço público do site (ex.: `https://meudominio.dev`). Entra no `robots.txt`, no `sitemap.xml`, na URL canônica e na imagem de compartilhamento. É lida no build. |

Na Vercel ela é opcional: sem ela, o site usa o domínio de produção do projeto. Fora da Vercel, defina antes do `pnpm build`, senão essas URLs apontam para `http://localhost:3000`.

## Estrutura

Cada arquivo tem uma responsabilidade só.

```
src/
├── app/             # rotas, layout raiz, CSS global, 404, erro, robots,
│                    # sitemap, manifest, ícones e imagem de Open Graph
├── animations/      # timelines e efeitos do GSAP, sem JSX
├── assets/fonts/    # fonte de títulos (woff2) e cópias .ttf para as imagens geradas
├── components/
│   ├── hero/        # partes do hero: colagem, título, informações, luz
│   ├── intro/       # componente client que dispara a intro + preloader
│   ├── layout/      # navbar
│   ├── status/      # telas de 404 e de erro
│   └── ui/          # peças genéricas (logo, botões, indicador de status)
├── data/            # textos do site e lista de cards da colagem
├── hooks/           # hooks de React (ex.: esperar as imagens carregarem)
└── lib/             # fontes, GSAP, URL do site, cores e helpers das imagens geradas
public/              # logo.svg (arquivo original da logo) e ícones do Android
public/hero/         # imagens da colagem
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
- [ ] Seção **Projetos** (`#projetos`): os links da navbar e o botão "Ver projetos" ainda não levam a lugar nenhum
- [ ] Seção **Sobre** (`#sobre`)
- [ ] Seção **Contato** (`#contato`)
- [ ] Animações de scroll nas novas seções (ScrollTrigger)
- [ ] Textos definitivos em `src/data/site.ts` (hoje são provisórios)
- [ ] Imagens reais na colagem: os cards em `public/hero/` ainda são ilustrações provisórias
- [ ] Links reais do GitHub e do LinkedIn
