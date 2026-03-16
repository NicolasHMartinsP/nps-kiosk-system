// Hook do React usado para armazenar estado dentro do componente
// Estado = dados que mudam durante a execução da interface
import { useState } from "react";

// conexão com o banco Firestore configurada no arquivo firebase.js
// isso permite que o componente envie dados para o banco
import { db } from "./firebase";

// funções do Firestore usadas para escrever dados
// collection -> aponta para uma coleção do banco
// addDoc -> cria um novo documento
// serverTimestamp -> salva o horário do servidor do Firebase (mais confiável que o relógio do usuário)
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Modal({ onClose, cidade }) {
  // ARRAY DE CONFIGURAÇÃO DAS PERGUNTAS
  // Aqui definimos as perguntas de forma estruturada
  // Essa abordagem é chamada de "data-driven UI"
  // Ou seja: a interface é gerada a partir de dados
  // Muito usada em formulários dinâmicos
  const Questions = [
    {
      id: "Pergunta1",
      texto: "Nossa equipe prestou um atendimento de qualidade?",
      tipo: "Nota",
    },
    {
      id: "Pergunta2",
      texto: "O nosso espaço estava limpo e organizado?",
      tipo: "Nota",
    },
    {
      id: "Pergunta3",
      texto: "O buffet estava abastecido e com variedade de opções?",
      tipo: "Nota",
    },
    {
      id: "Observacao",
      texto:
        "Deixe aqui sua observação ou sugestão para melhorarmos ainda mais!",
      tipo: "texto",
    },
  ];

  // CRIA O ESTADO INICIAL DAS RESPOSTAS AUTOMATICAMENTE
  // reduce percorre o array de perguntas e cria um objeto
  // exemplo final:
  // {
  //   Pergunta1: null,
  //   Pergunta2: null,
  //   Pergunta3: null,
  //   Observacao: ""
  // }
  // vantagem: se adicionar novas perguntas, o sistema já se adapta
  const initialAnswers = Questions.reduce((acc, q) => {
    acc[q.id] = q.tipo === "texto" ? "" : null;
    return acc;
  }, {});

  // índice da pergunta atual
  // usado para navegar entre perguntas
  const [question, setQuestion] = useState(0);

  // controla se o formulário terminou
  // quando true mostra tela de agradecimento
  const [finish, setFinish] = useState(false);

  // estado que guarda as respostas do usuário
  const [answers, setAnswers] = useState(initialAnswers);

  // AVANÇAR PERGUNTA
  // garante que não passe do tamanho do array
  const next = () => {
    if (question < Questions.length - 1) {
      setQuestion(question + 1);
    }
  };

  // VOLTAR PERGUNTA
  const prev = () => {
    if (question > 0) {
      setQuestion(question - 1);
    }
  };

  // função para fechar o modal
  // verifica se onClose existe para evitar erro
  const handleCancel = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  // SALVA UMA RESPOSTA NUMA PERGUNTA
  // lógica:
  // identifica qual pergunta está ativa
  // salva o valor no estado answers
  const handleAnswer = (value) => {
    const id = Questions[question].id;

    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ENVIO DO FORMULÁRIO
  const handleSubmit = async () => {
    // pega apenas perguntas do tipo nota
    // usado para calcular média
    const notas = Questions.filter((q) => q.tipo === "Nota").map(
      (q) => answers[q.id],
    );

    // calcula média das notas
    // reduce soma os valores
    const media = notas.reduce((a, b) => a + b, 0) / notas.length;

    // objeto que será salvo no banco
    const data = {
      ...answers, // espalha todas as respostas

      // média calculada
      // isso facilita análise e gráficos depois
      media,

      // timestamp do servidor firebase
      // evita erro de fuso horário do usuário
      horario: serverTimestamp(),

      // data no formato YYYY-MM-DD
      // usado para gráficos por dia
      dia: new Date().toLocaleDateString("sv-SE", {
        timeZone: "America/Sao_Paulo",
      }),

      // cidade enviada pelo componente pai
      cidade: cidade,
    };

    try {
      // cria documento dentro da coleção "respostas"
      // Firestore gera um ID automaticamente
      await addDoc(collection(db, "respostas"), data);

      // ativa tela de finalização
      setFinish(true);

      // fecha modal após 2 segundos
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      // tratamento de erro caso falhe comunicação com banco
      console.error("Erro ao salvar", error);
    }
  };

  return (
    <div className="ModalOverlay">
      <div className="modalContainer">
        {/* TELA FINAL */}
        {finish ? (
          <div className="finishContainer">
            <div className="checkIcon">✓</div>
            <h1>Obrigado por participar!</h1>
            <p>Sua opinião nos ajuda a melhorar.</p>
          </div>
        ) : (
          <>
            {/* CABEÇALHO */}
            <div className="modalHeader">
              <button className="closeBtn" onClick={handleCancel}>
                X
              </button>

              {/* contador de progresso */}
              <span>
                {question + 1}/{Questions.length}
              </span>
            </div>

            {/* TEXTO DA PERGUNTA */}
            <div className="modalQuestion">
              <h1>{Questions[question].texto}</h1>
            </div>

            {/* PERGUNTAS DE NOTA */}
            {Questions[question].tipo === "Nota" && (
              <div className="avaliacao">
                {/* gera botões de 1 a 5 */}
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`nota nota-${num} ${
                      answers[Questions[question].id] === num
                        ? "selecionado"
                        : ""
                    }`}
                    onClick={() => handleAnswer(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}

            {/* PERGUNTA DE TEXTO */}
            {Questions[question].tipo === "texto" && (
              <div className="observacao">
                <textarea
                  placeholder="Digite sua sugestão..."
                  value={answers.Observacao}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      Observacao: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            {/* NAVEGAÇÃO */}
            <div className="navigation">
              {/* botão voltar */}
              <div className="navLeft">
                {question > 0 && (
                  <button className="voltarBtn" onClick={prev}>
                    Voltar
                  </button>
                )}
              </div>

              {/* botão avançar */}
              <div className="navRight">
                {question < Questions.length - 1 &&
                  answers[Questions[question].id] && (
                    <button className="nextBtn" onClick={next}>
                      Avançar
                    </button>
                  )}

                {/* botão enviar */}
                {question === Questions.length - 1 && (
                  <button className="submitBtn" onClick={handleSubmit}>
                    Enviar
                  </button>
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
