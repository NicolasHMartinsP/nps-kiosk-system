import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import imgClub1 from "./assets/img/club1.png";
import imgClub2 from "./assets/img/Club2.png";
import imgClub3 from "./assets/img/Club3.png";
import imgClub4 from "./assets/img/Club4.png";

// Array of images shown in the carousel. Order matters.
const clubImages = [imgClub1, imgClub2, imgClub3, imgClub4];

function Carrossel({ onClose }) {
  // State for tracking which image index is currently displayed.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Move to the next slide or wrap back to the start.
  const next = () => {
    setCurrentIndex((prev) => (prev === clubImages.length - 1 ? 0 : prev + 1));
  };

  // Move to the previous slide or wrap to the last.
  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? clubImages.length - 1 : prev - 1));
  };

  // Side effect to prevent background scrolling while the overlay is open.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Cleanup restores previous overflow value.
    return () => {
      document.body.style.overflow = original;
    };
  }, []);
  //swipe - start and end
  const [TouchStart, setTouchStart] = useState(null);
  const [TouchEnd, setTouchEnd] = useState(null);
  // minSwipe = the minimal distance is 50px for moviment, if the movement is lower than this, he ignores, if is above he execute the swipes
  const minSwipeDistance = 50;
  //the onTouchStart register the event that touches in the screen in horizontal by the client
  const onTouchStart = (event) => {
    setTouchEnd(null);
    setTouchStart(event.targetTouches[0].clientX);
  };
  //the onTouchEnd register the opposite of onTouchStart
  const onTouchEnd = () => {
    if (!TouchStart || !TouchEnd) return;
    const distance = TouchStart - TouchEnd;
    if (distance > minSwipeDistance) {
      // swipe esquerda → próximo slide
      setSetaOn(true);
      next();
    }
    if (distance < -minSwipeDistance) {
      // swipe direita → slide anterior
      setSetaOn(true);
      prev();
    }
  };
  const onTouchMove = (event) => {
    setTouchEnd(event.targetTouches[0].clientX);
  };
  const [Setaon, setSetaOn] = useState(false);
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full h-full">
        <img
          src={clubImages[currentIndex]}
          alt="Clube The Best"
          className="absolute inset-0 w-full h-screen object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-30 bg-[#feb32b] hover:scale-105 transition-all duration-300 rounded-xl px-6 py-3 shadow-lg"
        >
          Voltar ao início
        </button>

        {currentIndex === 0 && (
          <>
            {!Setaon && (
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20">
                <span className="swipe-hint text-black p-9 text-8xl">‹‹</span>
                <span className="swipe-hint text-black p-9 text-8xl">››</span>
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
