/* ═══════════════════════════════════════════════════════════
   CampanhaModal.jsx
   Modal fullscreen que exibe as mídias de uma campanha.
   Suporta imagens e vídeos (.mp4), setas, dots e swipe.
   Só renderiza quando openCampaign === true.

   Props:
     openCampaign      → boolean: exibe ou esconde o modal
     campaignInuse     → array de mídias { id, src, alt }
     campaignIndex     → índice do slide ativo na campanha
     onClose           → fn fecha o modal
     onNext            → fn avança slide
     onPrev            → fn volta slide
     onDotClick(i)     → fn vai direto a um slide
     onTouchStart      → handler de swipe
     onTouchMove       → handler de swipe
     onTouchEnd        → handler de swipe
   ═══════════════════════════════════════════════════════════ */

export default function CampanhaModal({
  openCampaign,
  campaignInuse,
  campaignIndex,
  onClose,
  onNext,
  onPrev,
  onDotClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) {

  // Não renderiza nada se o modal estiver fechado ou sem campanha
  if (!openCampaign || !campaignInuse) return null;

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >

      {/* Botão fechar — canto superior direito */}
      <button onClick={onClose} className="campaignCloseBtn">
        ✕
      </button>

      <div className="w-full h-full overflow-hidden">

        {/* Track da campanha */}
        <div
          className="flex h-full transition-transform duration-500"
          style={{ transform: `translateX(-${campaignIndex * 100}%)` }}
        >
          {campaignInuse.map((item) => (
            <div key={item.id} className="w-full h-full flex-shrink-0">

              {/* Detecta vídeo pela extensão — .mp4 → <video>, resto → <img> */}
              {item.src.endsWith(".mp4") ? (
                <video
                  src={item.src}
                  autoPlay loop muted playsInline preload="auto"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-contain"
                />
              )}

            </div>
          ))}
        </div>

        {/* Seta esquerda */}
        <button onClick={onPrev} className="arrowBtn arrowBtn--left">
          ‹
        </button>

        {/* Seta direita */}
        <button onClick={onNext} className="arrowBtn arrowBtn--right">
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {campaignInuse.map((_, i) => (
            <button
              key={i}
              onClick={() => onDotClick(i)}
              className={`w-2 h-2 rounded-full ${
                i === campaignIndex ? "bg-[#feb32b]" : "bg-white/60"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
