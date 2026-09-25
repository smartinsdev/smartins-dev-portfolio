import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { themeColors } from "@/lib/theme-colors";

// Usado quando alguém instala o site na tela inicial do Android. Os ícones
// ficam em public/ porque o Next não tem convenção de arquivo para eles.
// É um manifest só para os dois idiomas: nome neutro, e start_url "/"
// deixa o proxy escolher o idioma quando o app abre.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    start_url: "/",
    display: "standalone",
    background_color: themeColors.pageDark,
    theme_color: themeColors.pageDark,
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
