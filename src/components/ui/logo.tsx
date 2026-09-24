import type { ComponentProps } from "react";
import { themeColors as c } from "@/lib/theme-colors";

// Formas das letras, vindas do Figma. S e M ficam separados para dar para
// animar cada um no seu tempo.
const LETTER_S =
  "M109.918 78.528C120.073 81.2587 127.667 84.8853 132.702 89.408C137.737 93.8453 140.254 99.648 140.254 106.816C140.254 112.533 138.462 117.653 134.878 122.176C131.294 126.699 126.003 130.24 119.006 132.8C112.094 135.36 103.689 136.64 93.79 136.64C82.0993 136.64 71.774 135.147 62.814 132.16C53.9393 129.088 46.9847 125.376 41.95 121.024L46.174 115.264C50.6113 118.763 56.2007 121.749 62.942 124.224C69.6833 126.699 76.9367 127.936 84.702 127.936C89.7367 127.936 93.534 127.211 96.094 125.76C98.7393 124.309 100.062 122.261 100.062 119.616C100.062 115.008 95.4967 111.424 86.366 108.864L69.726 104C60.6807 101.269 53.6833 97.472 48.734 92.608C43.87 87.744 41.438 81.984 41.438 75.328C41.438 69.7813 43.1873 64.7467 46.686 60.224C50.1847 55.7013 55.262 52.16 61.918 49.6C68.6593 46.9547 76.7233 45.632 86.11 45.632C95.07 45.632 103.305 46.656 110.814 48.704C118.409 50.752 124.595 53.2267 129.374 56.128L125.15 62.016C121.139 59.712 116.318 57.7493 110.686 56.128C105.139 54.5067 99.294 53.696 93.15 53.696C87.774 53.696 83.6353 54.5493 80.734 56.256C77.918 57.8773 76.51 60.1387 76.51 63.04C76.51 65.2587 77.5767 67.2213 79.71 68.928C81.8433 70.5493 85.8967 72.1707 91.87 73.792L109.918 78.528Z";
const LETTER_M =
  "M154.261 76.352V136H146.709V46.4H184.085L202.773 83.776L217.621 46.4H258.581V136H217.621V68.8L191.509 136H180.373L154.261 76.352Z";

// Só a área desenhada, sem a moldura preta do arquivo original (320x180).
const AREA = { x: 36, y: 29, width: 261, height: 122 };

type LogoProps = ComponentProps<"svg"> & {
  /**
   * Precisa ser único na página: a máscara e o gradiente são encontrados
   * pelo id (`url(#...)`), e duas logos com o mesmo id pegariam as peças
   * uma da outra. Não dá para usar `useId` porque a imagem de Open Graph
   * desenha a logo fora do React, onde hooks não rodam.
   */
  id: string;
};

export function Logo({ id, ...props }: LogoProps) {
  const maskId = `${id}-mask`;
  const barId = `${id}-bar`;
  const { x, y, width, height } = AREA;

  return (
    <svg
      id={id}
      viewBox={`${x} ${y} ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id={barId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={c.react} />
          <stop offset="1" stopColor={c.nodeLight} />
        </linearGradient>

        {/* Na máscara, branco mostra e preto esconde: aparece tudo, menos
            o miolo das letras. Por isso o miolo fica transparente e a logo
            funciona em cima de qualquer fundo. */}
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={x}
          y={y}
          width={width}
          height={height}
        >
          <rect x={x} y={y} width={width} height={height} fill="white" />
          <path d={LETTER_S} fill="black" />
          <path d={LETTER_M} fill="black" />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        {/* A barra do "$" passa por trás do S e só aparece fora dele. */}
        <rect
          x="82.5"
          y="30.5"
          width="11"
          height="119"
          rx="5.5"
          fill={`url(#${barId})`}
          stroke={c.fg}
        />
        {/* Traço de 8 centrado na borda, com a metade de dentro escondida
            pela máscara: sobra um contorno de 4 só por fora, como no Figma. */}
        <path d={LETTER_S} stroke={c.fg} strokeWidth="8" />
        <path d={LETTER_M} stroke={c.fg} strokeWidth="8" />
      </g>

      <ellipse
        cx="281"
        cy="125.5"
        rx="13.5"
        ry="13"
        fill={c.nodeLight}
        stroke={c.fg}
        strokeWidth="3"
      />
    </svg>
  );
}
