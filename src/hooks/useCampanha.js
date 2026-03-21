/* useCampanha.js — Lógica do modal de campanha: estado, navegação e swipe. Documentação: README.md → Hooks → useCampanha */

import { useState } from "react";

export function useCampanha(images, currentIndex, campaignMap) {

  const [campaignInuse, setCampaignInuse] = useState(null);
  const [openCampaign,  setOpenCampaign]  = useState(false);
  const [campaignIndex, setCampaignIndex] = useState(0);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd,   setTouchEnd]   = useState(null);
  const minSwipeDistance = 50;

  /* True quando o slide atual do hero tem campanha vinculada */
  const currentHasCampaign = !!campaignMap[images[currentIndex].id];

  const handleSaibaMais = () => {
    const campanha = campaignMap[images[currentIndex].id];
    if (!campanha) return;
    setCampaignInuse(campanha);
    setOpenCampaign(true);
    setCampaignIndex(0);
  };

  const handleClose = () => { setOpenCampaign(false); setCampaignIndex(0); };

  const nextCampaignSlide  = () => setCampaignIndex((prev) => (prev === campaignInuse.length - 1 ? 0 : prev + 1));
  const prevCampaignSlide  = () => setCampaignIndex((prev) => (prev === 0 ? campaignInuse.length - 1 : prev - 1));
  const goToCampaignSlide  = (i) => setCampaignIndex(i);

  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove  = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd   = () => {
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
