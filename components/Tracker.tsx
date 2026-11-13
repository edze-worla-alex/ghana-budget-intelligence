"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarRange, Download, ExternalLink, LayoutGrid, Search, Table as TableIcon, X } from "lucide-react";
import { COMMITMENTS } from "@/data/commitments";
import { REGION_SHAPES } from "@/data/ghana-map";
import type { Commitment, ProgressUpdate, Sector, Status } from "@/data/types";
import { fmtMoney } from "@/lib/format";
import { commitmentYears } from "@/lib/calc";
import { SECTOR_COLOR, STATUS_COLOR } from "@/lib/palette";
import { citeText, getPara, pdfHref } from "@/lib/source";
import { SourceChip } from "@/components/SourceChip";
import { Input } from "@/components/ui/input";

const VIEWS = [["board", "Board", LayoutGrid], ["table", "Table", TableIcon], ["timeline", "Timeline", CalendarRange]] as const;
type View = (typeof VIEWS)[number][0];
const COLUMNS: Status[] = ["Announced", "Planned", "In preparation"];
const STATUS_HELP: Record<string, string> = { Announced: "Stated intent", Planned: "A dated milestone is given", "In preparation": "The speech says work or approval is under way" };

export function Tracker({ updates, initialOpen }: { updates: ProgressUpdate[]; initialOpen?: string }) {
  const [q, setQ] = useState(""); const [sector, setSector] = useState<Sector | "all">("all"); const [status, setStatus] = useState<Status | "all">("all");
  const [view, setView] = useState<View>("board"); const [openId, setOpenId] = useState<string | null>(initialOpen && COMMITMENTS.some((c) => c.id === initialOpen) ? initialOpen : null);
  const sectors = useMemo(() => [...new Set(COMMITMENTS.map((c) => c.sector))] as Sector[], []);
  const latest = (id: string) => updates.filter((u) => u.commitmentId === id).sort((a, b) => b.date.localeCompare(a.date))[0];
  const rows = COMMITMENTS.filter((c) => (sector === "all" || c.sector === sector) && (status === "all" || c.status === status) && `${c.id} ${c.title} ${c.description} ${c.institution ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  const open = openId ? COMMITMENTS.find((c) => c.id === openId) ?? null : null;

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  const withAmount = COMMITMENTS.filter((c) => c.amount).length;
  const withDates = COMMITMENTS.filter((c) => commitmentYears(c).all.length).length;
  const verified = COMMITMENTS.filter((c) => latest(c.id)).length;
  const byStatus = COLUMNS.map((s) => ({ s, n: COMMITMENTS.filter((c) => c.status === s).length }));
  const csv = `/api/exports?format=csv&dataset=Commitments${sector !== "all" ? `&sector=${encodeURIComponent(sector)}` : ""}`;

  return (
    <div className="space-y-6">
      {/* accountability summary */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-baseline justify-between"><h2 className="font-semibold">What the speech promised</h2><span className="text-xs text-muted-foreground">{COMMITMENTS.length} commitments</span></div>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label="Commitments by government status">
            {byStatus.map(({ s, n }) => <div key={s} style={{ width: `${(n / COMMITMENTS.length) * 100}%`, background: STATUS_COLOR[s] }} title={`${s}: ${n}`} />)}</div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">{byStatus.map(({ s, n }) => (
            <li key={s} className="text-sm"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[s] }} /><span className="font-semibold tabular-nums">{n}</span> {s}</span><span className="block text-xs text-muted-foreground">{STATUS_HELP[s]}</span></li>))}</ul>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-[#101C2C] p-5 text-[#F8F7F3]">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D5A62E]">Independently verified progress</div>
          <div className="mt-2 flex items-baseline gap-2"><span className="text-5xl font-semibold tabular-nums">{verified}</span><span className="text-white/60">of {COMMITMENTS.length}</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#3FBF8A]" style={{ width: `${(verified / COMMITMENTS.length) * 100}%` }} /></div>
          <p className="mt-3 text-xs text-white/60">{withAmount} state an amount · {withDates} carry a dated milestone. A speech is an announcement: nothing counts as progress without an evidence link.</p>
        </div>
      </div>

      {/* controls */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-52 flex-1 sm:max-w-xs"><Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-8" placeholder="Search promises…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search commitments" /></div>
          <select className="h-9 rounded-md border bg-background px-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value as Status | "all")} aria-label="Filter by government status">
            <option value="all">Any status</option>{COLUMNS.map((s) => <option key={s}>{s}</option>)}</select>
          <div className="ml-auto flex rounded-lg border p-0.5" role="tablist" aria-label="View">
            {VIEWS.map(([k, label, Icon]) => <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition ${view === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}</div>
          <a href={csv} className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><Download className="h-3.5 w-3.5" />CSV</a>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by sector">
          {(["all", ...sectors] as const).map((s) => <button key={s} onClick={() => setSector(s)} aria-pressed={sector === s} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${sector === s ? "border-[#D5A62E] bg-[#D5A62E]/15 font-medium" : "text-muted-foreground hover:text-foreground"}`}>{s !== "all" && <span className="h-2 w-2 rounded-full" style={{ background: SECTOR_COLOR[s] }} />}{s === "all" ? "All sectors" : s}</button>)}
        </div>
        <p className="text-xs text-muted-foreground" aria-live="polite">Showing {rows.length} of {COMMITMENTS.length}</p>
      </div>

      {view === "board" && (
        <div className="grid gap-4 lg:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = rows.filter((c) => c.status === col);
            return (
              <section key={col} className="rounded-2xl bg-muted/40 p-3" aria-label={col}>
                <header className="mb-3 flex items-center gap-2 px-1"><span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[col] }} /><h3 className="text-sm font-semibold">{col}</h3><span className="ml-auto rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">{items.length}</span></header>
                <ul className="space-y-3">{items.map((c) => <Card key={c.id} c={c} u={latest(c.id)} onOpen={() => setOpenId(c.id)} />)}
                  {!items.length && <li className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">Nothing here for this filter</li>}</ul>
              </section>);
          })}
        </div>)}

      {view === "table" && (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr>{["ID", "Promise", "Amount", "Target", "Government status", "Verified progress"].map((h) => <th key={h} className="px-3 py-2.5 font-medium">{h}</th>)}</tr></thead>
            <tbody>{rows.map((c) => { const u = latest(c.id); return (
              <tr key={c.id} tabIndex={0} onClick={() => setOpenId(c.id)} onKeyDown={(e) => e.key === "Enter" && setOpenId(c.id)} className="cursor-pointer border-t align-top hover:bg-muted/30 focus-visible:bg-muted/40 focus-visible:outline-none">
                <td className="px-3 py-2.5 font-mono text-xs">{c.id}</td>
                <td className="px-3 py-2.5"><div className="font-medium">{c.title}</div><div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ background: SECTOR_COLOR[c.sector] }} />{c.sector}</div></td>
                <td className="whitespace-nowrap px-3 py-2.5">{fmtMoney(c.amount)}</td><td className="px-3 py-2.5">{c.target ?? (c.start ? `from ${c.start}` : "—")}</td>
                <td className="px-3 py-2.5"><StatusPill s={c.status} /></td>
                <td className="px-3 py-2.5">{u ? <StatusPill s={u.status} /> : <span className="text-xs text-muted-foreground">No verified update</span>}</td>
              </tr>); })}</tbody>
          </table>
        </div>)}

      {view === "timeline" && <Timeline rows={rows} onOpen={setOpenId} />}

      <p className="text-xs text-muted-foreground">“Government status” follows the speech’s own wording. It is not evidence of delivery. Progress appears only when an entry with an evidence link is added to <code>data/progress/updates.json</code>.</p>

      {open && <Drawer c={open} updates={updates.filter((u) => u.commitmentId === open.id)} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function StatusPill({ s }: { s: Status }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs"><span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[s] }} />{s}</span>;
}

function Card({ c, u, onOpen }: { c: Commitment; u?: ProgressUpdate; onOpen: () => void }) {
  return (
    <li>
      <button onClick={onOpen} className="group w-full overflow-hidden rounded-xl border bg-card text-left transition hover:-translate-y-0.5 hover:shadow-md" style={{ borderTop: `3px solid ${SECTOR_COLOR[c.sector]}` }}>
        <div className="p-3.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground"><span className="font-mono">{c.id}</span><span>{c.sector}</span></div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#087A4B] dark:text-[#D5A62E]">The promise</div>
          <div className="font-medium leading-snug">{c.title}</div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            {c.amount && <span className="font-semibold text-foreground">{fmtMoney(c.amount)}</span>}{(c.target ?? c.start) && <span>{c.target ?? `from ${c.start}`}</span>}{c.regions.length > 0 && <span>{c.regions.length} region{c.regions.length > 1 ? "s" : ""}</span>}</div>
        </div>
        <div className={`border-t px-3.5 py-2 text-xs ${u ? "bg-[#087A4B]/10" : "border-dashed bg-muted/30 text-muted-foreground"}`}>
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em]">The proof</span>{u ? <span>{u.status} · {u.date}</span> : "No verified update yet"}</div>
      </button>
    </li>);
}

function Timeline({ rows, onOpen }: { rows: Commitment[]; onOpen: (id: string) => void }) {
  const dated = rows.map((c) => ({ c, y: commitmentYears(c) })).filter((x) => x.y.all.length);
  const undated = rows.length - dated.length;
  const all = dated.flatMap((d) => d.y.all); const min = Math.min(2026, ...all), max = Math.max(2030, ...all);
  const years = Array.from({ length: max - min + 1 }, (_, i) => min + i); const n = years.length;
  const pos = (y: number) => ((y - min + 0.5) / n) * 100;
  const now = ((2026 - min + 0.87) / n) * 100;
  const sorted = [...dated].sort((a, b) => (a.y.all[0] - b.y.all[0]) || a.c.title.localeCompare(b.c.title));
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card p-4">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[240px_1fr] text-xs text-muted-foreground">
          <span />
          <div className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>{years.map((y) => <span key={y} className="border-l px-1 pb-1 text-center">{y}</span>)}</div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-[240px] right-0"><div className="absolute inset-y-0 w-px bg-[#C8553D]" style={{ left: `${now}%` }}><span className="absolute -top-0.5 left-1 rounded bg-[#C8553D] px-1 text-[10px] text-white">Now</span></div></div>
          {sorted.map(({ c, y }) => (
            <button key={c.id} onClick={() => onOpen(c.id)} className="grid w-full grid-cols-[240px_1fr] items-center border-t py-1.5 text-left text-xs hover:bg-muted/40">
              <span className="flex items-center gap-2 truncate pr-3"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SECTOR_COLOR[c.sector] }} /><span className="truncate">{c.title}</span></span>
              <span className="relative h-5">
                {y.start !== undefined && y.end !== undefined && y.end > y.start && <span className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full opacity-60" style={{ left: `${pos(y.start)}%`, width: `${pos(y.end) - pos(y.start)}%`, background: SECTOR_COLOR[c.sector] }} />}
                {y.start !== undefined && <span title={`Starts ${c.start}`} className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card" style={{ left: `${pos(y.start)}%`, background: SECTOR_COLOR[c.sector] }} />}
                {y.end !== undefined && <span title={`Target ${c.target}`} className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 ring-2 ring-card" style={{ left: `${pos(y.end)}%`, background: "#D5A62E" }} />}
              </span>
            </button>))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-muted-foreground align-middle" /> start · <span className="ml-1 mr-1 inline-block h-2.5 w-2.5 rotate-45 bg-[#D5A62E] align-middle" /> target date · year-level precision: markers sit mid-year, so a late-2026 start can appear before “Now”. {undated > 0 && `${undated} commitment${undated > 1 ? "s" : ""} in this selection state no date.`}</p>
      </div>
    </div>);
}

function Drawer({ c, updates, onClose }: { c: Commitment; updates: ProgressUpdate[]; onClose: () => void }) {
  const facts: [string, React.ReactNode][] = [
    ["Sector", c.sector], ["Amount", c.amount ? fmtMoney(c.amount) : "Not stated"], ["Starts", c.start ?? "Not stated"], ["Target", c.target ?? "Not stated"], ["Institution", c.institution ?? "Not identified"], ["Pillar", c.pillar ? `Pillar ${c.pillar}` : "Outside the eight pillars"]];
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={c.title}>
      <button className="absolute inset-0 bg-black/50" aria-label="Close details" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-[min(560px,100vw)] flex-col overflow-y-auto bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b bg-background p-5" style={{ borderTop: `4px solid ${SECTOR_COLOR[c.sector]}` }}>
          <div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="font-mono">{c.id}</span><StatusPill s={c.status} /></div><h2 className="mt-1 text-xl font-semibold leading-snug">{c.title}</h2></div>
          <button onClick={onClose} aria-label="Close" className="rounded p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-6 p-5 text-sm">
          <p>{c.description}</p>
          {c.outcome && <p className="rounded-lg bg-muted p-3"><strong>Expected outcome: </strong>{c.outcome}</p>}
          <dl className="grid grid-cols-2 gap-3">{facts.map(([k, v]) => <div key={k} className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>)}</dl>
          {c.amountScope && <p className="text-xs text-muted-foreground">Amount scope: {c.amountScope}</p>}
          {c.regions.length > 0 && <div><h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Regions named {c.locationBasis === "inferred" && "(location inferred)"}</h3><div className="flex flex-wrap gap-1.5">{c.regions.map((r) => <Link key={r} href="/map" className="rounded-full border px-2.5 py-0.5 text-xs hover:border-[#D5A62E]">{REGION_SHAPES[r].name}</Link>)}</div></div>}

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">What the speech says</h3>
            <ul className="space-y-3">{c.paras.map((n) => { const p = getPara(n); return (
              <li key={n} className="rounded-lg border-l-2 border-[#D5A62E] bg-muted/40 p-3">
                <a href={pdfHref(n)} target="_blank" rel="noreferrer" className="mb-1 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground">{citeText([n])} <ExternalLink className="h-3 w-3" /></a>
                <p className="text-[13px] leading-relaxed">{p?.text}</p></li>); })}</ul>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Proof of progress</h3>
            {updates.length ? <ul className="space-y-3">{updates.map((u) => (
              <li key={u.date + u.summary} className="rounded-lg border border-[#087A4B]/40 bg-[#087A4B]/10 p-3"><div className="flex items-center justify-between"><StatusPill s={u.status} /><span className="text-xs text-muted-foreground">{u.date} · {u.verification}</span></div>
                <p className="mt-2">{u.summary}</p><a className="mt-1 inline-flex items-center gap-1 text-xs underline" href={u.evidenceUrl} target="_blank" rel="noreferrer">Evidence <ExternalLink className="h-3 w-3" /></a><div className="text-xs text-muted-foreground">Verified by {u.verifiedBy}</div></li>))}</ul>
              : <div className="rounded-lg border border-dashed p-4 text-muted-foreground"><p>No independently verified update yet. The status above is what the government announced.</p>
                <p className="mt-2 text-xs">To add evidence, append to <code>data/progress/updates.json</code>:</p>
                <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-[11px] text-foreground">{`{ "commitmentId": "${c.id}", "date": "2027-03-01", "status": "In progress",\n  "summary": "…", "evidenceUrl": "https://…",\n  "verifiedBy": "…", "verification": "independent" }`}</pre></div>}
          </div>
        </div>
      </aside>
    </div>);
}
