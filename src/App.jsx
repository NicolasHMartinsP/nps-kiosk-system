/* ═══════════════════════════════════════════════════════════
   App.jsx — Orquestrador principal da aplicação
   ═══════════════════════════════════════════════════════════

   RESPONSABILIDADE ÚNICA:
   Montar a página conectando componentes, hooks e estado.
   Este arquivo NÃO contém lógica de carrossel, swipe,
   campanha nem animação — cada coisa vive no seu próprio
   arquivo. Aqui só existe cola.

   MAPA DO PROJETO:
   ┌─ Dados ──────────────────────────────────────────────┐
   │  campaignData.js   → imagens do carrossel + campanhas │
   └──────────────────────────────────────────────────────┘
   ┌─ Hooks (lógica pura, sem JSX) ───────────────────────┐
   │  useCarrossel.js   → índice ativo, autoplay, swipe   │
   │  useCampanha.js    → modal de campanha, slide interno │
   └──────────────────────────────────────────────────────┘
   ┌─ Componentes (JSX) ──────────────────────────────────┐
   │  LogoFloating.jsx  → logo fixo canto superior esq.   │
   │  CarrosselHero.jsx → slides + faixa "saiba mais"     │
   │  CampanhaModal.jsx → modal fullscreen de campanha    │
   │  Modal.jsx         → modal de avaliação (notas 1–5)  │
   │  carrossel.jsx     → modal do Clube The Best         │
   └──────────────────────────────────────────────────────┘

   ORDEM DE RENDERIZAÇÃO NA TELA:
     1. Hero          → fundo preto, tagline + botão avaliar
     2. CarrosselHero → imagens rotativas + faixa saiba mais
     3. CampanhaModal → aparece sobre tudo (portal fullscreen)
     4. Clube         → banner + botão "saiba mais"
     5. Modal         → avaliação (montado só quando aberto)
     6. Carrossel     → clube    (montado só quando aberto)
   ═══════════════════════════════════════════════════════════ */


/* ── DEPENDÊNCIA EXTERNA ──────────────────────────────────────
   useState: hook do React que cria uma variável reativa.
   Quando o valor muda, o componente re-renderiza
   automaticamente. Usado aqui para controlar se os
   modais de Avaliação e Clube estão abertos ou fechados.
   ─────────────────────────────────────────────────────────── */
import { useState } from "react";

/* ── ESTILOS GLOBAIS ──────────────────────────────────────────
   App.css define animações, fontes, modal, botões e carrossel.
   Importar aqui aplica os estilos para toda a árvore abaixo.
   ─────────────────────────────────────────────────────────── */
import "./App.css";


/* ══════════════════════════════════════════════════════════════
   COMPONENTES
   Cada import traz o JSX responsável por uma seção visual.
   Separar em arquivos mantém o App.jsx enxuto e cada
   componente testável e reutilizável de forma independente.
   ══════════════════════════════════════════════════════════════ */

/* Logo fixo no canto superior esquerdo da tela.
   Fica acima de tudo (z-index alto no CSS) e não
   some durante o scroll — daí o nome "floating". */
import LogoFloating  from "./LogoFloating";

/* Carrossel de imagens do hero com dots de navegação,
   setas prev/next e suporte a swipe em touch.
   Inclui a faixa preta com botão "Saiba mais" abaixo. */
import CarrosselHero from "./CarrosselHero";

/* Modal fullscreen que abre ao clicar em "Saiba mais".
   Exibe os slides internos de uma campanha específica.
   Só renderiza quando openCampaign === true. */
import CampanhaModal from "./CampanhaModal";

/* Modal de avaliação com notas de 1 a 5, campo de
   observação e envio para o Firestore.
   Recebe a cidade via prop para identificar a loja. */
import Modal         from "./Modal";

/* Modal do Clube The Best — carrossel de benefícios.
   Nome em minúsculo por convenção do arquivo original;
   internamente funciona igual aos outros modais. */
import Carrossel     from "./carrossel";


/* ══════════════════════════════════════════════════════════════
   ASSETS
   Imagens importadas diretamente pelo Vite.
   O bundler resolve o caminho, aplica hash no nome do arquivo
   para cache-busting e otimiza o output final.
   ══════════════════════════════════════════════════════════════ */

/* Banner da seção Clube — imagem de fundo do bloco inferior. */
import imgClube from "./assets/img/STORY5.png";


/* ══════════════════════════════════════════════════════════════
   DADOS E HOOKS
   Importados separadamente dos componentes para deixar
   claro o que é "dado" e o que é "comportamento".
   ══════════════════════════════════════════════════════════════ */

/* images     → array com as fotos do carrossel hero.
   campaignMap → objeto que mapeia cada índice de slide
                 para os dados da campanha correspondente
                 (título, imagens internas, descrição).
   Centralizar aqui evita repetir os dados em vários arquivos. */
import { images, campaignMap } from "./campaignData";

/* Hook do carrossel hero.
   Encapsula: qual slide está ativo (currentIndex),
   funções nextSlide / prevSlide / goTo e autoplay de 5s.
   Recebe o array `images` para saber o total de slides. */
import { useCarrossel } from "./useCarrossel";

/* Hook do modal de campanha.
   Encapsula: qual campanha está aberta, índice do slide
   interno, handlers de abrir/fechar e swipe do modal.
   Precisa do currentIndex do carrossel para saber qual
   campanha exibir quando o usuário clica em "Saiba mais". */
import { useCampanha }  from "./useCampanha";


/* ═══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL — App
   ═══════════════════════════════════════════════════════════ */
function App() {

  /* ── LEITURA DA URL: ?cidade= ─────────────────────────────
     A URL pode conter ?cidade=curitiba (ou outro nome).
     Isso identifica qual franquia está usando o sistema
     sem precisar de login — cada loja recebe um link único.

     URLSearchParams lê a query string da URL atual.
     O || "desconhecida" é um fallback: se a URL não tiver
     o parâmetro, o campo não fica vazio no banco de dados.

     Esse valor é passado pro Modal de avaliação, que o
     inclui em cada resposta gravada no Firestore.
     ─────────────────────────────────────────────────────── */
  const cidade =
    new URLSearchParams(window.location.search).get("cidade") || "desconhecida";


  /* ── HOOK: CARROSSEL HERO ─────────────────────────────────
     Toda a lógica do carrossel fica aqui, fora do JSX.
     O objeto `carrossel` expõe só o que o render precisa:
       .currentIndex  → qual slide está visível agora
       .nextSlide     → avança um slide (ou volta ao início)
       .prevSlide     → volta um slide (ou vai ao último)
       .goTo(n)       → pula direto para o slide n (dots)
       .onTouchStart  → registra ponto inicial do swipe
       .onTouchMove   → calcula direção do arrasto
       .onTouchEnd    → decide se muda de slide ou cancela
     ─────────────────────────────────────────────────────── */
  const carrossel = useCarrossel(images);


  /* ── HOOK: MODAL DE CAMPANHA ──────────────────────────────
     Controla o modal que abre ao clicar em "Saiba mais".
     Precisa de currentIndex para saber qual campanha abrir
     (cada slide do hero pode ter uma campanha diferente).

     O objeto `campanha` expõe:
       .openCampaign        → boolean: modal aberto?
       .campaignInuse       → dados da campanha ativa
       .campaignIndex       → slide interno atual
       .currentHasCampaign  → slide atual tem campanha?
       .handleSaibaMais     → abre o modal com os dados certos
       .handleClose         → fecha e limpa o estado
       .nextCampaignSlide   → avança slide interno
       .prevCampaignSlide   → volta slide interno
       .goToCampaignSlide   → pula slide interno (dots)
       .onTouchStart/Move/End → swipe interno do modal
     ─────────────────────────────────────────────────────── */
  const campanha = useCampanha(images, carrossel.currentIndex, campaignMap);


  /* ── ESTADO: MODAIS SIMPLES ───────────────────────────────
     Avaliação e Clube só precisam saber se estão abertos
     ou fechados — um boolean já resolve.
     Não há lógica interna aqui (slides, swipe etc.),
     por isso não precisam de hook próprio.

     useState(false) → começa fechado.
     set[Modal/Club]Open(true/false) → abre ou fecha.
     ─────────────────────────────────────────────────────── */
  const [modalOpen, setModalOpen] = useState(false); // Modal de avaliação
  const [clubOpen,  setClubOpen]  = useState(false); // Modal do Clube


  /* ═════════════════════════════════════════════════════════
     RENDER
     O Fragment (<>) evita criar um div extra no DOM.
     Cada bloco comentado corresponde a uma seção da página.
     ═════════════════════════════════════════════════════════ */
  return (
    <>

      {/* ── 1. HERO ─────────────────────────────────────────────
          Seção de entrada da página.
          Fundo preto definido pela classe .Hover no CSS.
          Contém: logo fixo, tagline, título e botão avaliar.

          O botão chama setModalOpen(true), que monta o
          componente <Modal> mais abaixo (renderização condicional).
          ───────────────────────────────────────────────────── */}
      <div className="Hover">

        {/* Logo fixo no canto — renderizado aqui mas fica
            fora do fluxo (position: fixed no CSS). */}
        <LogoFloating />

        {/* Bloco de texto: tagline acima, título grande abaixo. */}
        <div className="heroText">
          <p className="heroTagline">nos ajude a fazer o nosso melhor</p>
          <h1 className="heroTitle">
            Deixe a sua <span className="highlight">avaliação!</span>
            {/* .highlight aplica cor laranja apenas nesta palavra. */}
          </h1>
        </div>

        {/* Botão principal de chamada para ação.
            .glowButton → animação de pulso (definida no CSS).
            .avaliarBtn → tamanho, cor e forma do pill laranja.
            onClick abre o modal de avaliação. */}
        <button
          className="glowButton avaliarBtn"
          onClick={() => setModalOpen(true)}
        >
          Avaliar agora!
        </button>

      </div>


      {/* ── 2. CARROSSEL HERO + FAIXA SAIBA MAIS ───────────────
          Componente que renderiza as imagens rotativas do hero
          e a faixa preta com o botão "Saiba mais" abaixo.

          Props de navegação (next, prev, goTo, dots):
          → vêm do hook useCarrossel.

          Props de swipe (onTouchStart/Move/End):
          → também do hook, tratam toque em mobile.

          currentHasCampaign:
          → boolean que diz se o slide atual tem campanha.
          → CarrosselHero usa isso pra mostrar/esconder
            o botão "Saiba mais".

          onSaibaMais:
          → abre o CampanhaModal com os dados do slide atual.
          ───────────────────────────────────────────────────── */}
      <CarrosselHero
        images={images}
        currentIndex={carrossel.currentIndex}
        onNext={carrossel.nextSlide}
        onPrev={carrossel.prevSlide}
        onDotClick={carrossel.goTo}
        onTouchStart={carrossel.onTouchStart}
        onTouchMove={carrossel.onTouchMove}
        onTouchEnd={carrossel.onTouchEnd}
        currentHasCampaign={campanha.currentHasCampaign}
        onSaibaMais={campanha.handleSaibaMais}
      />


      {/* ── 3. MODAL DE CAMPANHA ────────────────────────────────
          Modal fullscreen com os slides internos de uma campanha.
          Sempre está no DOM, mas só aparece quando
          openCampaign === true (o CSS/lógica interna esconde).

          Diferente dos outros modais (Avaliação e Clube),
          este não usa renderização condicional ({x && <Comp/>})
          porque precisa manter o estado de slide interno
          mesmo quando está fechando (animação de saída).
          ───────────────────────────────────────────────────── */}
      <CampanhaModal
        openCampaign={campanha.openCampaign}       // boolean: exibe ou esconde
        campaignInuse={campanha.campaignInuse}     // dados da campanha ativa
        campaignIndex={campanha.campaignIndex}     // slide interno atual
        onClose={campanha.handleClose}             // fecha e limpa estado
        onNext={campanha.nextCampaignSlide}        // avança slide interno
        onPrev={campanha.prevCampaignSlide}        // volta slide interno
        onDotClick={campanha.goToCampaignSlide}    // pula para slide n
        onTouchStart={campanha.onTouchStart}       // início do swipe
        onTouchMove={campanha.onTouchMove}         // arrasto
        onTouchEnd={campanha.onTouchEnd}           // fim do swipe
      />


      {/* ── 4. SEÇÃO CLUBE THE BEST ─────────────────────────────
          Banner fixo com imagem de fundo e botão de CTA.
          Ocupa a altura total da tela (min-h-screen).

          O botão chama setClubOpen(true), que monta o
          componente <Carrossel> (modal do clube) abaixo.

          Classes Tailwind usadas:
            w-full           → largura total
            min-h-screen     → pelo menos 100vh de altura
            flex/items/justify → centraliza o botão
            relative         → âncora para o clubeBtn (position: absolute)
          ───────────────────────────────────────────────────── */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative">

        {/* Banner visual da seção — ocupa toda a largura. */}
        <img src={imgClube} alt="Clube The Best" className="w-full object-cover" />

        {/* Botão flutuante sobre a imagem.
            .clubeBtn → position: absolute (no CSS), fica
            ancorado no bottom da section acima.
            .glowButton → mesmo pulso laranja do hero. */}
        <button
          onClick={() => setClubOpen(true)}
          className="glowButton clubeBtn"
        >
          Clique aqui e saiba mais!
        </button>

      </section>


      {/* ── 5. MODAL DE AVALIAÇÃO ───────────────────────────────
          Renderização condicional: o componente só existe
          no DOM enquanto modalOpen === true.
          Isso economiza memória e evita re-renders
          desnecessários quando o modal está fechado.

          onClose → seta modalOpen para false, desmontando
          o componente e limpando seu estado interno.

          cidade → identifica a franquia no Firestore.
          Vem do query param ?cidade= lido no topo.
          ───────────────────────────────────────────────────── */}
      {modalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          cidade={cidade}
        />
      )}


      {/* ── 6. MODAL DO CLUBE ───────────────────────────────────
          Mesmo padrão do Modal de avaliação:
          só montado quando clubOpen === true.

          onClose → seta clubOpen para false,
          desmontando e limpando o carrossel interno.
          ───────────────────────────────────────────────────── */}
      {clubOpen && (
        <Carrossel onClose={() => setClubOpen(false)} />
      )}

    </>
  );
}

export default App;
