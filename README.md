# Sistema de Totem NPS - The Best Açaí

![React](https://img.shields.io/badge/React-19-blue)![Vite](https://img.shields.io/badge/Vite-Build%20Tool-purple)![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)![Status](https://img.shields.io/badge/Status-Production-success)
![License](https://img.shields.io/badge/License-MIT-blue)

> **Totem de Avaliação Inteligente (NPS) e Mídia Interativa** para quiosques. Coleta de feedbacks via hardware no balcão e sincronização direta com a nuvem sem atritos de usabilidade.

---

## Problema e Solução

Empreendimentos enfrentam dificuldades para mensurar a qualidade do atendimento e limpeza na ponta, diretamente com o cliente, antes que ele saia da loja. Formulários via QR Code geram engajamento baixíssimo.

O sistema atua como uma interface de hardware (Totem/Tablet de balcão) rodando in-memory e _fullscreen_. Ele resolve o engajamento unindo um **Carrossel de Mídias/Promoções (Digital Signage)** a um **Formulário NPS Express de 3 cliques**.
O usuário interage com o menu de campanhas de marketing, se depara com a chamada para avaliação e responde em segundos. Tudo isso sincronizado remotamente num _Firebase Firestore_ descentralizado, segmentando automaticamente cada avaliação para a franquia de origem (lida via query string da URL no deploy do hardware).

_Projeto atualmente em Produção e rodando ativamente em **8 empresas/franquias** diferentes._

---

## Tecnologias

- **React / Vite** (Core da aplicação e motor de renderização HMR)
- **Firebase Firestore** (Database NoSQL serverless para armazenamento em tempo real)
- **Tailwind CSS** (Estilização híbrida de alta performance gráfica)
- **qrcode.react** (Geração dinâmica e offline de conexões app-clube)
- **Vite Env Variables** (Segurança e isolamento de chaves de API da camada frontend)

---

## Arquitetura Híbrida (MVC Pattern)

A aplicação foi rigorosamente componentizada utilizando o padrão de arquitetura MVC voltado para frontend React. Toda a lógica de negócio foi extraída para Controladores, deixando as Views (Componentes) limpas e altamente performáticas.

```text
 ┌───────────────────────┐            ┌─────────────────────────┐
 │ Hardware do Totem     │            │    Cloud (Firebase)     │
 │ (URL ?cidade=nome)    │            │     (Firestore DB)      │
 └───────────┬───────────┘            └────────────┬────────────┘
             │                                     │
             ▼                                     ▼
        [ UI Views ]                          [ API Rest ]
             │                                     │
             └──────────────────┬──────────────────┘
                                ▼
                        Controllers (Hooks)
                    (Gerenciadores de Estado/Swipe)
                                │
                                ▼
                       Interactive Feedback
                       (Coleta de Notas 1-5)
                                │
                                ▼
                         Models (Config)
                   (Processamento Analítico de Média)
                                │
                                ▼
                        Firestore Storage
                      (Agregação de Negócios)
```

---

## Fluxo

1. **Setup Agnóstico:** O hardware inicializa o navegador apontando para a URL hospedada com a marcação de franquia ex: `?cidade=curitiba`.
2. **Ciclo Visual (Marketing):** O _Controller_ de `CarrosselHero` roda em idle tocando as propagandas configuradas pelo time de mkt.
3. **Trigger de Avaliação:** O cliente, estimulado, toca no botão para abrir o Modal de captura (View).
4. **Resolução de Dados:** A _View_ coleta as respostas (3 de toque + 1 textual), envia ao Controller que calcula a estatística e interage com o _Model_ (Firebase) para salvar com `serverTimestamp()` inviolável.
5. **Encerramento Automático:** A interface agradece, desmonta o formulário via unmount (liberando RAM do tablet) e volta ao ciclo comercial de forma assíncrona.

---

## Funcionalidades

- **Digital Signage Integrado:** Motor próprio de mídia em Carrossel que aceita imagens e vídeos em Autoplay, mantendo o tablet comercialmente útil.
- **Engine de Swipe Híbrida:** Ações controladas inteiramente por touch (`useSwipe`), simulando perfeitamente a navegação nativa mobile em browsers bloqueados.
- **Formulário Dinâmico (Data-Driven):** As questões NPS são processadas através de um Array (`Models/campaignModel.js`). Adicionar uma nova pergunta requer zero alterações estruturais no código ou na visualização (DRY).
- **Auto-Calculo Analítico:** O pacote de dados trafegado (Payload) já embute estatísticas pré-processadas (como médias aritméticas exatas) para que o dashboard de BI da diretoria exiba relatórios de latência zero.
- **Tratamento de Performance Extrema:** Refatorações de motor CSS (GPU Rendering via `will-change: transform`) para impedir _reflows_ do navegador em tablets de quiosque, garantindo animações em suaves 60FPS ininterruptamente.

---

## Como Usar e Documentação

Para aprofundar-se na arquitetura técnica e padrões de design deste projeto, consulte a nossa biblioteca técnica na pasta `/docs`:

- 📘 **[Referência de Arquitetura (ARCHITECTURE)](docs/1-ARCHITECTURE.md):** Padrões de design utilizados (MVC), tomada de decisões em renderização e injeção HMR.
- 📙 **[Referência de Otimização (PERFORMANCE)](docs/2-PERFORMANCE.md):** Manual de como construir aplicações React sem travamentos para hardwares com baixa CPU usando aceleração de GPU pura.
- 📗 **[Integração Cloud (FIREBASE_SETUP)](docs/3-FIREBASE_SETUP.md):** Entenda como a injeção do banco de dados na nuvem opera de maneira serverless e protegida por variáveis de ambiente (EnvVars).

---

## Como Rodar o Projeto

Caso queira inicializar a plataforma para desenvolvimento local:

```bash
# Clone o repositório
git clone https://github.com/NicolasHMartinsP/nps-kiosk-system.git

# Entre no diretório
cd nps-kiosk-system

# Instale os pacotes e dependências (Vite, React, Tailwind)
npm install

# (IMPORTANTE) - Configure o `.env.local` na raiz com os parâmetros da sua Cloud do Firebase
# Utilize o arquivo `.env.example` como guia.

# Inicie o servidor em modo de desenvolvimento
npm run dev

# Acesse http://localhost:5173/?cidade=Desenvolvimento no seu navegador
```

---

## Resultados

Sistemas NPS tradicionais com leitura de QR Code geram perda no funil de resposta devido à burocracia para o cliente final. A presença deste totem direto no balcão elevou massivamente o engajamento, colhendo milhares de respostas e insights precisos. Atualmente a tecnologia está operando de forma perene no front comercial de 8 grandes operações integradas.

## Possíveis Melhorias Futuras

- Integração nativa de caching Offline-first (Service Workers/PWA) para guardar as avaliações no cachê caso o hardware do quiosque perca o sinal de internet, realizando o push para a nuvem retroativo.
- Interface de painel do administrador (Dashboard) integrado à mesma rota validado via Autenticação Firebase (JWT).

---

## Licença

Projeto reestruturado para fins educacionais e de demonstração arquitetural de engenharia de software sob licença **MIT**. Chaves privadas, identidades absolutas da marca e banco de dados da operação original foram inteiramente desacoplados e mantidos seguros (Env) no servidor de produção.
