/* ═══════════════════════════════════════════════════════════
   carrossel.jsx — Modal do Clube The Best
   ═══════════════════════════════════════════════════════════

   RESPONSABILIDADE:
   Exibe as imagens do Clube em um carrossel fullscreen com:
     - Transição suave entre slides (fade + slide lateral)
     - Dots de navegação clicáveis
     - Setas prev/next
     - Suporte a swipe em touch
     - QR Codes no primeiro slide
     - Bloqueio de scroll do body enquanto aberto

   COMO FUNCIONA A ANIMAÇÃO:
   Em vez de trocar o src da imagem diretamente (o que causa
   o "corte" brusco), mantemos DUAS imagens sobrepostas:
     - A imagem atual (visível, opacity 1)
     - A imagem anterior (saindo, opacity 0)
   A transição CSS cuida do fade entre elas suavemente.
   Além do fade, aplicamos translateX para o efeito de slide
   lateral — para a esquerda ao avançar, para a direita ao voltar.
   ═══════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import imgClub1 from "./assets/img/club1.png";
import imgClub2 from "./assets/img/Club2.png";
import imgClub3 from "./assets/img/Club3.png";
import imgClub4 from "./assets/img/Club4.png";

/* Array de imagens do carrossel — a ordem define a sequência. */
const clubImages = [imgClub1, imgClub2, imgClub3, imgClub4];

function Carrossel({ onClose }) {

  /* ── ESTADO: SLIDE ATUAL ────────────────────────────────────
     currentIndex → qual imagem está visível agora.
     Começa em 0 (primeira imagem). */
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ── ESTADO: DIREÇÃO DA TRANSIÇÃO ───────────────────────────
     direction → "left" ao avançar, "right" ao voltar.
     Usada para animar o slide entrando pelo lado correto:
       Avançar: nova imagem entra pela direita → vai para esquerda
       Voltar:  nova imagem entra pela esquerda → vai para direita */
  const [direction, setDirection] = useState("left");

  /* ── ESTADO: CONTROLE DA ANIMAÇÃO ───────────────────────────
     isAnimating → true enquanto a transição está acontecendo.
     Bloqueia novos cliques durante a animação para evitar
     que o usuário pule dois slides de uma vez e quebre
     a sequência visual. */
  const [isAnimating, setIsAnimating] = useState(false);

  /* ── FUNÇÃO: TROCAR SLIDE ───────────────────────────────────
     changeSlide centraliza a lógica de troca:
       1. Ignora se já está animando (proteção contra duplo clique)
       2. Define a direção visual da animação
       3. Atualiza o índice
       4. Ativa isAnimating e desativa após 400ms (duração da CSS)
     O tempo de 400ms precisa bater com o transition-duration
     definido nos estilos inline das imagens abaixo. */
  const changeSlide = (newIndex, dir) => {
    if (isAnimating) return; /* ignora clique durante animação */
    setDirection(dir);
    setCurrentIndex(newIndex);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400); /* mesmo tempo da transition CSS */
  };

  /* ── NAVEGAÇÃO: PRÓXIMO ─────────────────────────────────────
     Avança um slide ou volta ao início (loop).
     Direção "left" = nova imagem entra pela direita. */
  const next = () => {
    const newIndex = currentIndex === clubImages.length - 1 ? 0 : currentIndex + 1;
    changeSlide(newIndex, "left");
  };

  /* ── NAVEGAÇÃO: ANTERIOR ────────────────────────────────────
     Volta um slide ou vai ao último (loop).
     Direção "right" = nova imagem entra pela esquerda. */
  const prev = () => {
    const newIndex = currentIndex === 0 ? clubImages.length - 1 : currentIndex - 1;
    changeSlide(newIndex, "right");
  };

  /* ── NAVEGAÇÃO: DOT CLICADO ─────────────────────────────────
     Ao clicar em um dot, determina a direção comparando
     o índice clicado com o atual:
       índice maior → avançando → direção "left"
       índice menor → voltando  → direção "right" */
  const goTo = (index) => {
    if (index === currentIndex) return; /* clique no dot já ativo: ignora */
    const dir = index > currentIndex ? "left" : "right";
    changeSlide(index, dir);
  };


  /* ── EFEITO: BLOQUEAR SCROLL DO BODY ────────────────────────
     Enquanto o modal estiver aberto, impede o scroll da página
     atrás do overlay. O cleanup restaura o valor original
     ao fechar o modal. */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);


  /* ── SWIPE ──────────────────────────────────────────────────
     Captura o toque inicial (onTouchStart), acompanha o
     movimento (onTouchMove) e decide a ação ao soltar
     (onTouchEnd).
     minSwipeDistance: 50px — movimentos menores que isso
     são ignorados para não trocar slide acidentalmente. */
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd,   setTouchEnd]   = useState(null);
  const [swipeHintVisible, setSwipeHintVisible] = useState(true);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      /* Swipe para esquerda → próximo slide */
      setSwipeHintVisible(false); /* esconde a dica após o primeiro swipe */
      next();
    }
    if (distance < -minSwipeDistance) {
      /* Swipe para direita → slide anterior */
      setSwipeHintVisible(false);
      prev();
    }
  };


  /* ── ESTILOS DE TRANSIÇÃO ───────────────────────────────────
     As imagens são posicionadas com absolute e sobrepostas.
     A animação acontece via transition em transform e opacity.

     imageStyle(isActive):
       isActive = true  → imagem visível, posição central (translateX 0)
       isActive = false → imagem saindo, desloca para o lado oposto

     A direção do deslocamento de saída é o inverso da entrada:
       direction "left"  → imagem sai para a esquerda  (-60px)
       direction "right" → imagem sai para a direita   (+60px)

     O valor de 60px é sutil — suficiente para perceber o
     movimento sem ser exagerado. Ajuste se quiser mais ou
     menos movimento. */
  const imageStyle = (isActive) => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    /* PERFORMANCE: só transform e opacity — roda na GPU */
    transition: "opacity 0.4s ease, transform 0.4s ease",
    opacity: isActive ? 1 : 0,
    transform: isActive
      ? "translateX(0)"                                    /* visível: centro          */
      : direction === "left"
        ? "translateX(-60px)"                              /* saindo para a esquerda   */
        : "translateX(60px)",                              /* saindo para a direita    */
    pointerEvents: isActive ? "auto" : "none",            /* só a ativa recebe cliques */
  });


  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full h-full overflow-hidden">

        {/* ── IMAGENS COM TRANSIÇÃO ─────────────────────────────
            Renderiza TODAS as imagens sobrepostas.
            Cada uma recebe o estilo calculado por imageStyle():
              - A ativa fica com opacity 1 e translateX(0)
              - As demais ficam com opacity 0 e deslocadas
            A transição CSS anima suavemente entre os estados.
            key={index} garante que o React não reutilize o
            mesmo elemento ao trocar de slide. */}
        {clubImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Clube The Best — slide ${index + 1}`}
            style={imageStyle(index === currentIndex)}
          />
        ))}


        {/* ── BOTÃO VOLTAR ──────────────────────────────────────
            Fixo no canto superior esquerdo, acima das imagens.
            z-30 garante que fique na frente de tudo. */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-30 bg-[#feb32b] hover:scale-105 transition-transform duration-300 rounded-xl px-6 py-3 shadow-lg"
        >
          Voltar ao início
        </button>


        {/* ── SETA ESQUERDA (ANTERIOR) ──────────────────────────
            Posicionada no meio vertical esquerdo.
            Mesmo estilo visual das setas do carrossel primário
            (.arrowBtn) para consistência visual.
            isAnimating desabilita durante a transição. */}
        <button
          onClick={prev}
          disabled={isAnimating}
          className="arrowBtn arrowBtn--left z-30"
          aria-label="Slide anterior"
        >
          ‹
        </button>


        {/* ── SETA DIREITA (PRÓXIMO) ────────────────────────────
            Espelho da seta esquerda. */}
        <button
          onClick={next}
          disabled={isAnimating}
          className="arrowBtn arrowBtn--right z-30"
          aria-label="Próximo slide"
        >
          ›
        </button>


        {/* ── DOTS DE NAVEGAÇÃO ─────────────────────────────────
            Um dot para cada imagem, posicionados na parte
            inferior central do modal.
            Dot ativo → branco opaco, ligeiramente maior.
            Dot inativo → branco semitransparente, menor.
            Ao clicar: chama goTo(index) que calcula a direção
            e faz a transição suave para aquele slide.
            isAnimating desabilita cliques durante a transição. */}
        <div
          className="absolute bottom-20 w-full flex justify-center gap-2 z-30"
          style={{ bottom: currentIndex === 0 ? "220px" : "24px" }}
          /* Quando está no slide dos QR codes (index 0), os dots
             sobem para não ficar sobre os QR codes. */
        >
          {clubImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              disabled={isAnimating}
              aria-label={`Ir para slide ${index + 1}`}
              style={{
                width:  index === currentIndex ? "28px" : "10px",
                height: "10px",
                borderRadius: "999px",       /* pill quando ativo, círculo quando inativo */
                background: "white",
                opacity: index === currentIndex ? 1 : 0.4,
                border: "none",
                cursor: "pointer",
                padding: 0,
                /* PERFORMANCE: só transform e opacity */
                transition: "width 0.3s ease, opacity 0.3s ease",
                /* Dot ativo vira pill (width 28px) — mesmo padrão
                   do carrossel primário */
              }}
            />
          ))}
        </div>


        {/* ── CONTEÚDO EXCLUSIVO DO SLIDE 0 (QR CODES) ─────────
            Só aparece na primeira imagem.
            Inclui a dica de swipe (some após o primeiro arrasto)
            e os dois QR codes para download do app. */}
        {currentIndex === 0 && (
          <>
            {/* Dica de swipe — some após o primeiro swipe */}
            {swipeHintVisible && (
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20">
                <span className="swipe-hint text-white/60 text-6xl">‹</span>
                <span className="swipe-hint text-white/60 text-6xl">›</span>
              </div>
            )}

            {/* QR Codes para Google Play e App Store */}
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
