import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Todo plugin do GSAP precisa ser registrado uma vez antes de usar.
// Centralizando aqui, o resto do projeto importa sempre de "@/lib/gsap"
// e nunca esquece de registrar.
gsap.registerPlugin(useGSAP, DrawSVGPlugin, Flip, ScrollTrigger);

export { Flip, gsap, ScrollTrigger, useGSAP };
