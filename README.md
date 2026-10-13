# Operação Agenda — "Você é o Robô"

Jogo de 15 minutos sobre **agendamento de laboratório** e **pensamento computacional**, baseado no plano `aula_pc.md` (Aula 1).

A plateia entra por **QR/código**, **escolhe um personagem secundário da Marvel** como nickname e vota pelo celular. O robô reage com **som**, há **cronômetro por rodada** e **ranking ao vivo**.

**Sem Supabase.** O armazenamento é plugável:

- **Local (padrão):** grava em `./.data/rooms.json` — funciona em `npm run dev` / `npm start` na sua máquina.
- **Upstash (Vercel):** configure as variáveis de ambiente e ele usa o Redis REST. Também aceita `KV_REST_API_URL` / `KV_REST_API_TOKEN` (Vercel KV).

## Rodar

```bash
npm install
npm run dev
```

- **Apresentador:** abra `/` → **Criar sala**. Projete essa tela (`/host`).
- **Plateia:** abra `/` no celular → digite o código, ou escaneie o **QR** que aparece na tela do apresentador (`/play`).

## Como sincroniza (sem websocket)

As telas fazem **polling** da API a cada ~1,5 s:

- `POST /api/room` cria/recupera a sala · `GET /api/room?code=` devolve fase, revelado e votos.
- `POST /api/progress` (apresentador) atualiza fase/revelado.
- `POST /api/vote` (plateia) registra o voto.

Simples, funciona no Vercel (funções serverless) e não precisa de serviço de tempo real.

## Publicar no Vercel

1. Crie um Redis gratuito em <https://upstash.com>.
2. Copie a **REST URL** e o **REST TOKEN**.
3. No Vercel, em **Environment Variables**, adicione:

```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

4. Deploy (`vercel --prod` ou importando o repositório).

> Sem Upstash no Vercel, a gravação em arquivo não persiste entre invocações — use Upstash em produção.

## As fases (Aula 1)
| Fase | Conceito |
| --- | --- |
| BOOT | Você é o robô: aceitar/recusar reservas sem deixar duas aulas na mesma sala. |
| SENSORES | Abstração — qual dado importa. |
| CÉREBRO | Decomposição — o que é (e não é) sua responsabilidade; a carta "autenticar" fica para a próxima aula. |
| DECISÃO 1–3 | Conflito, a pegadinha da fronteira (15h–16h) e o intervalo inválido. |
| CHEFÃO | Transferência — dois laboratórios. |
| FINAL | Ponte para a Temporada 2. |

## Estrutura

```
app/                 página inicial, /host, /play e /api (rotas)
components/Robot.tsx robô (SVG) com humor
lib/game.ts          roteiro das fases (conteúdo da aula)
lib/store.ts         armazenamento (Upstash REST ou arquivo local)
lib/client.ts        helpers de fetch no navegador
```
