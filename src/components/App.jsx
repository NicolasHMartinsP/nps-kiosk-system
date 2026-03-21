/* App.jsx — Orquestrador principal. Documentação: README.md → Componentes → App.jsx */

import { useState } from "react";
import "../styles/base.css";
import "../styles/Hero.css";
import "../styles/Buttons.css";
import "../styles/Legacy.css";
import LogoFloating from "./LogoFloating";
import CarrosselHero from "./CarrosselHero";
import CampanhaModal from "./CampanhaModal";
import Modal from "./Modal";
import Carrossel from "./carrossel";
import imgClube from "../assets/img/Club/STORY5.png";
import { images, campaignMap } from "../data/campaignData";
import { useCarrossel } from "../hooks/useCarrossel";
import { useCampanha } from "../hooks/useCampanha";

function App() {
  /* Lê ?cidade= da URL para identificar a franquia no Firestore */
  const cidade =
    new URLSearchParams(window.location.search).get("cidade") || "desconhecida";

  const carrossel = useCarrossel(images);
  const campanha = useCampanha(images, carrossel.currentIndex, campaignMap);

  const [modalOpen, setModalOpen] = useState(false);
  const [clubOpen, setClubOpen] = useState(false);

  return (
    <>
      {/* 1. HERO */}
      <div className="Hover">
        <LogoFloating />
        <div className="heroText">
          <p className="heroTagline">nos ajude a fazer o nosso melhor</p>
          <h1 className="heroTitle">
            Deixe a sua <span className="highlight">avaliação!</span>
          </h1>
        </div>
        <button
          className="glowButton avaliarBtn"
          onClick={() => setModalOpen(true)}
        >
          Avaliar agora!
        </button>
      </div>

      {/* 2. CARROSSEL HERO */}
      <CarrosselHero
        images={images}
        currentIndex={carrossel.currentIndex}
        onNext={carrossel.nextSlide}
        onPrev={carrossel.prevSlide}
        onDotClick={carrossel.goTo}
        onTouchStart={carrossel.onTouchStart}
        onTouchMove={carrossel.onTouchMove}
        onTouchEnd={carrossel.onTouchEnd}
        currentHasCampaign={campanha.currentHasCampaign}
        onSaibaMais={campanha.handleSaibaMais}
      />

      {/* 3. MODAL DE CAMPANHA — sempre no DOM, visível quando openCampaign === true */}
      <CampanhaModal
        openCampaign={campanha.openCampaign}
        campaignInuse={campanha.campaignInuse}
        campaignIndex={campanha.campaignIndex}
        onClose={campanha.handleClose}
        onNext={campanha.nextCampaignSlide}
        onPrev={campanha.prevCampaignSlide}
        onDotClick={campanha.goToCampaignSlide}
        onTouchStart={campanha.onTouchStart}
        onTouchMove={campanha.onTouchMove}
        onTouchEnd={campanha.onTouchEnd}
      />

      {/* 4. SEÇÃO CLUBE */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative">
        <img
          src={imgClube}
          alt="Clube The Best"
          className="w-full object-cover"
        />
        <button
          onClick={() => setClubOpen(true)}
          className="glowButton clubeBtn"
        >
          Clique aqui e saiba mais!
        </button>
      </section>

      {/* 5. MODAL DE AVALIAÇÃO — montado só quando aberto */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)} cidade={cidade} />
      )}

      {/* 6. MODAL DO CLUBE — montado só quando aberto */}
      {clubOpen && <Carrossel onClose={() => setClubOpen(false)} />}
    </>
  );
}

export default App;
