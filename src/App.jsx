import { useState, useEffect } from "react";
import "./App.css";

/* ─────────── COMPONENTES ─────────── */
import LogoFloating from "./LogoFloating";
import Carrossel from "./carrossel";
import Modal from "./Modal";

/* ─────────── IMAGENS HERO ─────────── */
import img1 from "./assets/img/carrossel1.webp";
import img2 from "./assets/img/carrossel2.webp";
import img3 from "./assets/img/carrossel3.png";
import img4 from "./assets/img/Pascoa.webp";

/* ─────────── CLUBE ─────────── */
import imgClube from "./assets/img/STORY5.png";

/* ─────────── CAMPANHAS ─────────── */
import cp1 from "./assets/img/Sabores/ACOMPANHAMENTOS1.jpg";
import cp2 from "./assets/img/Sabores/ACOMPANHAMENTOS2.jpg";
import cp3 from "./assets/img/Sabores/AÇAÍSESORVETES.png";
import cp4 from "./assets/img/Sabores/SABORESAÇAÍ.png";

import cp21 from "./assets/img/Pascoa/pascoa1.mp4";
import cp22 from "./assets/img/Pascoa/Pascoa2.mp4";

import cp31 from "./assets/img/Shake/ShakeP.png";
import cp32 from "./assets/img/Shake/shakeproteico 1.mp4";

/* ─────────── HERO CAROUSEL ─────────── */
const images = [
  { id: "img1", src: img1, alt: "Batatinha" },
  { id: "img2", src: img2, alt: "Cenourinha" },
  { id: "img3", src: img3, alt: "Mandioquinha" },
  { id: "img4", src: img4, alt: "Linguicinha" },
];

/* ─────────── CAMPANHAS ─────────── */
const campaign1 = [
  { id: "c1-1", src: cp1, alt: "Campanha 1" },
  { id: "c1-2", src: cp2, alt: "Campanha 1" },
  { id: "c1-3", src: cp3, alt: "Campanha 1" },
  { id: "c1-4", src: cp4, alt: "Campanha 1" },
];

const campaign2 = [
  { id: "c2-1", src: cp21, alt: "Campanha 2" },
  { id: "c2-2", src: cp22, alt: "Campanha 2" },
];

const campaign3 = [
  { id: "c3-1", src: cp31, alt: "Campanha 3" },
  { id: "c3-2", src: cp32, alt: "Campanha 3" },
];

/* ─────────── MAPA DE CAMPANHAS ─────────── */
const campaignMap = {
  img1: campaign1,
  img2: campaign2,
  img3: campaign3,
};

/* ─────────── COMPONENTE PRINCIPAL ─────────── */
function App() {
  /* ─────────── QUERY PARAM ─────────── */
  const cidade =
    new URLSearchParams(window.location.search).get("cidade") || "desconhecida";

  /* ─────────── STATES ─────────── */

  // HERO
  const [currentIndex, setCurrentIndex] = useState(0);

  // CAMPANHA
  const [campaignInuse, SetCampaignInuse] = useState(null);
  const [openCampaign, SetopenCampaign] = useState(false);
  const [Campaign, SetCampaign] = useState(0);

  // MODAIS
  const [ModalOpen, SetModalOpen] = useState(false);
  const [ClubOpen, SetClubOpen] = useState(false);

  // TOUCH
  const [TouchStart, SetTouchStart] = useState(null);
  const [TouchEnd, SetTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  /* ─────────── TOUCH HANDLERS ─────────── */
  const onTouchStart = (e) => {
    SetTouchEnd(null);
    SetTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    SetTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!TouchStart || !TouchEnd) return;

    const distance = TouchStart - TouchEnd;

    // SWIPE DO MODAL
    if (openCampaign && campaignInuse) {
      if (distance > minSwipeDistance) {
        SetCampaign((prev) =>
          prev === campaignInuse.length - 1 ? 0 : prev + 1
        );
      }

      if (distance < -minSwipeDistance) {
        SetCampaign((prev) =>
          prev === 0 ? campaignInuse.length - 1 : prev - 1
        );
      }
    }
    // SWIPE DO HERO
    else {
      if (distance > minSwipeDistance) nextSlide();
      if (distance < -minSwipeDistance) prevSlide();
    }
  };

  /* ─────────── HERO NAV ─────────── */
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  /* ─────────── AUTO PLAY HERO ─────────── */
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── HERO ───────────────── */}
      <div className="text-lg font-semibold px-4 py-3 md:px-8 md:py-4 lg:px-16 lg:py-6 Hover">
        <LogoFloating />

        <h1 id="titleSearch">
          Nos <span className="highlight">ajude</span> a fazer o nosso{" "}
          <span className="highlight">melhor</span>
          <span className="linhabaixa">
            deixe a <span className="highlight">sua</span> avaliação!
          </span>
        </h1>

        {/* ── BOTÃO AVALIAR AGORA ── */}
        <button
          className="glowButton mt-2"
          style={{
            padding: "14px 40px",
            fontSize: "1.4rem",
            fontWeight: "800",
            backgroundColor: "#feb32b",
            color: "#1a1a1a",
            border: "none",
            borderRadius: "1rem",
            cursor: "pointer",
          }}
          onClick={() => SetModalOpen(true)}
        >
          Avaliar agora!
        </button>
      </div>

      {/* ── CARROSSEL HERO ───────────────── */}
      <div className="separador">
        <div className="carrosselWrapper">
          <div
            className="relative overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* TRACK */}
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image) => (
                <img
                  key={image.id}
                  src={image.src}
                  alt={image.alt}
                  className="w-full flex-shrink-0 cursor-pointer object-contain"
                  onClick={() => {
                    const campanha = campaignMap[image.id];
                    if (!campanha) return;

                    SetCampaignInuse(campanha);
                    SetopenCampaign(true);
                    SetCampaign(0);
                  }}
                />
              ))}
            </div>

            {/* SETAS */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-[#feb32b] px-3 py-2 rounded-full shadow"
            >
              ←
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-[#feb32b] px-3 py-2 rounded-full shadow"
            >
              →
            </button>

            {/* DOTS */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full ${
                    i === currentIndex ? "bg-[#feb32b]" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL CAMPANHA ───────────────── */}
      {openCampaign && campaignInuse && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* FECHAR */}
          <button
            onClick={() => {
              SetopenCampaign(false);
              SetCampaign(0);
            }}
            className="absolute top-4 right-4 text-white text-2xl z-50"
          >
            ✕
          </button>

          {/* CARROSSEL */}
          <div className="w-full h-full overflow-hidden">
            <div
              className="flex h-full transition-transform duration-500"
              style={{ transform: `translateX(-${Campaign * 100}%)` }}
            >
              {campaignInuse.map((item) => (
                <div key={item.id} className="w-full h-full flex-shrink-0">
                  {item.src.endsWith(".mp4") ? (
                    <video
                      src={item.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.src}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* SETAS */}
            <button
              onClick={() =>
                SetCampaign((prev) =>
                  prev === 0 ? campaignInuse.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#feb32b] px-3 py-2 rounded-full"
            >
              ←
            </button>

            <button
              onClick={() =>
                SetCampaign((prev) =>
                  prev === campaignInuse.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#feb32b] px-3 py-2 rounded-full"
            >
              →
            </button>

            {/* DOTS */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {campaignInuse.map((_, i) => (
                <button
                  key={i}
                  onClick={() => SetCampaign(i)}
                  className={`w-2 h-2 rounded-full ${
                    i === Campaign ? "bg-[#feb32b]" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CLUBE ───────────────── */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative">
        <img src={imgClube} alt="Clube" className="w-full object-cover" />

        {/* ── BOTÃO CLUBE ── */}
        <button
          onClick={() => SetClubOpen(true)}
          className="glowButton absolute bottom-10"
          style={{
            padding: "14px 36px",
            fontSize: "1.2rem",
            fontWeight: "800",
            backgroundColor: "#feb32b",
            color: "#1a1a1a",
            border: "none",
            borderRadius: "1rem",
            cursor: "pointer",
          }}
        >
          Clique aqui e saiba mais!
        </button>
      </section>

      {/* ── MODAIS ───────────────── */}
      {ModalOpen && (
        <Modal onClose={() => SetModalOpen(false)} cidade={cidade} />
      )}

      {ClubOpen && <Carrossel onClose={() => SetClubOpen(false)} />}
    </>
  );
}

export default App;
