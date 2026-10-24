# Campaign Health Copilot

Campaign Health Copilot monitors the health of online advertising campaigns.

For each **line** (one buyable placement inside a campaign) it checks pacing, click-through rate (CTR), conversions, and cost per acquisition (CPA) against configurable thresholds. It then gives every line and every campaign a **health score from 0 to 100** and a status of `HEALTHY`, `WARNING`, or `CRITICAL`.

On top of these scores, an **AI copilot** (OpenAI) writes a plain-language analysis of a campaign for ad-ops teams: what's wrong, why it matters, and what to do next. The AI only explains the scores. It never changes them or invents metrics.

---

## Contents

- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Quick start (Docker)](#quick-start-docker)
- [Local development](#local-development)
- [Project structure](#project-structure)
  - [server/](#server)
  - [client/](#client)
- [API reference](#api-reference)
- [Health scoring rules](#health-scoring-rules)
- [Demo data](#demo-data)
- [Testing](#testing)
- [Environment variables](#environment-variables)
- [Deployment (CI/CD)](#deployment-cicd)

---

## How it works

```
Advertiser ──► Campaign ──► Line ──► Daily metrics (spend, impressions, clicks, conversions, revenue)
                                         │
                                         ▼
                           Line health engine  ──► line score + issues
                                         │
                                         ▼
                         Campaign health engine ──► spend-weighted campaign score
                                         │
                                         ▼
                              AI copilot (OpenAI) ──► written analysis & recommendations
```

1. Daily performance is stored per line in Postgres.
2. Health is **calculated on demand** from those metrics. No scores are stored.
3. The campaign score is a weighted average of its line scores. Lines that spend more count for more.
4. When you ask for an analysis, the server sends the computed health data to OpenAI and returns a structured response.

---

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Redux Toolkit, React Router |
| Backend | Node.js, Express 5, TypeScript, Knex, Zod |
| Database | PostgreSQL 17 |
| AI | OpenAI Responses API (structured JSON output) |
| Testing | Vitest, Supertest, React Testing Library |
| Delivery | Docker, Docker Compose, nginx, Jenkins, AWS ECR |

---

## Quick start (Docker)

The fastest way to see the app running. You need **Docker** and an **OpenAI API key**.

```bash
OPENAI_API_KEY=sk-your-key docker compose up --build
```

This starts four services:

| Service | What it does | URL |
|---|---|---|
| `postgres` | Database | `localhost:5433` |
| `migrate` | Creates the database tables, then exits | — |
| `api` | Backend API | http://localhost:3001/api |
| `web` | Frontend (served by nginx, which proxies `/api` to the API) | http://localhost:5173 |

> **Note:** Docker Compose runs migrations but does **not** load demo data. To add demo data, run this once the stack is up:
> ```bash
> docker compose exec api npx knex --knexfile knexfile.cjs seed:run
> ```

Stop everything with `docker compose down`. Add `-v` to also delete the database volume.

---

## Local development

Run the frontend and backend on your machine with hot reload, using Docker only for Postgres.

**Prerequisites:** Node.js 22+, npm, Docker, an OpenAI API key.

### 1. Start Postgres

```bash
docker compose up postgres -d
```

Postgres listens on **port 5433** (not the usual 5432) to avoid clashing with a local install.
Database `campaign_health`, user `campaign_user`, password `campaign_password`.

### 2. Start the server

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set:

```
DATABASE_PASSWORD=campaign_password
OPENAI_API_KEY=sk-your-key
```

Then:

```bash
npm install
npm run db:migrate   # create tables
npm run db:seed      # load demo data
npm run dev          # http://localhost:3001
```

> The server **will not start** if any required variable is missing, including `OPENAI_API_KEY`. It prints which variables are missing and exits.

### 3. Start the client

In a second terminal:

```bash
cd client
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:3001/api
npm install
npm run dev            # http://localhost:5173
```

Open http://localhost:5173.

---

## Project structure

```
campaign-health-copilot/
├── client/               React frontend
├── server/               Express API
├── docker-compose.yaml   Runs postgres, migrate, api, and web together
├── Jenkinsfile           CI/CD pipeline
└── CLAUDE.md             Notes for AI coding assistants
```

### server/

An Express API written in TypeScript. Requests flow through clearly separated layers:

```
routes → controllers → services → repositories → database
```

```
server/
├── src/
│   ├── server.ts            Entry point: starts the HTTP server
│   ├── app.ts               Express app: middleware and route mounting
│   ├── routes/              URL → controller mapping (advertisers, campaigns, lines)
│   ├── controllers/         Read request params, call services, send { data } responses
│   ├── services/            Business logic
│   │   ├── lineHealthEngine.ts       Scores a single line (pure function)
│   │   ├── campaignHealthEngine.ts   Combines line scores into a campaign score (pure function)
│   │   ├── lineMetricService.ts      Rolls daily metrics into totals, CTR, CPA, pacing
│   │   └── campaignAnalysisService.ts  Calls OpenAI for the copilot analysis
│   ├── repositories/        SQL queries via Knex
│   ├── ai/                  Prompt, JSON output schema, and input builder for OpenAI
│   ├── config/              Env validation (env.ts), health thresholds, OpenAI client
│   ├── middleware/          Error handler, 404 handler, request logger, ID validation
│   ├── errors/              AppError (HTTP status + error code)
│   ├── db/                  Knex connection
│   └── types/               TypeScript types for domain, health, and analysis data
├── migrations/              Database schema (Knex, .cjs)
├── seeds/                   Demo data (Knex, .cjs)
├── knexfile.cjs             Knex CLI configuration
└── dockerfile               Production image (Node 22 Alpine)
```

**Server scripts** (run inside `server/`):

| Command | What it does |
|---|---|
| `npm run dev` | Start with auto-reload (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm run typecheck` | Check types without building |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with a coverage report |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:rollback` | Undo the last migration batch |
| `npm run db:seed` | Load demo data |
| `npm run db:reset` | Roll back everything, migrate, and seed again |

### client/

A single-page React app built with Vite.

```
client/
├── src/
│   ├── main.tsx             Entry point
│   ├── App.tsx              Page routes
│   ├── api/apiClient.ts     apiGet / apiPost helpers; unwrap { data } and surface API errors
│   ├── app/                 Redux store and typed hooks
│   ├── features/            Redux slices: advertisers, campaigns, campaign health,
│   │                        campaign analysis, lines, line health, metrics
│   ├── pages/               One component per screen (see below)
│   ├── components/          Reusable UI: health summaries, tables, metric cards, copilot panel
│   ├── types/               TypeScript types (mirror of server/src/types)
│   └── utils/formatters.ts  Number, currency, and percentage formatting
├── test/                    Component tests and test setup
├── nginx.conf               Serves the built app and proxies /api to the API container
└── dockerfile               Builds with Vite, serves with nginx
```

**Pages:**

| Path | Page | Shows |
|---|---|---|
| `/` | Advertisers | All advertisers |
| `/advertisers/:advertiserId/campaigns` | Campaigns | An advertiser's campaigns |
| `/campaigns/:campaignId` | Campaign details | Campaign health, line health table, AI copilot |
| `/lines/:lineId` | Line details | Line health, issues, and daily metrics |
| `/health` | Health check | API and database status |

**Client scripts** (run inside `client/`):

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

---

## API reference

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Returns |
|---|---|---|
| GET | `/api` | Service info and endpoint list |
| GET | `/api/health` | API and database status |
| GET | `/api/advertisers` | All advertisers |
| GET | `/api/advertisers/:advertiserId` | One advertiser |
| GET | `/api/advertisers/:advertiserId/campaigns` | An advertiser's campaigns |
| GET | `/api/campaigns/:campaignId` | One campaign |
| GET | `/api/campaigns/:campaignId/lines` | A campaign's lines |
| GET | `/api/campaigns/:campaignId/health` | Campaign health score, status, and per-line health |
| POST | `/api/campaigns/:campaignId/analyze` | AI copilot analysis of the campaign |
| GET | `/api/lines/:lineId` | One line |
| GET | `/api/lines/:lineId/metrics` | A line's daily metrics |
| GET | `/api/lines/:lineId/health` | Line health score, status, and issues |

**Response format.** Successful responses wrap the result in `data`:

```json
{ "data": { ... } }
```

Errors return an HTTP status and an `error` object:

```json
{ "error": { "code": "CAMPAIGN_NOT_FOUND", "message": "Campaign 99 not found", "requestId": "..." } }
```

Common error codes: `INVALID_ID` (400), `*_NOT_FOUND` (404), `ROUTE_NOT_FOUND` (404), `AI_ANALYSIS_FAILED` (502).

---

## Health scoring rules

### Line health

Every line starts at **100**. Each problem found subtracts a penalty:

| Check | Fails when | Severity | Penalty |
|---|---|---|---|
| Under-pacing | Spend is below 75% of expected spend for the time elapsed | Warning | −20 |
| Over-pacing | Spend is at or above 120% of expected spend | Warning | −15 |
| Low CTR | CTR is below 0.5% | Warning | −15 |
| No conversions | Zero conversions after $500 or more in spend | **Critical** | −40 |
| High CPA | CPA is more than 125% of the line's CPA goal | Warning | −15 |

**Score** = 100 − total penalties, never below 0.

**Status:**
- `CRITICAL` if any critical issue exists or the score is below 60
- `WARNING` if the score is below 90
- `HEALTHY` otherwise

### Campaign health

- Each line is weighted by its **share of campaign spend** (or of budget, if nothing has spent yet).
- The **campaign score** is the weighted average of line scores.
- **Status:**
  - `CRITICAL` if the score is below 60, **or** 25% or more of the weight sits in critical lines
  - `WARNING` if the score is below 90, **or** any line is critical or warning
  - `HEALTHY` only when the score is 90+ and every line is healthy

All thresholds and penalties can be changed in `server/src/config/lineHealthThresholds.ts` and `server/src/config/campaignHealthThresholds.ts`.

---

## Demo data

`npm run db:seed` loads:

- **3 advertisers:** Northstar Athletic, Horizon Auto, BrightHome
- **8 campaigns** across them (for example, Summer Running, SUV Launch, Home Office)
- **3 lines per campaign:** Prospecting (CPA goal), Retargeting (CPA goal), Awareness (CTR goal)
- **29 days of metrics** per line, starting 2026-08-01

Lines rotate through five performance profiles (healthy, under-pacing, low CTR, no conversions, high CPA), so every kind of health issue appears in the data.

---

## Testing

```bash
cd server && npm test
cd client && npm test
```

Run a single test file:

```bash
cd server && npx vitest run src/services/__test__/lineHealthEngine.test.ts
cd client && npx vitest run test/components/LineHealthSummary.test.tsx
```

**Before running server tests**, make sure Postgres is running, migrated, and seeded, and that `server/.env` is filled in. The API tests (`src/routes/__test__/api.test.ts`) call the real database. The health engine tests are pure and need no database.

---

## Environment variables

### Server (`server/.env`)

| Variable | Required | Default | Notes |
|---|---|---|---|
| `NODE_ENV` | | `DEVELOPMENT` | `DEVELOPMENT`, `STAGE`, or `PROD` |
| `PORT` | | `3001` | |
| `DATABASE_HOST` | ✅ | | `localhost` for local dev |
| `DATABASE_PORT` | | `5432` | Use `5433` for local dev with Docker Postgres |
| `DATABASE_NAME` | ✅ | | `campaign_health` |
| `DATABASE_USER` | ✅ | | `campaign_user` |
| `DATABASE_PASSWORD` | ✅ | | `campaign_password` with Docker Postgres |
| `CORS_ORIGIN` | | `http://localhost:5173` | Comma-separated list allowed |
| `OPENAI_API_KEY` | ✅ | | The server won't start without it |
| `OPENAI_MODEL` | | `gpt-5.6-terra` | |

### Client (`client/.env`)

| Variable | Default | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Use `http://localhost:3001/api` for local dev |

---

## Deployment (CI/CD)

The `Jenkinsfile` pipeline runs on every build:

1. **Server:** install → type-check → test (against a temporary Postgres container) → build
2. **Client:** install → lint → test → build
3. **Docker:** build the API image, log in to AWS ECR, and push it

Images are pushed to:

| | |
|---|---|
| Registry | `692901933475.dkr.ecr.us-east-1.amazonaws.com` |
| Repository | `692901933475.dkr.ecr.us-east-1.amazonaws.com/campaign-health-api` |
| Tags | `<build number>-<git sha>` and `latest` |

Jenkins needs a credential named `campaign-health-aws` (username = AWS access key ID, password = secret access key). Only the API image is published. The web image is currently built only by Docker Compose.
