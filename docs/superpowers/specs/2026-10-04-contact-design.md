# Seção de Contato — Design

- **Data:** 2026-10-04
- **Status:** aprovado (prints e textos revisados)
- **Branch:** `feat/contact`

## Objetivo

Criar a seção **Contato** (`#contact`), a última da home. Ela tem dois papéis:
deixar o contato fácil para quem chegou até ali e fechar o site, que abre como
um filme (intro, modo cinema).

Direção escolhida na conversa: **convite editorial** como base (a mesma
estrutura da seção de Projetos: etiqueta mono, frase grande com degradê, o
e-mail em destaque) com o **final de "créditos"**: a logo do preloader é
desenhada de novo, pelo scroll, no pé da página. O site abre e fecha com o
mesmo traço.

## Decisões tomadas

| Pergunta | Decisão |
| --- | --- |
| Formulário? | **Não.** O site é estático; formulário traria back-end, variável de ambiente, anti-spam e mensagens de erro nos dois idiomas. E-mail + LinkedIn bastam. |
| E-mail | `smartinsdev@outlook.com`, num `mailto:` com assunto já preenchido ("Contato pelo portfólio"). |
| Copiar e-mail? | **Sim**, para quem não tem programa de e-mail. O nome do botão não muda; o resultado aparece num `<output>` ao lado (anunciado pelo leitor de tela). Sem JS, o botão some. |
| WhatsApp, currículo em PDF? | **Não** por enquanto (não foram pedidos). |
| Detalhes | `<dl>` com Status (o mesmo aviso do hero), Local ("Brasil · UTC−3", horário de Brasília, confirmado) e Redes. |
| Animação do texto? | **Não.** O conteúdo aparece sempre; o movimento da seção é só a logo. Evita esconder texto antes do JS e reanimar na troca de idioma. |
| Desenho da logo | `createLogoDraw()` do preloader numa timeline com ScrollTrigger: `start: "top bottom"`, `end: "max"`, `scrub: 1`. Com "reduzir movimento" ou sem JS, a logo fica inteira. |
| Rodapé | `<footer>` fora do `<main>` (landmark `contentinfo`): © + "Voltar ao topo" (`#top`). |
| Último quadro | Seção + rodapé ocupam uma tela: `min-h-[calc(100svh-4.5rem)]` + `sm:min-h-18`, tamanhos em `min(vw, svh)` a partir de 640px. |
| Fundo | `bg-contact-glow`: o azul do TS no alto à direita continua o brilho dos Projetos (sem emenda); o verde do Node fica atrás da logo. |

## O que mudou fora da seção

Antes, a página acabava no palco fixado dos Projetos. Com conteúdo depois do
pin, apareceram três problemas, todos reproduzidos no navegador antes de
corrigir:

1. **Navbar sem fundo no modo cinema**: o título do Contato passava por cima
   da logo da navbar. Agora o ScrollTrigger põe `PINNED_CLASS` no palco com
   `toggleClass` (que, ao contrário de `onToggle`, também roda no refresh), e
   a variante `stage-pinned:` esconde o fundo só enquanto o palco está fixo.
   Um teste confere que o nome é o mesmo no CSS e no TypeScript.
2. **`/pt-br#contact` parava no meio da passagem dos Projetos** (scroll 900,
   Contato 2041px abaixo). O navegador pula antes de o pin existir, e o GSAP
   adia a primeira medida do pin para o próximo quadro. O `projects-focus.ts`
   chama `ScrollTrigger.refresh()` e refaz o pulo.
3. **Trocar de layout no Contato levava aos Projetos.** O `projects-place.ts`
   ganhou o lugar "depois do palco", que guarda quanto a pessoa tinha passado
   do fim dele.

Também: `refreshPriority: -1` na logo (é medida depois do pin, mesmo quando o
pin é recriado por último); `scroll-margin-top` global em links e botões (o
foco por teclado não para embaixo da navbar fixa); `SocialLinks` e `GUTTER`
extraídos para o hero, os Projetos, a navbar e o Contato usarem o mesmo.

## Fora do escopo

- Seção Sobre (o link da navbar continua sem destino).
- Último card na fileira de Projetos chamando para o Contato.
- Skip link para o conteúdo principal (vale para o site todo).

## Verificação

- `pnpm test` (59 testes: `mailto`, `copyText`, variante `stage-pinned`),
  `pnpm lint`, `tsc`, `pnpm build`.
- agent-browser, em dev e no build de produção: âncoras `#contact` e
  `#projects`, fundo da navbar durante e depois do pin, troca de layout nos
  dois sentidos, troca de idioma no fim da página, Tab/Shift+Tab entre os
  cards e o Contato (inclusive em 320×568), "Voltar ao topo", botão de
  copiar, "reduzir movimento", console sem erros.
- Contraste AAA medido na tela contra o pior pixel do fundo, nos dois temas,
  em 1440×900, 390×844 e 320×640: menor valor 7,37:1. O aviso "E-mail
  copiado" na cor de destaque dava 6,4:1 no claro e passou a usar a cor do
  texto (15,4:1).
- axe: 0 violações nos dois temas.
