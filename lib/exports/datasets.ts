import { COMMITMENTS } from "@/data/commitments";
import { INDICATORS } from "@/data/indicators";
import { PILLARS } from "@/data/pillars";
import { REGIONS } from "@/data/regions";
import { fmtMoney } from "@/lib/format";
import { citeText, pageOf, SOURCE } from "@/lib/source";
import { pillarTotals } from "@/lib/calc";

export type Row = Record<string, string | number | null>;
export type Dataset = { name: string; title: string; note: string; rows: Row[] };
const regionName = (id: string) => REGIONS.find((r) => r.id === id)?.name ?? id;

export function buildDatasets(filter: { sector?: string; pillar?: number } = {}): Dataset[] {
  const com = COMMITMENTS.filter((c) => (!filter.sector || c.sector === filter.sector) && (!filter.pillar || c.pillar === filter.pillar));
  const totals = pillarTotals();
  return [
    { name: "Commitments", title: "Government commitments (announced, not verified)", note: "Status reflects the language of the speech, not implementation. Amounts may be nested inside pillar totals; do not sum.",
      rows: com.map((c) => ({ ID: c.id, Title: c.title, Description: c.description, Sector: c.sector, Pillar: c.pillar ?? null,
        Currency: c.amount?.currency ?? null, "Amount (millions)": c.amount ? c.amount.value * (c.amount.unit === "billion" ? 1000 : 1) : null,
        "Amount as stated": c.amount ? fmtMoney(c.amount) : null, "Amount scope": c.amountScope ?? null,
        Start: c.start ?? null, Target: c.target ?? null, Outcome: c.outcome ?? null, Institution: c.institution ?? null,
        Regions: c.regions.map(regionName).join("; "), "Location basis": c.locationBasis, Status: c.status,
        Paragraphs: c.paras.join(", "), "Pages": [...new Set(c.paras.map(pageOf))].join(", ") })) },
    { name: "Economic Indicators", title: "Economic indicators: reported figures, targets and ambitions", note: "Blank values are not stated in the speech and are not estimated. '(implied)' points are inferred from wording in the cited paragraph.",
      rows: INDICATORS.flatMap((i) => i.points.map((p) => ({ Indicator: i.name, Unit: i.unit, Period: p.label, Type: p.kind, Value: p.value, "As stated": p.display ?? null, Note: p.note ?? null, Paragraph: p.para, Page: pageOf(p.para) ?? null }))) },
    { name: "New Economy Pillars", title: "Eight pillars of the New Economy Programme", note: "Amounts are US$ millions as stated. Pillar 1 has no stated amount. Pillars 2–8 sum to the headline (computed, see Summary).",
      rows: PILLARS.map((p) => ({ Pillar: p.id, Name: p.name, "Stated amount (US$ m)": p.amountUSDm, Summary: p.summary, Source: citeText([p.amountPara]) })) },
    { name: "Summary", title: "Computed observations (not official figures)", note: "Derived from the stated pillar amounts.",
      rows: [{ Metric: "Sum of stated pillar amounts (US$ m)", Value: totals.sumUSDm }, { Metric: "Equals US$10bn headline?", Value: totals.matchesHeadline ? "Yes" : "No" },
        ...totals.shares.map((s) => ({ Metric: `Share of stated pillar total: ${s.name} (%)`, Value: s.pct }))] },
    { name: "Source References", title: "Source", note: "All values extracted from the document below.",
      rows: [{ Document: SOURCE.title, Delivered: SOURCE.delivered, File: "BUDGET SPEECH – ALL – FORMATTED 11thNov2026.pdf" }] },
  ];
}

export const toCSV = (rows: Row[]) => {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]); const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return "\ufeff" + [cols.map(esc).join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\r\n");
};
