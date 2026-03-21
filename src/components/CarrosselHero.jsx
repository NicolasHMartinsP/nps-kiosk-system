/* CarrosselHero.jsx — Carrossel do hero + faixa "Saiba mais". Documentação: README.md → Componentes → CarrosselHero.jsx */
import "../styles/CarrosselHero.css";
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
          {/* Track: translateX move qual slide está visível */}
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

          {/* Setas — reutilizam .arrowBtn do App.css */}
          <button onClick={onPrev} className="arrowBtn arrowBtn--left">
            ‹
          </button>
          <button onClick={onNext} className="arrowBtn arrowBtn--right">
            ›
          </button>

          {/* Dots — laranja = ativo, branco semitransparente = inativo */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => onDotClick(i)}
                className={`w-2 h-2 rounded-full ${i === currentIndex ? "bg-[#feb32b]" : "bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Faixa abaixo do carrossel — botão só aparece se o slide tiver campanha vinculada */}
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
