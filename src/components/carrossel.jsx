/* carrossel.jsx — Modal do Clube The Best. Documentação: README.md → Componentes → carrossel.jsx */

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import imgClub1 from "../assets/img/Club/club1.png";
import imgClub2 from "../assets/img/Club/Club2.png";
import imgClub3 from "../assets/img/Club/Club3.png";
import imgClub4 from "../assets/img/Club/Club4.png";

const clubImages = [imgClub1, imgClub2, imgClub3, imgClub4];

function Carrossel({ onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("left");
  const [isAnimating, setIsAnimating] = useState(false);

  /* Troca de slide com direção e bloqueio durante animação (400ms) */
  const changeSlide = (newIndex, dir) => {
    if (isAnimating) return;
    setDirection(dir);
    setCurrentIndex(newIndex);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const next = () =>
    changeSlide(
      currentIndex === clubImages.length - 1 ? 0 : currentIndex + 1,
      "left",
    );
  const prev = () =>
    changeSlide(
      currentIndex === 0 ? clubImages.length - 1 : currentIndex - 1,
      "right",
    );
  const goTo = (index) => {
    if (index === currentIndex) return;
    changeSlide(index, index > currentIndex ? "left" : "right");
  };

  /* Bloqueia scroll do body enquanto o modal está aberto */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  /* Swipe — distância mínima de 50px para trocar slide */
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeHintVisible, setSwipeHintVisible] = useState(true);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setSwipeHintVisible(false);
      next();
    }
    if (distance < -minSwipeDistance) {
      setSwipeHintVisible(false);
      prev();
    }
  };

  /* Estilos de transição: fade + slide lateral via transform e opacity */
  const imageStyle = (isActive) => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "opacity 0.4s ease, transform 0.4s ease",
    opacity: isActive ? 1 : 0,
    transform: isActive
      ? "translateX(0)"
      : direction === "left"
        ? "translateX(-60px)"
        : "translateX(60px)",
    pointerEvents: isActive ? "auto" : "none",
  });

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Todas as imagens sobrepostas — a ativa aparece via opacity/transform */}
        {clubImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Clube The Best — slide ${index + 1}`}
            style={imageStyle(index === currentIndex)}
          />
        ))}

        {/* Botão voltar */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-30 bg-[#feb32b] hover:scale-105 transition-transform duration-300 rounded-xl px-6 py-3 shadow-lg"
        >
          Voltar ao início
        </button>

        {/* Setas — reutilizam .arrowBtn do App.css */}
        <button
          onClick={prev}
          disabled={isAnimating}
          className="arrowBtn arrowBtn--left z-30"
          aria-label="Slide anterior"
        >
          ‹
        </button>
        <button
          onClick={next}
          disabled={isAnimating}
          className="arrowBtn arrowBtn--right z-30"
          aria-label="Próximo slide"
        >
          ›
        </button>

        {/* Dots — sobem quando o slide 0 exibe os QR codes */}
        <div
          className="absolute w-full flex justify-center gap-2 z-30"
          style={{ bottom: currentIndex === 0 ? "220px" : "24px" }}
        >
          {clubImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              disabled={isAnimating}
              aria-label={`Ir para slide ${index + 1}`}
              style={{
                width: index === currentIndex ? "28px" : "10px",
                height: "10px",
                borderRadius: "999px",
                background: "white",
                opacity: index === currentIndex ? 1 : 0.4,
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s ease, opacity 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Conteúdo exclusivo do slide 0: dica de swipe + QR codes */}
        {currentIndex === 0 && (
          <>
            {swipeHintVisible && (
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20">
                <span className="swipe-hint text-white/60 text-6xl">‹</span>
                <span className="swipe-hint text-white/60 text-6xl">›</span>
              </div>
            )}
            <div className="absolute bottom-6 w-full flex justify-center z-20">
              <div className="flex gap-x-16">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <QRCodeCanvas
                    value="https://play.google.com/store/apps/details?id=com.amatech.thebestclubapp&pli=1"
                    size={130}
                  />
                </div>
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <QRCodeCanvas
                    value="https://apps.apple.com/br/app/clube-the-best/id6463561926"
                    size={130}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Carrossel;
