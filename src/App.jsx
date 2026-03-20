/* ═══════════════════════════════════════════════════════════
   App.jsx — orquestrador principal
   Responsabilidade: montar a página conectando os componentes.
   Não contém lógica de carrossel, campanha ou swipe —
   tudo isso fica nos hooks e componentes separados.

   Arquivos do projeto:
     campaignData.js   → dados estáticos (imagens + campanhas)
     useCarrossel.js   → lógica do carrossel hero
     useCampanha.js    → lógica do modal de campanha
     CarrosselHero.jsx → JSX do carrossel + faixa saiba mais
     CampanhaModal.jsx → JSX do modal fullscreen de campanha
     carrossel.jsx     → modal do Clube The Best
     Modal.jsx         → modal de avaliação (notas 1-5)
     LogoFloating.jsx  → logo fixo no canto superior esquerdo
   ═══════════════════════════════════════════════════════════ */

import { useState } from "react";
import "./App.css";

/* ── COMPONENTES ──────────────────────────────────────────── */
import LogoFloating  from "./LogoFloating";
import CarrosselHero from "./CarrosselHero";
import CampanhaModal from "./CampanhaModal";
import Modal         from "./Modal";
import Carrossel     from "./carrossel";

/* ── IMAGEM DA SEÇÃO CLUBE ────────────────────────────────── */
import imgClube from "./assets/img/STORY5.png";

/* ── DADOS E HOOKS ────────────────────────────────────────── */
import { images, campaignMap } from "./campaignData";
import { useCarrossel }        from "./useCarrossel";
import { useCampanha }         from "./useCampanha";

/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════════════════ */
function App() {

  /* ── QUERY PARAM ?cidade= ─────────────────────────────────
     Identifica a unidade da franquia via URL.
     Ex: meusite.com?cidade=curitiba
     Passado ao Modal de avaliação para registrar qual loja
     originou a resposta no Firestore.
     ───────────────────────────────────────────────────────── */
  const cidade =
    new URLSearchParams(window.location.search).get("cidade") || "desconhecida";

  /* ── HOOK: CARROSSEL HERO ─────────────────────────────────
     Gerencia: índice ativo, nextSlide, prevSlide, goTo,
     autoplay (5s) e handlers de swipe do hero.
     ───────────────────────────────────────────────────────── */
  const carrossel = useCarrossel(images);

  /* ── HOOK: MODAL DE CAMPANHA ──────────────────────────────
     Gerencia: qual campanha está aberta, slide interno,
     abertura/fechamento e swipe do modal.
     Recebe currentIndex do carrossel para saber qual
     campanha abrir ao clicar em "Saiba mais".
     ───────────────────────────────────────────────────────── */
  const campanha = useCampanha(images, carrossel.currentIndex, campaignMap);

  /* ── MODAIS SIMPLES ───────────────────────────────────────
     Avaliação e Clube — apenas boolean aberto/fechado.
     Não precisam de hook próprio.
     ───────────────────────────────────────────────────────── */
  const [modalOpen, setModalOpen] = useState(false);
  const [clubOpen,  setClubOpen]  = useState(false);

  /* ═══════════════════════════════════════════════════════════
     RENDER
     Ordem das seções:
       1. Hero          → título + botão avaliar
       2. CarrosselHero → imagens + faixa saiba mais
       3. CampanhaModal → fullscreen (só renderiza se aberto)
       4. Clube         → banner + botão
       5. Modal         → avaliação (só renderiza se aberto)
       6. Carrossel     → clube    (só renderiza se aberto)
     ═══════════════════════════════════════════════════════════ */
  return (
    <>

      {/* ── 1. HERO ─────────────────────────────────────────── */}
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


      {/* ── 2. CARROSSEL HERO + FAIXA SAIBA MAIS ────────────── */}
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


      {/* ── 3. MODAL DE CAMPANHA ─────────────────────────────── */}
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


      {/* ── 4. SEÇÃO CLUBE THE BEST ──────────────────────────── */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative">
        <img src={imgClube} alt="Clube The Best" className="w-full object-cover" />
        <button
          onClick={() => setClubOpen(true)}
          className="glowButton clubeBtn"
        >
          Clique aqui e saiba mais!
        </button>
      </section>


      {/* ── 5. MODAL DE AVALIAÇÃO ────────────────────────────── */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)} cidade={cidade} />
      )}


      {/* ── 6. MODAL DO CLUBE ────────────────────────────────── */}
      {clubOpen && (
        <Carrossel onClose={() => setClubOpen(false)} />
      )}

    </>
  );
}

export default App;
