# The Best Açaí — Sistema de Avaliação

Sistema web para coleta de avaliações de clientes nas franquias The Best Açaí.
Cada loja recebe um link único com `?cidade=nome` — sem login, sem complexidade.

---

## Índice

- [Visão geral](#visão-geral)
- [Stack](#stack)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como rodar](#como-rodar)
- [Arquitetura](#arquitetura)
- [Componentes](#componentes)
- [Hooks](#hooks)
- [Dados](#dados)
- [Estilos](#estilos)
- [Regras de performance](#regras-de-performance)
- [Firestore](#firestore)
- [Deploy](#deploy)

---

## Visão geral

O cliente entra na página da loja, vê o carrossel de campanhas, clica em **Avaliar agora!** e responde 3 perguntas com notas de 1 a 5 mais um campo de observação livre. As respostas são salvas no Firestore com timestamp, data e identificação da franquia.

---

## Stack

| Tecnologia | Uso |
|---|---|
| React + Vite | Interface e bundler |
| Tailwind CSS | Classes utilitárias de layout |
| App.css | Estilos customizados, animações e modal |
| Firebase Firestore | Banco de dados das avaliações |
| qrcode.react | QR Codes do Clube The Best |

---

## Estrutura do projeto

```
src/
├── App.jsx              → orquestrador principal
├── App.css              → estilos globais e animações
├── main.jsx             → ponto de entrada (importa App.css)
│
├── campaignData.js      → dados estáticos: slides e campanhas
│
├── useCarrossel.js      → hook: lógica do carrossel hero
├── useCampanha.js       → hook: lógica do modal de campanha
│
├── LogoFloating.jsx     → logo fixo com scroll to top
├── CarrosselHero.jsx    → carrossel de imagens do hero
├── CampanhaModal.jsx    → modal fullscreen de campanha
├── Modal.jsx            → modal de avaliação (notas 1–5)
├── carrossel.jsx        → modal do Clube The Best
│
├── firebase.js          → configuração do Firebase
└── assets/
    ├── img/             → imagens e vídeos
    └── Fonts/           → fontes OTF customizadas
```

---

## Como rodar

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção (gera a pasta dist/)
npm run build

# Testar o build antes de publicar
npm run preview
```

> **Dica:** durante o desenvolvimento, abra o DevTools (`F12`) → aba Network → marque **Disable cache** para garantir que as alterações apareçam sem precisar forçar recarregamento.

---

## Arquitetura

### Fluxo de dados

```
App.jsx
  ├── useCarrossel(images)     → estado e navegação do carrossel hero
  ├── useCampanha(...)         → estado e navegação do modal de campanha
  ├── useState(modalOpen)      → controla abertura do modal de avaliação
  └── useState(clubOpen)       → controla abertura do modal do clube
```

### Ordem de renderização na página

| # | Componente | Descrição |
|---|---|---|
| 1 | Hero | Fundo preto, tagline e botão "Avaliar agora!" |
| 2 | CarrosselHero | Imagens rotativas + faixa "Saiba mais" |
| 3 | CampanhaModal | Modal fullscreen (sempre no DOM, visível quando aberto) |
| 4 | Seção Clube | Banner com botão "Clique aqui e saiba mais!" |
| 5 | Modal | Avaliação — montado só quando `modalOpen === true` |
| 6 | Carrossel | Clube — montado só quando `clubOpen === true` |

### Identificação da franquia por URL

Cada loja recebe um link com o parâmetro `?cidade=`:

```
https://meusite.com?cidade=curitiba
https://meusite.com?cidade=londrina
```

O `App.jsx` lê esse parâmetro via `URLSearchParams` e passa para o `Modal.jsx`, que o salva junto com cada avaliação no Firestore. Se o parâmetro não existir, o valor salvo é `"desconhecida"`.

---

## Componentes

### `App.jsx` — Orquestrador principal

Responsabilidade única: montar a página conectando componentes, hooks e estado. Não contém lógica de carrossel, swipe, campanha nem animação.

**Estado local:**
- `modalOpen` → boolean que controla o modal de avaliação
- `clubOpen` → boolean que controla o modal do Clube

**Por que `CampanhaModal` não usa renderização condicional?**
Diferente dos outros modais, o `CampanhaModal` precisa manter o estado de slide interno durante a animação de saída. Por isso fica sempre no DOM e usa uma prop `openCampaign` para se mostrar/esconder internamente.

---

### `CarrosselHero.jsx` — Carrossel do hero

Componente puramente visual — não tem estado próprio. Recebe tudo via props do hook `useCarrossel`.

**Props:**

| Prop | Tipo | Descrição |
|---|---|---|
| `images` | array | Slides `{ id, src, alt }` |
| `currentIndex` | number | Índice do slide ativo |
| `onNext` | fn | Avança um slide |
| `onPrev` | fn | Volta um slide |
| `onDotClick(i)` | fn | Pula para o slide `i` |
| `onTouchStart/Move/End` | fn | Handlers de swipe |
| `currentHasCampaign` | boolean | Slide atual tem campanha? |
| `onSaibaMais` | fn | Abre o modal de campanha |

**Como funciona a transição:**
O track (`div` com todos os slides lado a lado) é movido via `translateX(-${currentIndex * 100}%)`. A classe Tailwind `transition-transform duration-500` aplica a animação CSS.

---

### `CampanhaModal.jsx` — Modal fullscreen de campanha

Exibe as mídias (imagens e vídeos `.mp4`) de uma campanha específica. Detecta o tipo de mídia pela extensão do arquivo: `.mp4` → `<video>`, qualquer outro → `<img>`.

**Props:**

| Prop | Tipo | Descrição |
|---|---|---|
| `openCampaign` | boolean | Exibe ou esconde o modal |
| `campaignInuse` | array | Mídias `{ id, src, alt }` da campanha ativa |
| `campaignIndex` | number | Slide interno ativo |
| `onClose` | fn | Fecha o modal |
| `onNext / onPrev` | fn | Navegação entre slides |
| `onDotClick(i)` | fn | Pula para o slide `i` |
| `onTouchStart/Move/End` | fn | Handlers de swipe |

---

### `Modal.jsx` — Modal de avaliação

Formulário multi-etapa com 3 perguntas de nota (1–5) e 1 campo de texto livre. As perguntas são definidas no array `Questions` — adicionar uma nova pergunta não requer mudança na lógica.

**Estados internos:**
- `question` → índice da pergunta atual
- `finish` → exibe a tela de confirmação após envio
- `answers` → objeto com todas as respostas (`{ Pergunta1, Pergunta2, Pergunta3, Observacao }`)

**Padrão data-driven UI:**
O array `Questions` define id, texto e tipo de cada pergunta. O estado `answers` é gerado automaticamente a partir desse array via `reduce`. Isso permite adicionar ou remover perguntas sem alterar a lógica de navegação ou envio.

**Props:**

| Prop | Tipo | Descrição |
|---|---|---|
| `onClose` | fn | Fecha o modal |
| `cidade` | string | Nome da franquia (vem do `?cidade=` da URL) |

---

### `carrossel.jsx` — Modal do Clube The Best

Modal fullscreen com as imagens do Clube. Exibe QR Codes para download do app no primeiro slide.

**Como funciona a animação de transição:**
Todas as imagens são renderizadas sobrepostas com `position: absolute`. A imagem ativa recebe `opacity: 1` e `translateX(0)`. As demais recebem `opacity: 0` e um deslocamento lateral de 60px. A transição CSS (`0.4s ease`) anima suavemente entre os estados.

A direção do deslocamento depende do sentido de navegação:
- Avançar (`direction: "left"`) → imagem sai para `-60px`
- Voltar (`direction: "right"`) → imagem sai para `+60px`

**Proteção contra duplo clique:**
`isAnimating` bloqueia novos cliques durante os 400ms da transição para evitar que a sequência visual quebre.

**Estados internos:**
- `currentIndex` → slide ativo
- `direction` → `"left"` ou `"right"`
- `isAnimating` → bloqueia interação durante a transição
- `swipeHintVisible` → exibe a dica de swipe, some após o primeiro arrasto

---

### `LogoFloating.jsx` — Logo com scroll to top

Logo fixo no canto superior esquerdo via `position: fixed` no CSS (classe `.logo-floating`). Ao clicar, chama `window.scrollTo({ top: 0, behavior: "smooth" })` para voltar ao topo suavemente.

---

## Hooks

### `useCarrossel.js`

Gerencia todo o estado e lógica do carrossel hero.

```js
const carrossel = useCarrossel(images);
```

**Retorna:**

| Propriedade | Tipo | Descrição |
|---|---|---|
| `currentIndex` | number | Índice do slide visível |
| `nextSlide()` | fn | Avança (loop circular) |
| `prevSlide()` | fn | Volta (loop circular) |
| `goTo(i)` | fn | Pula para o slide `i` |
| `onTouchStart/Move/End` | fn | Handlers de swipe |

**Autoplay:** avança automaticamente a cada 5 segundos via `setInterval`. O `clearInterval` no cleanup do `useEffect` evita memory leak ao desmontar o componente.

---

### `useCampanha.js`

Gerencia o estado do modal de campanha: qual campanha está ativa, qual slide interno está visível, abertura/fechamento e swipe.

```js
const campanha = useCampanha(images, carrossel.currentIndex, campaignMap);
```

**Retorna:**

| Propriedade | Tipo | Descrição |
|---|---|---|
| `openCampaign` | boolean | Modal aberto? |
| `campaignInuse` | array \| null | Mídias da campanha ativa |
| `campaignIndex` | number | Slide interno ativo |
| `currentHasCampaign` | boolean | Slide do hero tem campanha? |
| `handleSaibaMais()` | fn | Abre o modal com a campanha do slide atual |
| `handleClose()` | fn | Fecha e reseta o estado |
| `nextCampaignSlide()` | fn | Avança slide interno |
| `prevCampaignSlide()` | fn | Volta slide interno |
| `goToCampaignSlide(i)` | fn | Pula para o slide `i` |
| `onTouchStart/Move/End` | fn | Handlers de swipe do modal |

---

## Dados

### `campaignData.js`

Fonte única de verdade para os slides do hero e as campanhas. Separado dos componentes para não recriar os dados a cada render e facilitar manutenção.

**`images`** — array de slides do carrossel hero:
```js
{ id: "img1", src: img1, alt: "Sabores e acompanhamentos" }
```

**`campaignMap`** — objeto que mapeia o `id` de cada slide para sua campanha:
```js
{
  img1: [ { id, src, alt }, ... ],  // campanha Sabores
  img2: [ { id, src, alt }, ... ],  // campanha Páscoa
  img3: [ { id, src, alt }, ... ],  // campanha Shake
  // img4 não tem entrada → botão "Saiba mais" não aparece
}
```

**Para adicionar uma nova campanha:**
1. Importe as mídias no topo do arquivo
2. Crie o array da campanha com os objetos `{ id, src, alt }`
3. Adicione a entrada no `campaignMap` usando o `id` do slide correspondente

---

## Estilos

### `App.css` — Índice de seções

| # | Seção | Classes principais |
|---|---|---|
| 1 | Tailwind | `@tailwind base/components/utilities` |
| 2 | Animações | `swipeHint`, `modalUp`, `pulseScale`, `glowPulse` |
| 3 | Fontes | `textgyreschola`, `novabold` |
| 4 | Reset | `*`, `body` |
| 5 | Logo flutuante | `.logo-floating` |
| 6 | Hero | `.Hover`, `.heroText`, `.heroTagline`, `.heroTitle`, `.highlight` |
| 7 | Carrossel hero | `.separador`, `.carrosselWrapper` |
| 8 | Setas | `.arrowBtn`, `.arrowBtn--left`, `.arrowBtn--right` |
| 9 | Faixa saiba mais | `.saibaMaisFaixa`, `.saibaMaisBtn` |
| 10 | Botões animados | `.glowButton`, `.pulseScale` |
| 11 | Botões específicos | `.avaliarBtn`, `.clubeBtn` |
| 12 | Modal campanha | `.campaignCloseBtn` |
| 13 | Modal avaliação overlay | `.ModalOverlay`, `.modalContainer` |
| 14 | Modal avaliação conteúdo | `.modalHeader`, `.closeBtn`, `.modalQuestion`, `.avaliacao`, `.nota`, `.nota-1` a `.nota-5`, `.selecionado`, `.observacao`, `.navigation`, `.voltarBtn`, `.nextBtn`, `.submitBtn`, `.finishContainer`, `.checkIcon`, `.swipe-hint` |
| 15 | Legado | `#titleSearch`, `#Pamonha`, `#containerBotão`, `#modal` |

### Breakpoints utilizados

| Breakpoint | Contexto |
|---|---|
| `max-width: 599px` | Mobile — modal como bottom sheet |
| `min-width: 480px` | Botões de nota em linha única |
| `min-width: 768px` | Tablet |
| `min-width: 1024px` | Desktop |

---

## Regras de performance

> Estas regras foram aplicadas em todo o projeto para eliminar travamentos em tablets.

**Anime APENAS `transform` e `opacity`.**
Essas propriedades rodam diretamente na GPU sem recalcular o layout da página. Qualquer outra propriedade animada (`width`, `height`, `margin`, `top`, `left`, `box-shadow`) força o browser a redesenhar a tela inteira a cada frame.

**`will-change: transform`**
Adicionado apenas nos elementos que realmente animam. Uso excessivo aumenta o consumo de memória da GPU.

**`glowPulse` sem `box-shadow` animado**
`box-shadow` animado causa repaint a cada frame. O efeito de brilho é simulado com variação de `opacity`, que tem custo zero na GPU.

**`font-display: swap`**
As fontes customizadas usam `swap` para não bloquear a renderização da página enquanto os arquivos `.otf` carregam.

**Lazy loading dos modais**
`Modal.jsx` e `carrossel.jsx` são montados no DOM apenas quando abertos (`{modalOpen && <Modal />}`), economizando memória e evitando re-renders desnecessários.

---

## Firestore

### Coleção: `respostas`

Cada documento criado pelo `Modal.jsx` contém:

| Campo | Tipo | Descrição |
|---|---|---|
| `Pergunta1` | number (1–5) | Nota para atendimento |
| `Pergunta2` | number (1–5) | Nota para limpeza |
| `Pergunta3` | number (1–5) | Nota para o buffet |
| `Observacao` | string | Comentário livre |
| `media` | number | Média das três notas |
| `horario` | timestamp | Timestamp do servidor Firebase |
| `dia` | string (YYYY-MM-DD) | Data no fuso de São Paulo |
| `cidade` | string | Franquia de origem (do `?cidade=`) |

**Por que `serverTimestamp()` e não `new Date()`?**
`serverTimestamp()` usa o relógio do servidor Firebase, evitando inconsistências causadas pelo relógio do dispositivo do cliente (fuso errado, data incorreta).

**Por que salvar `dia` separado?**
O campo `dia` em formato `YYYY-MM-DD` facilita consultas e agrupamentos por data em gráficos e relatórios sem precisar converter timestamps.

---

## Deploy

O projeto gera uma pasta `dist/` com o build de produção:

```bash
npm run build   # compila, minifica e aplica hash nos arquivos
npm run preview # servidor local para testar o build
```

**O que o build faz:**
1. Transpila JSX para JavaScript puro
2. Agrupa todos os arquivos em poucos bundles
3. Minifica código e CSS (remove espaços e comentários)
4. Aplica hash nos nomes dos arquivos (`index-3f8a2c1b.js`) para cache-busting
5. Copia assets para `dist/assets/`

Apenas a pasta `dist/` vai para o servidor de hospedagem.

---

## Classes legadas

As classes abaixo existem no `App.css` por compatibilidade com versões anteriores. Não remover até confirmar que nenhum componente as referencia.

| Classe/ID | Origem |
|---|---|
| `#titleSearch` | Título da versão anterior |
| `#Pamonha` | Imagem principal da versão anterior |
| `#containerBotão` | Container de botões da versão anterior |
| `#modal` | Modal da versão anterior |

Para remover com segurança, confirme que nenhum arquivo referencia a classe, delete e commite:

```bash
git commit -m "chore: remove classes legadas do CSS"
```
