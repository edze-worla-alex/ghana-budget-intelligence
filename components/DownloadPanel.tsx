import { FileSpreadsheet, FileText } from "lucide-react";
import { buildDatasets } from "@/lib/exports/datasets";
import { Button } from "@/components/ui/button";

export function DownloadPanel() {
  const sets = buildDatasets();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
        <div><div className="font-medium">Full workbook</div><div className="text-sm text-muted-foreground">{sets.length} sheets with titles, source notes, frozen headers and filters.</div></div>
        <Button asChild><a href="/api/exports?format=xlsx&dataset=all"><FileSpreadsheet className="mr-2 h-4 w-4" />Download .xlsx</a></Button>
      </div>
      <ul className="divide-y rounded-lg border">
        {sets.map((d) => (
          <li key={d.name} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
            <div><div className="font-medium">{d.name} <span className="font-normal text-muted-foreground">· {d.rows.length} rows</span></div><div className="max-w-xl text-xs text-muted-foreground">{d.note}</div></div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm"><a href={`/api/exports?format=csv&dataset=${encodeURIComponent(d.name)}`}><FileText className="mr-1 h-3 w-3" />CSV</a></Button>
              <Button asChild variant="outline" size="sm"><a href={`/api/exports?format=xlsx&dataset=${encodeURIComponent(d.name)}`}><FileSpreadsheet className="mr-1 h-3 w-3" />XLSX</a></Button>
            </div>
          </li>))}
      </ul>
      <p className="text-xs text-muted-foreground">Filtered exports: <code>/api/exports?format=xlsx&amp;dataset=Commitments&amp;sector=Agriculture</code> or <code>&amp;pillar=3</code>.</p>
    </div>
  );
}
