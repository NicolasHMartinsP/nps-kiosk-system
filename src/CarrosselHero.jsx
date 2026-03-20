/* ═══════════════════════════════════════════════════════════
   CarrosselHero.jsx
   Carrossel de imagens promocionais (faixa preta abaixo do hero).
   Recebe tudo via props — não tem estado próprio.

   Props:
     images        → array de slides { id, src, alt }
     currentIndex  → índice do slide ativo
     onNext        → fn para avançar
     onPrev        → fn para voltar
     onDotClick(i) → fn para ir direto a um slide
     onTouchStart  → handler de toque
     onTouchMove   → handler de toque
     onTouchEnd    → handler de toque

     currentHasCampaign → boolean: slide ativo tem campanha?
     onSaibaMais        → fn abre o modal de campanha
   ═══════════════════════════════════════════════════════════ */

export default function CarrosselHero({
  images,
  currentIndex,
  onNext,
  onPrev,
  onDotClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  currentHasCampaign,
  onSaibaMais,
}) {
  return (
    <div className="separador">
      <div className="carrosselWrapper">
        <div
          className="relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Track: todos os slides lado a lado */}
          {/* translateX move qual slide está visível */}
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image) => (
              <img
                key={image.id}
                src={image.src}
                alt={image.alt}
                className="w-full flex-shrink-0 object-contain"
              />
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

          {/* Dots — amarelo = ativo, branco semitransparente = inativo */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => onDotClick(i)}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex ? "bg-[#feb32b]" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Faixa abaixo do carrossel — sempre presente para manter padding */}
      {/* O botão só aparece quando o slide atual tem campanha vinculada */}
      <div className="saibaMaisFaixa">
        {currentHasCampaign && (
          <button onClick={onSaibaMais} className="glowButton saibaMaisBtn">
            Saiba mais
          </button>
        )}
      </div>
    </div>
  );
}
