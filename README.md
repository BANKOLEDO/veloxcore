# veloxcore

**Behavioural AI agents** — review simulation and personalised recommendations, culturally fluent in Nigerian context.

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  React App  │────▶│  Express API │────▶│  LLM Provider  │
│  (Vite+TS)  │◀────│  (TypeScript)│     │ (Groq/Ollama)  │
└─────────────┘     └──────┬───────┘     └───────────────┘
                           │
                     ┌─────┴──────┐
                     │ PostgreSQL │
                     │   (Neon)   │
                     └────────────┘
```

### Capabilities

**Review Simulation** — Generates realistic user reviews for unseen items using multi-step agentic reasoning: persona analysis → product evaluation → behavioural simulation → self-critique → review generation.

**Recommendations** — Personalised product recommendations with cold-start handling. Agentic workflow: user profiling → product space analysis → contextual reasoning → curated output.

**User Accounts & History** — All generated reviews and recommendations are saved per user. Rate products and track feedback.

---

## Quick Start

### Prerequisites
- Node.js 20+

### 1. Local Development (Ollama — Zero Cost)

```bash
# Install dependencies (from root)
pnpm install

# Start Ollama (separate terminal)
ollama pull qwen2.5
ollama serve

# Copy env template
cp .env.example .env
cp .env.example server/.env

# Start server + client concurrently
pnpm dev
```

Server runs on `http://localhost:3001`, client on `http://localhost:5173`.

### 2. Groq (Free API, No Local GPU)

Set in `.env` and `server/.env`:

```env
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_API_KEY=gsk_your_groq_key
LLM_MODEL=llama-3.3-70b-versatile
```

---

## API Endpoints

### Auth
```
POST   /api/auth/register      { name, email, password }
POST   /api/auth/login         { email, password }
GET    /api/auth/me            (requires Bearer token)
```

### Reviews
```
POST   /api/reviews/generate   { user, product }   (auth required)
GET    /api/reviews/history                          (auth required)
```

### Recommendations
```
POST   /api/recommendations        { user, context? }   (auth required)
GET    /api/recommendations/history                      (auth required)
GET    /api/recommendations/catalog
GET    /api/recommendations/catalog/:query
POST   /api/recommendations/rate    { productId, rating } (auth required)
POST   /api/recommendations/feedback { productId, action, recommendationId? } (auth required)
```

---

## Configuration

| Env Var | Default | Description |
|---------|---------|-------------|
| `LLM_BASE_URL` | `http://localhost:11434/v1` | OpenAI-compatible endpoint |
| `LLM_API_KEY` | `ollama` | API key |
| `LLM_MODEL` | `qwen2.5` | Model name |
| `PORT` | `3001` | Server port |
| `JWT_SECRET` | `veloxcore-dev-secret-change-in-prod` | Auth signing secret |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string (Neon/Render) |

---

## Project Structure

```
veloxcore/
├── server/                  # Express API
│   └── src/
│       ├── routes/          # auth.ts, reviews.ts, recommendations.ts
│       ├── lib/             # llm.ts, catalog.ts, nigerian.ts
│       ├── middleware/       # auth.ts (JWT)
│   ├── db/              # PostgreSQL connection & schema
│       └── types.ts
├── client/                  # React UI (Vite + TS)
│   ├── public/              # PWA assets (manifest, icons, sw.js)
│   └── src/
│       ├── pages/           # Landing, Login, Register, Reviews, Recommendations, History
│       ├── components/      # ThreeScene, Navbar, Layout, Icons, RecommendationDisplay, ReviewDisplay
│       └── lib/             # api.ts, auth-context.tsx, useStreamingText.ts
└── .env.example
```

---

Built by **dev_olabanks**
