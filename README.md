# Ghana Budget Intelligence 2027

Explainer dashboard for Ghana's 2027 Budget Speech. Next.js 15 (App Router) · React 19 · TypeScript · Tailwind 4 · Recharts · ExcelJS · Zod.

## Run
```bash
npm install
cp .env.example .env.local      # optional: add GEMINI_API_KEY or OPENAI_API_KEY
npm run dev                     # http://localhost:3000
```
Without an API key, **Ask the Budget** runs in retrieval-only mode: it shows the matching speech paragraphs instead of a written answer. Nothing is faked.

## What's in it
| Route | What it does |
|---|---|
| `/` | Animated hero + donut, count-up KPIs, 2022→2025 recovery cards, pillar bars, mini region map, AI prompt chips, "what matters most" |
| `/pillars` | Eight-pillar explorer: stated amount, targets, linkages, extracted commitments |
| `/indicators` | Area+band, bar+trend, grouped bars, donuts, concentric rings, gauge, stacked bar, delivery-calendar combo, plus the per-indicator detail charts. Reported vs target vs ambition always distinct; gaps never estimated |
| `/map` | 16-region tile map, sector filter, per-region projects with amounts and sources |
| `/tracker` | Promise vs Progress: 37 extracted commitments beside verified updates (none yet) |
| `/ai` + `/api/ai` | BM25 retrieval over all 701 paragraphs → Gemini/OpenAI streaming, with ¶/page citations |
| `/data` + `/api/exports` | XLSX (5 formatted sheets) and CSV; filter by `sector` or `pillar` |

## Layout and assistant
- Left sidebar (`components/Shell.tsx`), drawer on mobile.
- Floating assistant (`components/AiWidget.tsx`) on every page except `/ai`; it stays mounted so the chat survives navigation. Any component can open it with a question: `window.dispatchEvent(new CustomEvent("ask-budget", { detail: { q: "..." } }))`.

## Data integrity rules baked in
- Source: `public/budget-speech.pdf`. Paragraph corpus: `data/budget/paragraphs.json` (regenerate with `npm run extract`; needs poppler `pdftotext`). Page numbers are PDF pages, which equal the printed numbers.
- Every dataset row carries paragraph numbers; the UI links them to the PDF page.
- `status` follows the speech's wording ("Announced", "Planned", "In preparation"). It is never "In progress" or "Completed" without an entry in `data/progress/updates.json` that has an evidence URL (validated by Zod at build time).
- Pillar 1 has no amount. The seven stated pillar amounts sum to US$10bn; that sum is computed and labelled as such.
- Amounts nested in a pillar (Pwalugu US$1bn, transmission US$500m, nuclear US$200m, oil palm US$500m window) are never summed. The GH¢600m for stadia is a total across 10 regions, not per region.
- `locationBasis`: `stated` (region named in the speech), `inferred` (corridor or zone mapped by us; shown with a "location inferred" badge), `national`.

## Known items to review
1. **Inflation target** prints as "8±2" with a symbol that some PDF extractors drop (reads as "82"). Dataset uses 8% ± 2 (¶457).
2. **End-2024 figures** (inflation 23.8%, primary deficit 4.1%) are implied by ¶42's "from … to …" wording and flagged "implied".
3. **Inferred locations**: rice hubs (Afram Plains → Eastern, Volta Basin → Volta, "Western Ghana", "Northern Ghana") and Pwalugu (White Volta corridor → North East). Confirm before publishing.
4. Section headings in the PDF are appended to the preceding paragraph's text (e.g. ¶488 ends with a heading).
5. The speech has large non-New-Economy sector allocations (¶590+). Only a few are extracted (stadia, northern water). Extend `data/commitments.ts` for the rest.

## Not built yet (deliberately out of scope)
Admin UI and DB (progress updates are a validated JSON file for now; move to Prisma when you need multi-user editing), embeddings (BM25 is used; swap `lib/ai/retrieve.ts` for pgvector later), PDF/PNG export, GeoJSON choropleth (the tile map needs no geometry; replace `RegionMap` tiles with SVG paths if you add a boundary file).

## Deploy
Vercel: set the env vars from `.env.example`. The in-memory rate limiter in `app/api/ai/route.ts` is per instance; use Upstash for production.
