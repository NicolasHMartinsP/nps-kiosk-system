# 1. Arquitetura (MVC Híbrido)

O sistema foi refatorado para utilizar uma variação do padrão **Model-View-Controller (MVC)** voltado para React.

## Estrutura de Pastas

```text
src/
├── models/
│   ├── firebaseConfig.js    (Conexão e Configuração do DB)
│   └── campaignModel.js     (Dados estáticos e State inicial)
├── controllers/
│   ├── useSwipe.js          (Lógica abstrata de touch/interação)
│   ├── useCarrossel.js      (Lógica de negócio do carrossel principal)
│   └── useCampanha.js       (Orquestrador do modal de campanha)
└── views/
    ├── styles/              (CSS modularizado)
    ├── App.jsx              (Main View Orchestrator)
    ├── Modal.jsx            (View de Avaliação)
    ├── CarrosselHero.jsx    (View do Banner Principal)
    ├── CarrosselClube.jsx   (View do Modal do Clube)
    └── ...
```

## Fluxo de Dados (Data Flow)

1. **Model Layer**: `campaignModel.js` fornece os objetos crus de imagens. `firebaseConfig.js` orquestra a injeção do App Check e APIs.
2. **Controller Layer**: O `App.jsx` instancia os custom hooks (`useCarrossel`, `useCampanha`). Estes hooks atuam como Controllers, processando o estado, timers de autoplay e detecção geométrica de swipe (`useSwipe`), retornando apenas propriedades prontas para renderização.
3. **View Layer**: Componentes burros (Dumb Components) como `CarrosselHero` e `Modal` apenas recebem as props dos Controllers e montam o JSX e classes Tailwind.

## Injeção de CSS

O CSS não utiliza CSS-in-JS pesado (como Styled Components) para evitar gargalos de processamento. Utilizamos CSS Puro e Tailwind CSS injetado através do bundler do Vite de forma modular, permitindo o uso de aceleração por hardware nativa.
