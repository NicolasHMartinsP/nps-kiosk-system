# 3. Setup do Firebase e Dados

Este projeto utiliza o Firebase Firestore como banco de dados NoSQL serverless para armazenar o envio massivo de avaliações sem dependência de uma API Backend rodando num servidor Node/Python.

## Variáveis de Ambiente

As credenciais ficam ocultas e devem ser fornecidas à build do Vite através de um arquivo `.env.local` (Desenvolvimento) e configuradas no painel da Vercel/Netlify/Firebase Hosting (Produção).

```env
VITE_FIREBASE_API_KEY=sua_chave
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio
VITE_FIREBASE_PROJECT_ID=seu_projeto
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender
VITE_FIREBASE_APP_ID=seu_app_id
```

## Modelo de Dados (Coleção: `respostas`)

Quando o cliente clica em "Enviar", um documento é salvo com o seguinte Schema:

| Campo        | Tipo         | Descrição                                                                                                                                       |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Pergunta1`  | number (1–5) | Nota para o atendimento.                                                                                                                        |
| `Pergunta2`  | number (1–5) | Nota para a limpeza e organização.                                                                                                              |
| `Pergunta3`  | number (1–5) | Nota para o buffet e opções.                                                                                                                    |
| `Observacao` | string       | Feedback em formato de texto livre.                                                                                                             |
| `media`      | number       | Média exata das 3 perguntas para criação rápida de Dashboards analíticos.                                                                       |
| `horario`    | timestamp    | Carimbo de tempo nativo gerado pelo servidor Firebase (`serverTimestamp()`). Previne injeções de horário falso por parte do hardware do tablet. |
| `dia`        | string       | String formatada em `YYYY-MM-DD` com timezone forçada em `America/Sao_Paulo`. Facilita agregações analíticas.                                   |
| `cidade`     | string       | ID/Nome da franquia coletado dinamicamente do Query Param da URL (`?cidade=curitiba`).                                                          |
