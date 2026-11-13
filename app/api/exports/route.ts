import { buildDatasets, toCSV } from "@/lib/exports/datasets";
import { toWorkbook } from "@/lib/exports/workbook";

export const runtime = "nodejs";
// GET /api/exports?format=xlsx|csv&dataset=all|Commitments|...&sector=Agriculture&pillar=2
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const format = q.get("format") === "csv" ? "csv" : "xlsx";
  const pillar = q.get("pillar") ? Number(q.get("pillar")) : undefined;
  if (pillar !== undefined && !(pillar >= 1 && pillar <= 8)) return Response.json({ error: "pillar must be 1–8" }, { status: 400 });
  const all = buildDatasets({ sector: q.get("sector") ?? undefined, pillar });
  const want = q.get("dataset") ?? "all";
  const sets = want === "all" ? all : all.filter((d) => d.name === want);
  if (!sets.length) return Response.json({ error: "Unknown dataset" }, { status: 404 });

  const base = `ghana-budget-2027-${want === "all" ? "full" : want.toLowerCase().replace(/\s+/g, "-")}`;
  if (format === "csv") {
    if (sets.length > 1) return Response.json({ error: "CSV needs a single dataset; pass dataset=<name>" }, { status: 400 });
    return new Response(toCSV(sets[0].rows), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${base}.csv"` } });
  }
  return new Response(new Uint8Array(await toWorkbook(sets)), { headers: {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": `attachment; filename="${base}.xlsx"` } });
}
