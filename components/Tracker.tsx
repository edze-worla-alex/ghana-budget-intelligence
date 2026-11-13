"use client";
import { Fragment, useMemo, useState } from "react";
import { COMMITMENTS } from "@/data/commitments";
import type { ProgressUpdate, Sector } from "@/data/types";
import { fmtMoney } from "@/lib/format";
import { SourceChip } from "@/components/SourceChip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function Tracker({ updates }: { updates: ProgressUpdate[] }) {
  const [q, setQ] = useState(""); const [sector, setSector] = useState<Sector | "all">("all"); const [open, setOpen] = useState<string | null>(null);
  const sectors = useMemo(() => [...new Set(COMMITMENTS.map((c) => c.sector))], []);
  const latest = (id: string) => updates.filter((u) => u.commitmentId === id).sort((a, b) => b.date.localeCompare(a.date))[0];
  const rows = COMMITMENTS.filter((c) => (sector === "all" || c.sector === sector) && `${c.id} ${c.title} ${c.description}`.toLowerCase().includes(q.toLowerCase()));
  const verified = COMMITMENTS.filter((c) => latest(c.id)).length;

  return (
    <div>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Commitments extracted" value={COMMITMENTS.length} />
        <Stat label="With verified progress update" value={verified} />
        <Stat label="Announced only" value={COMMITMENTS.length - verified} />
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="Search commitments…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search commitments" />
        <select className="rounded-md border bg-background px-2 text-sm" value={sector} onChange={(e) => setSector(e.target.value as Sector | "all")} aria-label="Filter by sector">
          <option value="all">All sectors</option>{sectors.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr>
            {["ID", "Promise (what the speech says)", "Amount", "Target", "Government status", "Independently verified progress"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((c) => { const u = latest(c.id); return (
              <Fragment key={c.id}>
                <tr className="cursor-pointer border-t align-top hover:bg-muted/30" onClick={() => setOpen(open === c.id ? null : c.id)}>
                  <td className="px-3 py-2 font-mono text-xs">{c.id}</td>
                  <td className="px-3 py-2"><div className="font-medium">{c.title}</div><div className="text-xs text-muted-foreground">{c.sector}</div></td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmtMoney(c.amount)}</td>
                  <td className="px-3 py-2">{c.target ?? c.start ?? "—"}</td>
                  <td className="px-3 py-2"><Badge variant="outline">{c.status}</Badge></td>
                  <td className="px-3 py-2">{u ? <span><Badge>{u.status}</Badge> <span className="text-xs text-muted-foreground">{u.date} · {u.verifiedBy}</span></span> : <span className="text-xs text-muted-foreground">No verified update yet</span>}</td>
                </tr>
                {open === c.id && (
                  <tr className="bg-muted/20"><td colSpan={6} className="px-3 py-3 text-sm">
                    <p>{c.description}</p>
                    {c.outcome && <p className="mt-1"><strong>Expected outcome:</strong> {c.outcome}</p>}
                    {c.amountScope && <p className="mt-1 text-muted-foreground">Amount scope: {c.amountScope}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">Source: <SourceChip paras={c.paras} /></p>
                    {u && <p className="mt-2 border-l-2 border-[#087A4B] pl-2"><strong>{u.date}:</strong> {u.summary} <a className="underline" href={u.evidenceUrl} target="_blank" rel="noreferrer">Evidence</a></p>}
                  </td></tr>)}
              </Fragment>); })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">“Government status” follows the speech’s own language (announced / planned / in preparation). It is not evidence of delivery. Progress appears only when an entry with an evidence link is added to <code>data/progress/updates.json</code>.</p>
    </div>
  );
}
const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg border p-3"><div className="text-2xl font-semibold">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>);
