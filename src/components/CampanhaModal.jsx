import "../styles/CampanhaModal.css";
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
  if (!openCampaign || !campaignInuse) return null;

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Botão fechar */}
      <button onClick={onClose} className="campaignCloseBtn">
        ✕
      </button>

      <div className="w-full h-full overflow-hidden">
        {/* Track: translateX move qual slide está visível */}
        <div
          className="flex h-full transition-transform duration-500"
          style={{ transform: `translateX(-${campaignIndex * 100}%)` }}
        >
          {campaignInuse.map((item) => (
            <div key={item.id} className="w-full h-full flex-shrink-0">
              {/* Detecta tipo pela extensão: .mp4 → vídeo, resto → imagem */}
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
                  alt={item.alt}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          ))}
        </div>

        {/* Setas — reutilizam .arrowBtn do App.css */}
        <button onClick={onPrev} className="arrowBtn arrowBtn--left">
          ‹
        </button>
        <button onClick={onNext} className="arrowBtn arrowBtn--right">
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {campaignInuse.map((_, i) => (
            <button
              key={i}
              onClick={() => onDotClick(i)}
              className={`w-2 h-2 rounded-full ${i === campaignIndex ? "bg-[#feb32b]" : "bg-white/60"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
