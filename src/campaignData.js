/* ═══════════════════════════════════════════════════════════
   campaignData.js
   Dados estáticos do carrossel hero e das campanhas.
   Separado do componente para não recriar a cada render
   e facilitar manutenção (adicionar/remover campanhas aqui).
   ═══════════════════════════════════════════════════════════ */

/* ── IMAGENS DO CARROSSEL HERO ────────────────────────────── */
import img1 from "./assets/img/carrossel1.webp";
import img2 from "./assets/img/Pascoa.webp";
import img3 from "./assets/img/carrossel3.png";
import img4 from "./assets/img/carrossel2.webp";

/* ── MÍDIAS DAS CAMPANHAS ─────────────────────────────────── */
import cp1  from "./assets/img/Sabores/ACOMPANHAMENTOS1.jpg";
import cp2  from "./assets/img/Sabores/ACOMPANHAMENTOS2.jpg";
import cp3  from "./assets/img/Sabores/AÇAÍSESORVETES.png";
import cp4  from "./assets/img/Sabores/SABORESAÇAÍ.png";

import cp21 from "./assets/img/Pascoa/pascoa1.mp4";
import cp22 from "./assets/img/Pascoa/Pascoa2.mp4";

import cp31 from "./assets/img/Shake/ShakeP.png";
import cp32 from "./assets/img/Shake/shakeproteico 1.mp4";

/* ── SLIDES DO HERO ───────────────────────────────────────── */
// id: chave usada no campaignMap para vincular a campanha
export const images = [
  { id: "img1", src: img1, alt: "Sabores e acompanhamentos" },
  { id: "img2", src: img2, alt: "Promoção de Páscoa" },
  { id: "img3", src: img3, alt: "Shake proteico" },
  { id: "img4", src: img4, alt: "The Best Açaí" }, // sem campanha vinculada
];

/* ── CAMPANHAS ────────────────────────────────────────────── */
const campaign1 = [
  { id: "c1-1", src: cp1,  alt: "Acompanhamentos 1" },
  { id: "c1-2", src: cp2,  alt: "Acompanhamentos 2" },
  { id: "c1-3", src: cp3,  alt: "Açaís e sorvetes" },
  { id: "c1-4", src: cp4,  alt: "Sabores de açaí" },
];

const campaign2 = [
  { id: "c2-1", src: cp21, alt: "Páscoa vídeo 1" },
  { id: "c2-2", src: cp22, alt: "Páscoa vídeo 2" },
];

const campaign3 = [
  { id: "c3-1", src: cp31, alt: "Shake proteico" },
  { id: "c3-2", src: cp32, alt: "Shake proteico vídeo" },
];

/* ── MAPA slide id → campanha ─────────────────────────────── */
// Se o id do slide não estiver aqui, o botão "Saiba mais" não aparece
export const campaignMap = {
  img1: campaign1,
  img2: campaign2,
  img3: campaign3,
};
