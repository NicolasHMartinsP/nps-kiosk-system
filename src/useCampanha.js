/* ═══════════════════════════════════════════════════════════
   useCampanha.js
   Hook customizado que gerencia o modal de campanha:
   qual campanha está ativa, qual slide interno está visível,
   abertura/fechamento e swipe interno do modal.

   Uso:
     const campanha = useCampanha(images, currentIndex, campaignMap);
     campanha.openCampaign
     campanha.campaignInuse
     campanha.campaignIndex
     campanha.currentHasCampaign
     campanha.handleSaibaMais()
     campanha.handleClose()
     campanha.nextCampaignSlide()
     campanha.prevCampaignSlide()
     campanha.goToCampaignSlide(i)
     campanha.onTouchStart / onTouchMove / onTouchEnd
   ═══════════════════════════════════════════════════════════ */

import { useState } from "react";

export function useCampanha(images, currentIndex, campaignMap) {

  /* ── ESTADO DO MODAL ──────────────────────────────────────── */
  const [campaignInuse, setCampaignInuse] = useState(null); // mídias da campanha ativa
  const [openCampaign,  setOpenCampaign]  = useState(false); // modal aberto/fechado
  const [campaignIndex, setCampaignIndex] = useState(0);    // slide ativo na campanha

  /* ── ESTADO DE SWIPE INTERNO ──────────────────────────────── */
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd,   setTouchEnd]   = useState(null);
  const minSwipeDistance = 50;

  /* ── O SLIDE ATUAL DO HERO TEM CAMPANHA? ──────────────────── */
  // Usado para mostrar/esconder a faixa "Saiba mais"
  const currentHasCampaign = !!campaignMap[images[currentIndex].id];

  /* ── ABRIR CAMPANHA DO SLIDE ATIVO ────────────────────────── */
  // Busca no campaignMap pelo id do slide atual
  // Se não houver campanha vinculada, não faz nada
  const handleSaibaMais = () => {
    const campanha = campaignMap[images[currentIndex].id];
    if (!campanha) return;
    setCampaignInuse(campanha);
    setOpenCampaign(true);
    setCampaignIndex(0);
  };

  /* ── FECHAR MODAL ─────────────────────────────────────────── */
  const handleClose = () => {
    setOpenCampaign(false);
    setCampaignIndex(0);
  };

  /* ── NAVEGAÇÃO INTERNA DA CAMPANHA ────────────────────────── */
  const nextCampaignSlide = () =>
    setCampaignIndex((prev) =>
      prev === campaignInuse.length - 1 ? 0 : prev + 1
    );

  const prevCampaignSlide = () =>
    setCampaignIndex((prev) =>
      prev === 0 ? campaignInuse.length - 1 : prev - 1
    );

  const goToCampaignSlide = (i) => setCampaignIndex(i);

  /* ── HANDLERS DE TOQUE DO MODAL ───────────────────────────── */
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance)  nextCampaignSlide();
    if (distance < -minSwipeDistance) prevCampaignSlide();
  };

  return {
    openCampaign,
    campaignInuse,
    campaignIndex,
    currentHasCampaign,
    handleSaibaMais,
    handleClose,
    nextCampaignSlide,
    prevCampaignSlide,
    goToCampaignSlide,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
