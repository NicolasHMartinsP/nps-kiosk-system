/* useCampanha.js — Lógica do modal de campanha: estado, navegação e swipe. */

import { useState } from "react";
import { useSwipe } from "./useSwipe";

export function useCampanha(images, currentIndex, campaignMap) {
  const [campaignInuse, setCampaignInuse] = useState(null);
  const [openCampaign, setOpenCampaign] = useState(false);
  const [campaignIndex, setCampaignIndex] = useState(0);

  const currentHasCampaign = !!campaignMap[images[currentIndex].id];

  const handleSaibaMais = () => {
    const campanha = campaignMap[images[currentIndex].id];
    if (!campanha) return;
    setCampaignInuse(campanha);
    setOpenCampaign(true);
    setCampaignIndex(0);
  };

  const handleClose = () => {
    setOpenCampaign(false);
    setCampaignIndex(0);
  };

  const nextCampaignSlide = () => setCampaignIndex((prev) => (prev === campaignInuse.length - 1 ? 0 : prev + 1));
  const prevCampaignSlide = () => setCampaignIndex((prev) => (prev === 0 ? campaignInuse.length - 1 : prev - 1));
  const goToCampaignSlide = (i) => setCampaignIndex(i);

  const swipeHandlers = useSwipe({
    onSwipeLeft: nextCampaignSlide,
    onSwipeRight: prevCampaignSlide,
  });

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
    ...swipeHandlers
  };
}
