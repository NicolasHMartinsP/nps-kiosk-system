# 2. Performance e Otimização

Como este sistema roda em totens/tablets de quiosques que não possuem grande capacidade de processamento, foram adotadas regras extremas de otimização de renderização (React Profiler).

## 1. Aceleração de Hardware (GPU)

Animações (como a passagem de slides no carrossel) são feitas exclusivamente com propriedades `transform` (`translateX`) e `opacity`.

- **Por quê?** Propriedades como `width`, `height` e `margin` forçam o browser a recalcular todo o layout da página (Reflow). `transform` roda diretamente na GPU do tablet em uma camada separada, atingindo 60fps constantes sem sobrecarregar a CPU.

## 2. will-change e Repaints

Utilizamos `will-change: transform` estritamente nos containers que deslizam, evitando alocação de memória gráfica atoa.
O botão de `glowPulse` não utiliza a transição de `box-shadow` (que custa caro para a CPU renderizar repaints). O efeito é criado alterando `opacity` de um pseudo-elemento.

## 3. Fontes Assíncronas

Foi utilizado o `font-display: swap` nos arquivos `@font-face`. Isso impede o _Flash of Invisible Text_ (FOIT). A página carrega com uma fonte nativa do sistema do tablet e faz a substituição suave quando a fonte da marca termina o download.

## 4. Lazy Loading (Condicional)

Modais (`Modal.jsx` e `CarrosselClube.jsx`) não estão escondidos via `display: none` ou `opacity: 0`. Eles sofrem _unmount_ completo da árvore DOM `{modalOpen && <Modal />}`. Isso libera a RAM do navegador quando não estão em uso, prevenindo crashes ("Out of Memory") em quiosques que ficam ligados por semanas.
