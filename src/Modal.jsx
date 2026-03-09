import { useState } from "react";
function Modal({ onClose }) {
  //função que controla qual pergunta ta ativa
  const [question, SetQuestion] = useState(0);
  //função que controla as respostas
  const [answers, setAnswers] = useState({
    pergunta1: "",
    pergunta2: "",
    pergunta3: "",
    observacao: "",
  });
  // perguntas
  const Questions = [
    "Nossa equipe prestou um bom atendimento?",
    "como você avalia a limpeza, organização e conforto do ambiente?",
    "o buffet estava cheio, limpo e organizado?",
    "Deixe aqui sua observação ou sugestão para melhorarmos ainda mais!",
  ];
  //contasntes para as ações do modal
  const next = () => {
    if (question < Questions.length - 1) SetQuestion(question + 1);
  };
  const prev = () => {
    if (question > 0) SetQuestion(question - 1);
  };
  const handleCancel = () => {
    // call the prop to close the modal
    if (typeof onClose === "function") {
      onClose();
    }
  };
  const handleAnswer = () => {};

  const handleSubmit = () => {};

  return (
    <div className="ModalOverlay">
      <div className="modalContainer">
        <div className="modalHeader">
          <button onClick={prev}>Voltar</button>
          <span>
            {question + 1}/{Questions.length}
          </span>
          <button onClick={next}>Avançar</button>
        </div>

        <div className="modalQuestion">
          <h1>{Questions[question]}</h1>
        </div>

        <div className="avaliacao">
          <button onClick={() => handleAnswer(1)}>1</button>
          <button onClick={() => handleAnswer(2)}>2</button>
          <button onClick={() => handleAnswer(3)}>3</button>
          <button onClick={() => handleAnswer(4)}>4</button>
          <button onClick={() => handleAnswer(5)}>5</button>
        </div>

        <div className="actions">
          <button onClick={handleSubmit}>Enviar</button>
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
