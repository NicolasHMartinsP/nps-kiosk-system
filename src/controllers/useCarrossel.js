/* useCarrossel.js — Lógica do carrossel hero: índice, navegação, autoplay. */

import { useState, useEffect } from "react";
import { useSwipe } from "./useSwipe";

export function useCarrossel(images) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goTo = (i) => setCurrentIndex(i);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const swipeHandlers = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
  });

  return { currentIndex, nextSlide, prevSlide, goTo, ...swipeHandlers };
}
