/* Modal.jsx — Formulário de avaliação (notas 1–5 + texto). Documentação: README.md → Componentes → Modal.jsx */

import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Modal({ onClose, cidade }) {

  /* Perguntas definidas como dados — adicionar uma nova não requer mudança na lógica */
  const Questions = [
    { id: "Pergunta1", texto: "Nossa equipe prestou um atendimento de qualidade?",        tipo: "Nota"  },
    { id: "Pergunta2", texto: "O nosso espaço estava limpo e organizado?",                tipo: "Nota"  },
    { id: "Pergunta3", texto: "O buffet estava abastecido e com variedade de opções?",    tipo: "Nota"  },
    { id: "Observacao", texto: "Deixe aqui sua observação ou sugestão para melhorarmos ainda mais!", tipo: "texto" },
  ];

  /* Estado inicial gerado automaticamente a partir do array de perguntas */
  const initialAnswers = Questions.reduce((acc, q) => {
    acc[q.id] = q.tipo === "texto" ? "" : null;
    return acc;
  }, {});

  const [question, setQuestion] = useState(0);
  const [finish,   setFinish]   = useState(false);
  const [answers,  setAnswers]  = useState(initialAnswers);

  const next  = () => { if (question < Questions.length - 1) setQuestion(question + 1); };
  const prev  = () => { if (question > 0) setQuestion(question - 1); };
  const handleCancel = () => { if (typeof onClose === "function") onClose(); };
  const handleAnswer = (value) => {
    const id = Questions[question].id;
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const notas = Questions.filter((q) => q.tipo === "Nota").map((q) => answers[q.id]);
    const media = notas.reduce((a, b) => a + b, 0) / notas.length;

    const data = {
      ...answers,
      media,
      horario: serverTimestamp(),
      dia: new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" }),
      cidade,
    };

    try {
      await addDoc(collection(db, "respostas"), data);
      setFinish(true);
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error("Erro ao salvar", error);
    }
  };

  return (
    <div className="ModalOverlay">
      <div className="modalContainer">

        {/* Tela de confirmação após envio */}
        {finish ? (
          <div className="finishContainer">
            <div className="checkIcon">✓</div>
            <h1>Obrigado por participar!</h1>
            <p>Sua opinião nos ajuda a melhorar.</p>
          </div>
        ) : (
          <>
            {/* Cabeçalho: botão X + contador de progresso */}
            <div className="modalHeader">
              <button className="closeBtn" onClick={handleCancel}>X</button>
              <span>{question + 1}/{Questions.length}</span>
            </div>

            {/* Texto da pergunta atual */}
            <div className="modalQuestion">
              <h1>{Questions[question].texto}</h1>
            </div>

            {/* Botões de nota 1–5 */}
            {Questions[question].tipo === "Nota" && (
              <div className="avaliacao">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`nota nota-${num} ${answers[Questions[question].id] === num ? "selecionado" : ""}`}
                    onClick={() => handleAnswer(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}

            {/* Campo de texto livre */}
            {Questions[question].tipo === "texto" && (
              <div className="observacao">
                <textarea
                  placeholder="Digite sua sugestão..."
                  value={answers.Observacao}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, Observacao: e.target.value }))}
                />
              </div>
            )}

            {/* Navegação: Voltar / Avançar / Enviar */}
            <div className="navigation">
              <div className="navLeft">
                {question > 0 && (
                  <button className="voltarBtn" onClick={prev}>Voltar</button>
                )}
              </div>
              <div className="navRight">
                {question < Questions.length - 1 && answers[Questions[question].id] && (
                  <button className="nextBtn" onClick={next}>Avançar</button>
                )}
                {question === Questions.length - 1 && (
                  <button className="submitBtn" onClick={handleSubmit}>Enviar</button>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Modal;
