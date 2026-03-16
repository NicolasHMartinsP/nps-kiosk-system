import { useState, useEffect } from "react";
import "./App.css";
import LogoFloating from "./LogoFloating";
import img1 from "./assets/img/carrossel1.webp";
import img2 from "./assets/img/carrossel2.webp";
import img3 from "./assets/img/carrossel3.png";
import imgClube from "./assets/img/STORY5.png";
import img4 from "./assets/img/Pascoa.webp";
import Carrossel from "./carrossel";
import Modal from "./Modal";

// `images` is a simple array of objects that drive the hero carousel.
// Each object has an `id` (used for React's key), a `src` path, and
// an `alt` text for accessibility.
const images = [
  { id: "img1", src: img1, alt: "Batatinha" },
  { id: "img2", src: img2, alt: "Cenourinha" },
  { id: "img3", src: img3, alt: "Mandioquinha" },
  { id: "img4", src: img4, alt: "Linguicinha" },
];

function App() {
  // ------------------------------------------------------------------
  // 1. State declarations
  // `useState` is a React hook that lets us add state to functional components.
  // We define three pieces of state:
  // - ModalOpen: boolean flag controlling the feedback modal visibility.
  // - currentIndex: index of the currently visible slide in the hero carousel.
  // - ClubOpen: boolean flag for showing the club information carousel.
  // These are all local to App and drive conditional rendering below.
  const cidade =
    new URLSearchParams(window.location.search).get("cidade") || "desconhecida";
  const [ModalOpen, SetModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ClubOpen, SetClubOpen] = useState(false);
  const [TouchStart, SetTouchStart] = useState(null);
  const [TouchEnd, SetTouchEnd] = useState(null);
  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    SetTouchEnd(null);
    SetTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!TouchStart || !TouchEnd) return;
    const distance = TouchStart - TouchEnd;
    if (distance > minSwipeDistance) {
      setSetaOn(true);
      nextSlide();
    }
    if (distance < -minSwipeDistance) {
      setSetaOn(true);
      prevSlide();
    }
  };
  const [Setaon, setSetaOn] = useState(false);
  const onTouchMove = (e) => {
    SetTouchEnd(e.targetTouches[0].clientX);
  };
  // ------------------------------------------------------------------
  // 2. Helper functions
  // These are simple arrow functions that change the carousel index.
  // They use the functional form of `setState` to ensure the update is
  // based on the prior value.
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // ------------------------------------------------------------------
  // 3. Side effects
  // `useEffect` without dependencies runs once after the initial render.
  // Here we create an interval that advances the carousel automatically
  // every 3 seconds. The returned cleanup function clears the interval when
  // the component unmounts or before the effect re-runs.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------------
  // 4. Render logic (JSX)
  // The component returns a fragment containing:
  // - a header section with a floating logo, title, and evaluation button
  // - a manual carousel controlled by `currentIndex`
  // - a club promotion section with an image and a button
  // - conditional rendering of <Modal> and <Carrossel> based on state
  // Tailwind CSS classes are used extensively for styling and layout.
  return (
    <>
      <div className="text-lg font-semibold px-8 py-4 Hover">
        <LogoFloating></LogoFloating>
        <h1 id="titleSearch">
          Nos <span className="highlight">ajude</span> a fazer o nosso{" "}
          <span className="highlight">melhor</span>
          <span className="linhabaixa">
            deixe a <span className="highlight">sua</span> avaliação!
          </span>
        </h1>
        <button
          className="mt-8 px-8 py-4 text-2xl font-bold bg-[#feb32b] rounded-xl shadow-lg transition-all duration-300 hover:scale-110 pulseScale glowButton"
          onClick={() => SetModalOpen(true)}
        >
          Avaliar agora!
        </button>
      </div>
      <div className="separador">
        <div
          id="Pamonha"
          className="relative overflow-hidden w-full"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-[#feb32b] hover:bg-white px-3 py-2 rounded-full shadow"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-[#feb32b] hover:bg-white px-3 py-2 rounded-full shadow"
          >
            →
          </button>
        </div>
      </div>
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative">
        <div id="containerBotão" className="relative w-full max-w-5xl">
          <img src={imgClube} alt="Clube The Best" className="w-full h-auto" />
          <button
            onClick={() => SetClubOpen(true)}
            className="absolute mx-auto left-0 right-0 w-fit bottom-[5%] text-black bg-[#feb32b] px-8 py-4 font-bold rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg pulseScale glowButton"
          >
            Clique aqui e saiba mais!
          </button>
        </div>
      </section>
      {ModalOpen && (
        <Modal onClose={() => SetModalOpen(false)} cidade={cidade} />
      )}
      {ClubOpen && <Carrossel onClose={() => SetClubOpen(false)} />}
    </>
  );
}

export default App;
