import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";

// Todo plugin do GSAP precisa ser registrado uma vez antes de usar.
// Centralizando aqui, o resto do projeto importa sempre de "@/lib/gsap"
// e nunca esquece de registrar (ex.: quando entrar o ScrollTrigger).
gsap.registerPlugin(useGSAP, DrawSVGPlugin, Flip);

export { Flip, gsap, useGSAP };
