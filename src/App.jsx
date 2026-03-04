import { useState, useEffect } from "react";
import "./App.css";
import LogoFloating from "./LogoFloating";
import img1 from "./assets/img/carrossel1.webp";
import img2 from "./assets/img/carrossel2.webp";
import img3 from "./assets/img/carrossel3.png";
import imgClub from "./assets/img/TheBestClub1.png";
import { QRCodeCanvas } from "qrcode.react";

const images = [
  { id: "img1", src: img1, alt: "Batatinha" },
  { id: "img2", src: img2, alt: "Cenourinha" },
  { id: "img3", src: img3, alt: "Mandioquinha" },
];
function App() {
  // 1. Estados
  const [modalOpen, setModalOpen] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const [ClubF, SetClubF] = useState(false);
  // 2. Funções
  const handleClick = (imageId) => {
    setClickedImage(imageId);
    setModalOpen(true);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 3. JSX (estrutura visual)
  return (
    <>
      <div className="Hover">
        <LogoFloating></LogoFloating>
        <h1 id="titleSearch">
          Nossa <span className="highlight">qualidade</span> depende de{" "}
          <span className="highlight">você</span>
          <span className="linhabaixa">
            deixe a <span className="highlight">sua</span> avaliação!
          </span>
        </h1>
      </div>
      <div className="BotaoModal">
        <button
          className="bg-yellow-400 text-black font-bold py-2 px-4 rounded"
          onClick={() => handleClick("botao-principal")}
        >
          Participe aqui!
        </button>
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-orange-400 p-10 rounded-lg transition-all duration-300 scale-100">
              <p>Modal aberto!</p>
              <p>Origem: {clickedImage}</p>
              <button onClick={() => setModalOpen(false)}>Fechar</button>
            </div>
          </div>
        )}
      </div>
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
              onClick={() => handleClick(image.id)}
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
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative">
        <div className="relative w-full max-w-5xl">
          <img src={imgClub} alt="Clube The Best" className="w-full h-auto" />
          <div className="absolute bottom-[7%] left-0 w-full flex justify-center">
            <div className="flex items-center">
              <div className="mr-16 bg-white p-3 rounded-lg shadow-lg">
                <QRCodeCanvas
                  value={
                    "https://play.google.com/store/apps/details?id=com.amatech.thebestclubapp&pli=1"
                  }
                  size={160}
                />
              </div>
              <div className=" ml-16 bg-white p-3 rounded-lg shadow-lg">
                <QRCodeCanvas
                  value={
                    "https://apps.apple.com/br/app/clube-the-best/id6463561926"
                  }
                  size={160}
                />
              </div>
            </div>
          </div>
          <div>
            <button onClick={() => SetClubF(true)}>Saiba mais</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
