/* ═══════════════════════════════════════════════════════════
   useCarrossel.js
   Hook que gerencia todo o estado e lógica do carrossel hero:
   índice ativo, navegação, autoplay e swipe.

   Uso no App.jsx:
     const carrossel = useCarrossel(images);
     carrossel.currentIndex
     carrossel.nextSlide()
     carrossel.prevSlide()
     carrossel.goTo(i)
     carrossel.onTouchStart
     carrossel.onTouchMove
     carrossel.onTouchEnd
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect } from "react";

export function useCarrossel(images) {

  /* ── ÍNDICE DO SLIDE ATIVO ────────────────────────────────── */
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ── ESTADO DE SWIPE ──────────────────────────────────────── */
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd,   setTouchEnd]   = useState(null);
  const minSwipeDistance = 50;

  /* ── NAVEGAÇÃO — loop circular ────────────────────────────── */
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const goTo = (i) => setCurrentIndex(i);

  /* ── AUTOPLAY — avança a cada 5s ──────────────────────────── */
  // clearInterval no cleanup evita memory leak
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ── HANDLERS DE TOQUE ────────────────────────────────────── */
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance)  nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  return {
    currentIndex,
    nextSlide,
    prevSlide,
    goTo,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
