"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PILLARS } from "@/data/pillars";
import { COMMITMENTS } from "@/data/commitments";
import { CHAINS, JOBS } from "@/data/chains";
import { fmtMoney } from "@/lib/format";
import { commitmentYears, pillarTotals } from "@/lib/calc";
import { PILLAR_COLORS, STATUS_COLOR } from "@/lib/palette";
import { SourceChip } from "@/components/SourceChip";
import { CountUp } from "@/components/home/CountUp";

const TABS = ["Targets & timeline", "Value chains", "Commitments"] as const;
const YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032];
const money = (m: number) => (m >= 1000 ? `US$${m / 1000}bn` : `US$${m}m`);

function Ring({ pct, color }: { pct: number; color: string }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 88 88" className="h-24 w-24 -rotate-90" role="img" aria-label={`${pct}% of the stated pillar total`}>
      <circle cx="44" cy="44" r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="9" />
      <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} />
    </svg>);
}

export function PillarExplorer() {
  const [id, setId] = useState(2); const [tab, setTab] = useState<(typeof TABS)[number]>("Targets & timeline");
  const p = PILLARS.find((x) => x.id === id)!; const color = PILLAR_COLORS[id];
  const items = COMMITMENTS.filter((c) => c.pillar === id);
  const t = pillarTotals(); const share = t.shares.find((s) => s.id === id)?.pct;
  const dated = items.map((c) => ({ c, y: commitmentYears(c) })).filter((x) => x.y.all.length);
  const jobs = JOBS.filter((j) => j.pillar === id);
  const stated = PILLARS.filter((x) => x.amountUSDm);

  return (
    <div className="space-y-6">
      {/* proportional bar */}
      <div className="rounded-2xl border bg-card p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-semibold">US$10 billion, 2027–2030</h2>
          <span className="text-xs text-muted-foreground">Width = stated amount. Pillar 1 states none. <SourceChip paras={[66]} /></span></div>
        <div className="flex h-16 gap-1" role="group" aria-label="Pillars sized by stated amount">
          {stated.map((x) => (
            <button key={x.id} onClick={() => setId(x.id)} aria-pressed={id === x.id} title={`${x.name}: ${money(x.amountUSDm!)}`}
              style={{ flexGrow: x.amountUSDm!, flexBasis: 0, background: PILLAR_COLORS[x.id], opacity: id === x.id ? 1 : 0.45 }}
              className={`relative min-w-0 overflow-hidden rounded-md px-2 text-left text-[#101C2C] transition hover:opacity-100 ${id === x.id ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" : ""}`}>
              <span className="block truncate text-[11px] font-semibold leading-tight">{x.id}</span><span className="block truncate text-[10px] leading-tight opacity-80">{money(x.amountUSDm!)}</span>
            </button>))}
        </div>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Eight pillars">
          {PILLARS.map((x) => (
            <li key={x.id}><button onClick={() => setId(x.id)} aria-pressed={id === x.id}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${id === x.id ? "border-transparent bg-muted" : "hover:border-[#D5A62E]"}`}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-[#101C2C]" style={{ background: PILLAR_COLORS[x.id] }}>{x.id}</span>
              <span className="min-w-0"><span className="block truncate font-medium">{x.short}</span><span className="block text-xs text-muted-foreground">{x.amountUSDm ? money(x.amountUSDm) : "no amount stated"}</span></span>
            </button></li>))}
        </ol>
      </div>

      {/* dossier */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="relative p-6 sm:p-8" style={{ background: `linear-gradient(120deg, ${color}33, transparent 70%)` }}>
          <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} />
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pillar {p.id} of 8</div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{p.name}</h2>
              <p className="mt-2 text-muted-foreground">{p.summary}</p>
              <p className="mt-3 text-sm"><span className="text-muted-foreground">Its role in the system: </span>{p.role} <SourceChip paras={[p.rolePara]} /></p>
            </div>
            <div className="flex items-center gap-4">
              {share !== undefined && <div className="relative"><Ring pct={share} color={color} /><div className="absolute inset-0 flex flex-col items-center justify-center text-center"><span className="text-lg font-semibold tabular-nums">{share}%</span></div></div>}
              <div>
                <div className="text-3xl font-semibold tracking-tight tabular-nums">{p.amountUSDm ? <CountUp key={id} to={p.amountUSDm >= 1000 ? p.amountUSDm / 1000 : p.amountUSDm} decimals={p.amountUSDm >= 1000 && p.amountUSDm % 1000 ? 1 : 0} prefix="US$" suffix={p.amountUSDm >= 1000 ? "bn" : "m"} duration={900} /> : <span className="text-lg text-muted-foreground">No separate amount</span>}</div>
                <div className="text-xs text-muted-foreground">{share !== undefined ? "of the stated pillar total (computed)" : "stated in the speech"}</div>
                <div className="mt-1"><SourceChip paras={[p.amountPara]} /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t px-4 sm:px-8"><div className="flex gap-1 overflow-x-auto" role="tablist">
          {TABS.map((x) => <button key={x} role="tab" aria-selected={tab === x} onClick={() => setTab(x)}
            className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm transition ${tab === x ? "border-[#D5A62E] font-medium" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{x}{x === "Commitments" ? ` (${items.length})` : ""}</button>)}
        </div></div>

        <div className="p-6 sm:p-8">
          {tab === "Targets & timeline" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stated targets</h3>
                <ul className="mt-2 space-y-2.5 text-sm">{p.headlineTargets.map((x) => <li key={x.text} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} /><span>{x.text} <SourceChip paras={[x.para]} /></span></li>)}</ul>
                <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employment stated</h3>
                {jobs.length ? <ul className="mt-2 grid gap-2 sm:grid-cols-2">{jobs.map((j) => <li key={j.label} className="rounded-xl border p-3"><div className="text-lg font-semibold">{j.value}</div><div className="text-xs text-muted-foreground">{j.label}</div><div className="mt-1"><SourceChip paras={[j.para]} /></div></li>)}</ul>
                  : <p className="mt-2 text-sm text-muted-foreground">The speech states no job figure for this pillar.</p>}
                {jobs.length > 1 && <p className="mt-2 text-xs text-muted-foreground">Projections and potentials; they are not additive.</p>}
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dated milestones (year-level)</h3>
                {dated.length ? (
                  <div className="mt-2 overflow-x-auto"><div className="min-w-[420px]">
                    <div className="grid grid-cols-[150px_repeat(7,1fr)] text-[11px] text-muted-foreground"><span />{YEARS.map((y) => <span key={y} className="text-center">{y}</span>)}</div>
                    {dated.map(({ c, y }) => (
                      <div key={c.id} className="grid grid-cols-[150px_repeat(7,1fr)] items-center border-t py-1.5 text-xs">
                        <span className="truncate pr-2" title={c.title}>{c.title}</span>
                        {YEARS.map((yr) => <span key={yr} className="flex h-5 items-center justify-center">
                          {y.start === yr && <span title={`Starts ${c.start}`} className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />}
                          {y.end === yr && <span title={`Target ${c.target}`} className="h-2.5 w-2.5 rotate-45" style={{ background: "#D5A62E" }} />}
                          {y.all.includes(yr) && y.start !== yr && y.end !== yr && <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />}</span>)}
                      </div>))}
                  </div><p className="mt-2 text-xs text-muted-foreground"><span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ background: color }} />start · <span className="ml-1 mr-1 inline-block h-2 w-2 rotate-45 align-middle" style={{ background: "#D5A62E" }} />target date</p></div>
                ) : <p className="mt-2 text-sm text-muted-foreground">No dated commitment extracted for this pillar.</p>}
              </div>
            </div>)}

          {tab === "Value chains" && (
            <div className="space-y-6">{(CHAINS[id] ?? []).map((ch) => (
              <div key={ch.title}><h3 className="mb-2 text-sm font-semibold">{ch.title}</h3>
                <ol className="flex flex-col gap-2 lg:flex-row lg:items-stretch">{ch.steps.map((s, i) => (
                  <li key={i} className="relative flex-1 rounded-xl border p-3 text-sm">
                    <span className="mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-[#101C2C]" style={{ background: color }}>{i + 1}</span>
                    <p>{s.text}</p><div className="mt-1.5"><SourceChip paras={s.paras} /></div>
                    {i < ch.steps.length - 1 && <ArrowUpRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 rotate-45 rounded-full bg-card text-muted-foreground lg:block" />}
                  </li>))}</ol></div>))}
              <p className="text-xs text-muted-foreground">Steps follow the order the speech gives. Dates are the speech’s own.</p></div>)}

          {tab === "Commitments" && (
            <ul className="grid gap-3 md:grid-cols-2">
              {items.map((c) => (
                <li key={c.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-2"><span className="font-medium">{c.title}</span><span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[c.status] }} />{c.status}</span></div>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  <div className="mt-2 text-xs"><strong>{c.amount ? fmtMoney(c.amount) : "No amount stated"}</strong>{c.amountScope && <span className="text-muted-foreground"> · {c.amountScope}</span>}</div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><SourceChip paras={c.paras.slice(0, 3)} /><Link href={`/tracker?open=${c.id}`} className="text-xs text-muted-foreground hover:text-foreground">Tracker <ArrowUpRight className="inline h-3 w-3" /></Link></div>
                </li>))}
              {!items.length && <li className="text-sm text-muted-foreground">No commitments extracted for this pillar yet.</li>}
              <li className="text-xs text-muted-foreground md:col-span-2">Amounts inside a pillar (such as the Pwalugu Dam) are components of that pillar’s total, not additions to it.</li>
            </ul>)}
        </div>
      </div>

      {/* one production system */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight">One production system <span className="text-sm font-normal text-muted-foreground">· how ¶68 describes each pillar’s role</span></h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((x) => (
            <li key={x.id}><button onClick={() => { setId(x.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`h-full w-full rounded-xl border bg-card p-4 text-left text-sm transition hover:-translate-y-0.5 ${id === x.id ? "border-[#D5A62E]" : ""}`} style={{ borderTop: `3px solid ${PILLAR_COLORS[x.id]}` }}>
              <div className="font-medium">{x.id}. {x.short}</div><p className="mt-1 text-muted-foreground">{x.role}</p></button></li>))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">The speech describes a role for each pillar; it does not specify pillar-to-pillar flows, so none are drawn. <SourceChip paras={[68]} /></p>
      </div>
    </div>
  );
}
