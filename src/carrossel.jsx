import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import imgClub1 from "./assets/img/club1.png";
import imgClub2 from "./assets/img/Club2.png";
import imgClub3 from "./assets/img/Club3.png";
import imgClub4 from "./assets/img/Club4.png";

const clubImages = [imgClub1, imgClub2, imgClub3, imgClub4];

function Carrossel({ onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev === clubImages.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? clubImages.length - 1 : prev - 1));
  };

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur">
      <div className="relative w-full h-full">
        <img
          src={clubImages[currentIndex]}
          alt="Clube The Best"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-30 bg-[#feb32b] hover:scale-105 transition-all duration-300 rounded-xl px-6 py-3 shadow-lg"
        >
          Voltar ao início
        </button>

        <button
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/70 px-3 py-2 rounded-full"
        >
          {"<"}
        </button>

        <button
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/70 px-3 py-2 rounded-full"
        >
          {">"}
        </button>
        {currentIndex === 0 && (
          <div className="absolute bottom-[3%] w-full flex justify-center z-20">
            <div className="flex gap-x-16">
              <div className="bg-white p-3 rounded-lg shadow-lg">
                <QRCodeCanvas
                  value="https://play.google.com/store/apps/details?id=com.amatech.thebestclubapp&pli=1"
                  size={160}
                />
              </div>

              <div className="bg-white p-3 rounded-lg shadow-lg">
                <QRCodeCanvas
                  value="https://apps.apple.com/br/app/clube-the-best/id6463561926"
                  size={160}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrossel;
