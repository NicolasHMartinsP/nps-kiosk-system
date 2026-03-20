/* useCarrossel.js — Lógica do carrossel hero: índice, navegação, autoplay e swipe. Documentação: README.md → Hooks → useCarrossel */

import { useState, useEffect } from "react";

export function useCarrossel(images) {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart,   setTouchStart]   = useState(null);
  const [touchEnd,     setTouchEnd]     = useState(null);
  const minSwipeDistance = 50;

  const nextSlide = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goTo      = (i) => setCurrentIndex(i);

  /* Autoplay a cada 5s — clearInterval no cleanup evita memory leak */
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove  = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd   = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance)  nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  return { currentIndex, nextSlide, prevSlide, goTo, onTouchStart, onTouchMove, onTouchEnd };
}
