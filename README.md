# ForgeQuote — Hackathon Starter

**Goal:** Instant, *human-in-the-loop* quoting for weird/bespoke hardware + manufacturing jobs.
  
Built with 
**Next.js (App Router)**
**Prisma + SQLite**
**OpenAI Responses API** (function/tool calling + Structured Outputs).

## One‑minute setup

```bash
# Node 20+ recommended
npm i
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Create `.env` from the example:

```bash
cp .env.example .env
# Add your keys and run again
```

Open http://localhost:3000

## What’s in here

- ✅ New Quote wizard (paste specs / requirements)  
- ✅ Server route calls **OpenAI Responses API** with **Structured Outputs** to produce:
  - Project summary + assumptions
  - BOM (qty, part, spec, target cost)
  - Labor estimate by role
  - Schedule milestones
  - Risks & mitigations
  - Pricing breakdown (materials, labor, overhead, margin, final)
  - Mermaid diagrams (system + flow)
- ✅ Persist quotes to **SQLite** via Prisma
- ✅ Minimal UI to view quote results
- ⏭️ (Nice-to-haves you can add in 48h): PDF export, file uploads, auth, pgvector, Octopart integration, multi‑agent orchestration

## Scripts

```jsonc
npm run dev         // next dev
npm run build       // next build
npm run start       // next start
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Environment

See `.env.example` for full list.

- `OPENAI_API_KEY` — required
- `OPENAI_MODEL` — defaults to `gpt-4o`, set to `gpt-5` (or the latest) if you have access
- `DATABASE_URL` — defaults to local SQLite

## Architecture

- **Next.js** full‑stack (no separate server to keep it simple)
- **/app/api/quotes** — POST endpoint takes user spec and returns a structured `QuoteOutput` JSON; persists to DB
- **OpenAI Responses API** with **response_format: json_schema** so you always get valid JSON
- **Tool/Function calling** ready: easy to extend with `search_catalog`, `pricing_db`, etc.

---

## Licensing

This repo is released under a **Business Source style license (BUSL 1.1)** with a **free non-production grant** and a **$5k revenue allowance**. Beyond that requires a commercial license from Meatbag Labs. See:

- `LICENSE` (BUSL‑1.1 terms)
- `COMMERCIAL_LICENSE_OFFER.md` (pricing & how to buy)
- `TRADEMARKS.md`

