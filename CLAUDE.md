# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Campaign Health Copilot monitors the health of advertising campaign lines. It evaluates pacing, CTR, conversions, and CPA against configurable thresholds, produces a weighted health score per line and campaign, and uses the OpenAI Responses API to generate an operational analysis for ad-ops professionals.

## Repository layout

```
campaign-health-copilot/
  client/       React 19 + Vite SPA (TypeScript)
  server/       Express 5 + Knex API (TypeScript, CommonJS output)
  docker-compose.yaml   postgres + migrate + api + web services
```

## Development setup

### Infrastructure (Postgres)

```bash
docker compose up postgres -d
```

Postgres runs on **port 5433** (not the default 5432) to avoid local conflicts. Database: `campaign_health`, user: `campaign_user`, password (compose default): `campaign_password`. Migrations and seeds are CommonJS (`.cjs`) in `server/migrations/` and `server/seeds/`.

### Server

```bash
cd server
cp .env.example .env        # fill in DATABASE_PASSWORD and OPENAI_API_KEY
npm install
npm run db:migrate
npm run db:seed
npm run dev                 # tsx watch, port 3001
```

### Client

```bash
cd client
cp .env.example .env        # VITE_API_BASE_URL=http://localhost:3001/api
npm install
npm run dev                 # Vite, port 5173
```

## Common commands

| Command | Description |
|---|---|
| `npm run dev` | Start with hot-reload (both client and server) |
| `npm run build` | TypeScript compile + Vite/tsc build |
| `npm run lint` | ESLint (client only) |
| `npm test` | Run all tests once (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Coverage report (server only) |
| `npm run db:migrate` | Apply pending Knex migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:reset` | Rollback all → migrate → seed |
| `npm run typecheck` | Type-check without emitting (server only) |

Run a single test file:

```bash
# server — tests live in src/**/__test__/
cd server && npx vitest run src/services/__test__/lineHealthEngine.test.ts

# client — tests live in client/test/ (not src/), jsdom + globals, setup in test/setup.ts
cd client && npx vitest run test/components/LineHealthSummary.test.tsx
```

### Test caveats

- `server/src/routes/__test__/api.test.ts` is an **integration test**: it imports the real `app` via supertest and expects a running, migrated **and seeded** Postgres (e.g. `/api/campaigns/1/health` must exist). Start Postgres and run `db:migrate` + `db:seed` first.
- Every server test that imports `config/env.ts` (directly or through `app`) needs a complete `server/.env`: env parsing calls `process.exit(1)` on missing required vars, `OPENAI_API_KEY` included. The health engine tests are pure and need neither.

## Architecture

### Data model

`advertisers` → `campaigns` → `lines` → `line_metrics` (one row per line per day). Health is computed on-the-fly from `line_metrics`; there are no pre-stored health scores.

### Server layers

```
routes → controllers → services → repositories → Knex (Postgres)
```

- **Repositories** (`src/repositories/`) — raw SQL via Knex, return domain types.
- **Services** (`src/services/`) — business logic, orchestrate repos and engines.
- **Health engines** (`src/services/lineHealthEngine.ts`, `campaignHealthEngine.ts`) — pure functions; thresholds and penalties live in `src/config/lineHealthThresholds.ts` and `campaignHealthThresholds.ts`.
- **AI layer** (`src/ai/`, `src/services/campaignAnalysisService.ts`) — fetches campaign health, serialises it to JSON, calls the OpenAI Responses API with a structured output schema. The prompt explicitly forbids the model from inventing metrics or overriding deterministic scores.
- **Error handling** — `AppError` carries an HTTP status and a machine-readable `code`; `errorHandler` middleware formats it into `{ error: { code, message, requestId } }`. All API responses wrap data as `{ data: ... }`. Non-integer/non-positive `:id` params are rejected by `validateIdParam` (400 `INVALID_ID`); unknown routes give 404 `ROUTE_NOT_FOUND`.
- **Config** — `src/config/env.ts` validates `process.env` with zod at import time and exits the process on failure. Read config from `env`, not `process.env` (the exception is `knexfile.cjs`, which the Knex CLI loads directly).
- **Routes** — mounted in `src/app.ts` under `/api/advertisers`, `/api/campaigns`, `/api/lines`. Health endpoints: `GET /api/lines/:id/health`, `GET /api/campaigns/:id/health`. `GET /api/health` checks the DB connection.
- **Shared types** — `server/src/types/*` and `client/src/types/*` (`domain`, `lineHealth`, `campaignHealth`, `analysis`) are separate, hand-kept copies. When you change an API shape, update both sides.

### Line health scoring

`evaluateLineHealth` runs four checks in sequence: pacing ratio, CTR, conversions, and CPA. Each failing check appends a `HealthIssue` with a penalty. Final score = `max(0, 100 − Σ penalties)`. Status is `CRITICAL` if any critical issue exists or score < 60; `WARNING` if score < 90; otherwise `HEALTHY`.

### Campaign health scoring

`calculateCampaignHealth` weights each line by its share of total spend (or budget if no spend yet), produces a weighted score, and computes exposure ratios (fraction of budget weight in CRITICAL/WARNING/HEALTHY lines). Campaign status escalates to CRITICAL if the weighted score is below threshold or if critical exposure exceeds a configured ceiling.

### Client state

Redux Toolkit slices mirror the API resource hierarchy: `advertisers`, `campaigns`, `lines`, `metrics`, `lineHealth`, `campaignHealth`, `campaignAnalysis`. All API calls go through `src/api/apiClient.ts` (`apiGet`/`apiPost`), which reads `VITE_API_BASE_URL` and unwraps the `{ data }` envelope.

### AI analysis flow

`POST /api/campaigns/:id/analyze` → `campaignAnalysisService.analyzeCampaign` → fetches full campaign health via `getCampaignHealth` → `buildCampaignAnalysisInput` serialises it → OpenAI Responses API with `json_schema` structured output → response parsed to `CampaignAnalysis` type and returned to the client.

The prompt is in `src/ai/campaignAnalysisPrompt.ts` and the output schema in `src/ai/campaignAnalysisSchema.ts`. If you change the schema, also update `CampaignAnalysis` in both `server/src/types/analysis.ts` and `client/src/types/analysis.ts`. OpenAI failures surface as 502 `AI_ANALYSIS_FAILED`.

## Environment variables

### Server (`server/.env`)

| Variable | Default | Notes |
|---|---|---|
| `NODE_ENV` | `DEVELOPMENT` | `DEVELOPMENT` / `STAGE` / `PROD` |
| `PORT` | `3001` | |
| `DATABASE_HOST` | `localhost` | |
| `DATABASE_PORT` | `5432` | Docker: 5432 internal; local dev: 5433 |
| `DATABASE_NAME` | `campaign_health` | |
| `DATABASE_USER` | `campaign_user` | |
| `DATABASE_PASSWORD` | _(required)_ | |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated list allowed |
| `OPENAI_API_KEY` | _(required)_ | Required at startup: `env.ts` exits and `config/openai.ts` throws if it is empty, so the 503 `AI_NOT_CONFIGURED` path in the service can't be reached today |
| `OPENAI_MODEL` | `gpt-5.6-terra` | |

### Client (`client/.env`)

| Variable | Default |
|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001/api` |

## Running with Docker Compose

```bash
OPENAI_API_KEY=sk-... docker compose up --build
```

Services: Postgres on 5433, API on 3001, web (nginx) on 5173. The `migrate` service runs automatically before `api` starts.

## Deployment

The CI pipeline is defined in `Jenkinsfile`: server `npm ci` → typecheck → test → build, then client `npm ci` → lint → test → build, then Docker build and push of the **API image only** to ECR at `692901933475.dkr.ecr.us-east-1.amazonaws.com/campaign-health-api`, tagged `${BUILD_NUMBER}-${GIT_SHA}` and `latest`. The web image is not published.
