import { useState, useEffect } from "react";
import "./App.css";
import LogoFloating from "./LogoFloating";
import img1 from "./assets/img/carrossel1.webp";
import img2 from "./assets/img/carrossel2.webp";
import img3 from "./assets/img/carrossel3.png";
import imgClube from "./assets/img/STORY5.png";
import { QRCodeCanvas } from "qrcode.react";
import Carrossel from "./carrossel";
import Modal from "./Modal";

const images = [
  { id: "img1", src: img1, alt: "Batatinha" },
  { id: "img2", src: img2, alt: "Cenourinha" },
  { id: "img3", src: img3, alt: "Mandioquinha" },
];

function App() {
  // 1. Estados
  const [ModalOpen, SetModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ClubOpen, SetClubOpen] = useState(false);
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  // 2. Funções
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 3. JSX (estrutura visual)
  return (
    <>
      <div
        className="text-lg
font-semibold
px-8
py-4
      Hover"
      >
        <LogoFloating></LogoFloating>
        <h1 id="titleSearch">
          Nossa <span className="highlight">qualidade</span> depende de{" "}
          <span className="highlight">você</span>
          <span className="linhabaixa">
            deixe a <span className="highlight">sua</span> avaliação!
          </span>
        </h1>
        <button
          className="left-1/2-translate-x-1/2 mt-8 p-6 text-2xl bg-[#feb32b] rounded-xl shadow-lg transition-all hover:scale-105 pulseScale glowButton"
          onClick={() => SetModalOpen(true)}
        >
          Avaliar agora!
        </button>
      </div>
      <div className="separador">
        <div className="relative overflow-hidden w-full ">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image) => (
              <img
                key={image.id}
                src={image.src}
                alt={image.alt}
                className="h-full w-full flex-shrink-0 cursor-pointer block"
              />
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white px-3 py-2 rounded-full shadow"
          >
            &lt;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white px-3 py-2 rounded-full shadow"
          >
            &gt;
          </button>
        </div>
      </div>
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative">
        <div id="containerBotão" className="relative w-full max-w-5xl">
          <img src={imgClube} alt="Clube The Best" className="w-full h-auto" />
          <button
            onClick={() => SetClubOpen(true)}
            className="absolute left-1/2 -translate-x-1/2 bottom-[7%] text-black bg-[#feb32b] px-8 py-4 font-bold rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg"
          >
            Clique aqui e saiba mais!
          </button>
        </div>
      </section>
      {ModalOpen && <Modal onClose={() => SetModalOpen(false)} />}
      {ClubOpen && <Carrossel onClose={() => SetClubOpen(false)} />}
    </>
  );
}

export default App;
