import { useState } from "react";
import "./App.css";
import LogoFloating from "./LogoFloating";
function App() {
  // 1. Estados
  const [modalOpen, setModalOpen] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);

  // 2. Funções
  const handleClick = (imageId) => {
    setClickedImage(imageId);
    setModalOpen(true);
  };

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
        <button onClick={() => handleClick("botao-principal")}>
          Participe aqui!
        </button>
        {modalOpen && (
          <div style={{ background: "gray", color: "white", padding: 20 }}>
            <p>Modal aberto!</p>
            <p>Origem: {clickedImage}</p>
            <button onClick={() => setModalOpen(false)}>Fechar</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
