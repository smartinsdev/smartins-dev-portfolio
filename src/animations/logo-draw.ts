import { type LogoPart, logoPart } from "@/components/ui/logo";
import { gsap } from "@/lib/gsap";

/**
 * Desenha a logo: o contorno do S e do M, a barra do "$" e o ponto.
 *
 * `logo` é o seletor do <svg>. Devolve uma timeline em vez de tocar
 * sozinha: quem chama encaixa ela dentro de outra timeline com `add()`,
 * e ela passa a andar junto com a de fora (pausa, velocidade, tudo).
 */
export function createLogoDraw(logo: string) {
  const part = (name: LogoPart) => `${logo} ${logoPart(name)}`;
  const tl = gsap.timeline();

  // drawSVG diz qual trecho do traço aparece: "0%" é nada, "100%" é o
  // traço inteiro. Animar de um para o outro "escreve" o contorno.
  // stagger: o M começa 0.15s depois do S.
  tl.fromTo(
    part("letter"),
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: 0.8, ease: "power2.inOut", stagger: 0.15 },
  );

  // A barra cresce do meio para as pontas enquanto o S termina.
  // Em elementos de SVG, o GSAP calcula o transformOrigin pela caixa do
  // próprio elemento, então "50% 50%" é o centro da barra.
  tl.fromTo(
    part("bar"),
    { scaleY: 0, transformOrigin: "50% 50%" },
    { scaleY: 1, duration: 0.5, ease: "power3.out" },
    0.4,
  );

  // O ponto fecha a logo. back.out passa um pouco do tamanho final e
  // volta, o que dá o "quique". ">-0.1" = 0.1s antes do fim do anterior.
  tl.fromTo(
    part("dot"),
    { scale: 0, transformOrigin: "50% 50%" },
    { scale: 1, duration: 0.4, ease: "back.out(3)" },
    ">-0.1",
  );

  return tl;
}
