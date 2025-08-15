
# ForgeQuote — AI Quoting Engine (Hackathon Starter)

> Instant, **human‑in‑the‑loop** quoting for weird/bespoke hardware & manufacturing jobs. Built with **Next.js**, **Prisma + SQLite**, and the **OpenAI Responses API** using **Structured Outputs** so you always get valid JSON for BOM, labor, schedule, pricing, and Mermaid diagrams.

<div align="center">
<!-- Badges (optional) -->
<!-- <img alt="License" src="https://img.shields.io/badge/license-BUSL--1.1-blue"> -->
<!-- <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black"> -->
</div>

---

## Table of Contents
- [Why ForgeQuote](#why-forgequote)
- [Features](#features)
- [Quickstart](#quickstart)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [API](#api)
- [Data Model](#data-model)
- [Customization](#customization)
- [Roadmap (48‑hour friendly)](#roadmap-48hour-friendly)
- [License & Commercial Use](#license--commercial-use)
- [Trademarks](#trademarks)
- [Support / Contact](#support--contact)

---

## Why ForgeQuote
Quoting sucks the life out of senior engineers. ForgeQuote flips it: paste an RFQ → get a **structured** draft quote (summary, assumptions, BOM, hours, schedule, risks, price) you can tweak fast and ship to sales.

- **Fast**: minutes to a credible first pass
- **Realistic**: prompts tuned for small‑batch US work
- **Auditable**: strict JSON schema, you can diff & persist

## Features
- **New Quote wizard** → paste requirements text
- Server calls **OpenAI Responses API** with **JSON Schema** → returns guaranteed JSON:
  - Project summary & assumptions
  - **BOM** (qty, part, spec, unit cost, source)
  - **Labor** by role (EE/ME/FW/PM/Tech/QA)
  - **Schedule** with milestones
  - **Risks** & mitigations
  - **Pricing** (materials, labor, overhead, margin → final)
  - **Mermaid** diagrams (system + process flow)
- **SQLite + Prisma** persistence
- Simple UI to render the quote with diagram previews

> No auth, uploads, or PDFs by default—kept minimal for hackathons.

## Quickstart
```bash
# Node 20+ recommended
npm i
cp .env.example .env             # add your keys
npm run prisma:generate
npm run prisma:migrate
npm run dev
# open http://localhost:3000
```

**Production‑like preview**
```bash
npm run build
npm run start
# open http://localhost:3000
```

## Environment Variables
Copy `.env.example` → `.env` and set:
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5      # or gpt-4o, etc.
DATABASE_URL="file:./dev.db"
```

## Scripts
```bash
npm run dev            # next dev
npm run build          # next build
npm run start          # next start
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Project Structure
```
src/
  app/
    api/quotes/route.ts      # POST /api/quotes → calls Responses API (Structured Outputs)
    page.tsx                 # list of quotes
    layout.tsx               # shell
    quotes/new/page.tsx      # wizard to create a quote
  components/
    Mermaid.tsx              # client mermaid renderer
    QuoteCard.tsx            # renders one quote
  lib/
    openai.ts                # OpenAI client + model selection
    schema.ts                # Zod schema mirroring JSON Schema
    db.ts                    # Prisma client
prisma/
  schema.prisma              # Prisma models (SQLite)
public/
  logo.svg
```

## How It Works
```mermaid
flowchart LR
  A[RFQ Text] --> B[POST /api/quotes]
  B --> C[OpenAI Responses API<br/>response_format: json_schema]
  C --> D[Validated JSON<br/>(Zod)]
  D --> E[(SQLite via Prisma)]
  E --> F[Home Page Renders<br/>(BOM/Labor/Schedule/Pricing/Diagrams)]
```

- We send the RFQ to the **Responses API** with a **JSON Schema** (Structured Outputs).  
- The model must return valid JSON.  
- We validate with **Zod** and persist to **SQLite**.  
- The UI renders everything and previews Mermaid diagrams.

## API
**POST** `/api/quotes` — generate and save a quote

**Request (JSON)**
```json
{
  "title": "Custom aluminum enclosure with PCB + firmware",
  "inputText": "Describe your RFQ / requirements here..."
}
```

**Response (200)**
```json
{ "id": "clxyz123..." }
```

> The full generated quote JSON is stored in the DB and rendered on the home page.

## Data Model
`prisma/schema.prisma`
```prisma
model Quote {
  id          String   @id @default(cuid())
  title       String
  inputText   String
  outputJson  String   // structured QuoteOutput JSON
  status      String   @default("draft")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Customization
### Pricing knobs
Open `src/app/api/quotes/route.ts` and tune the instruction block or post‑process the `pricing` object (e.g., enforce minimum margin, overhead percentage). Add a client‑side **margin slider** to recompute `final_price` without another model call.

### Model selection
Set `OPENAI_MODEL` in `.env` (e.g., `gpt-5`, `gpt-4o`).

### Add tools (catalog, pricing DB, compliance lookups)
The Responses API supports **tool/function calling**. Add a tool definition and pass it in the request; when the model asks to use it, run the tool and return the result to the model before finalizing JSON.

## Roadmap (48‑hour friendly)
- [ ] **Margin slider** in UI (recalc `final_price` client‑side)
- [ ] **PDF export** (server-side `pdfkit` or client `react-pdf`)
- [ ] **File uploads** (parse PDFs/specs, include extracts in prompt)
- [ ] **Catalog tool** (local YAML or Octopart wrapper) with cost citations
- [ ] **Auth** (Clerk/NextAuth) and Postgres (Neon/Supabase) for persistence
- [ ] **Web Search tool** for part sourcing & vendors

## License & Commercial Use
This repo is released under a **Business Source style license (BUSL‑1.1)** with a **free non‑production grant** and a **$5k/12‑month revenue allowance**. Anything beyond that requires a **Commercial License** from Meatbag Labs.

- See `LICENSE`, `COMMERCIAL_LICENSE_OFFER.md`, and `TRADEMARKS.md`.
- **Change Date:** 2029‑01‑01 → **Apache‑2.0** thereafter.

> This is not legal advice. Get counsel for commercial deployments.

## Trademarks
Meatbag Labs®, ForgeQuote™ and related marks are trademarks of Meatbag Labs LLC. No trademark rights are granted by the software license.

## Support / Contact
- Licensing & commercial: **licensing@meatbaglabs.com**
- Issues/bugs: GitHub Issues
- Security: Email with subject **[SECURITY]**

---

**Built by Meatbag Labs.** If this saves you time, consider buying a commercial license or sponsoring the project.
