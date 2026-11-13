"use client";
import { useState } from "react";
import { PILLARS } from "@/data/pillars";
import { COMMITMENTS } from "@/data/commitments";
import { fmtMoney } from "@/lib/format";
import { SourceChip } from "@/components/SourceChip";

export function PillarExplorer() {
  const [id, setId] = useState(2);
  const p = PILLARS.find((x) => x.id === id)!;
  const items = COMMITMENTS.filter((c) => c.pillar === id);
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ol className="space-y-1.5" aria-label="Eight pillars">
        {PILLARS.map((x) => (
          <li key={x.id}><button onClick={() => setId(x.id)} aria-pressed={id === x.id}
            className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${id === x.id ? "border-[#D5A62E] bg-[#D5A62E]/10" : "hover:border-[#D5A62E]"}`}>
            <span><span className="mr-2 font-mono text-xs text-muted-foreground">{x.id}</span>{x.short}</span>
            <span className="text-xs text-muted-foreground">{x.amountUSDm ? `US$${x.amountUSDm >= 1000 ? x.amountUSDm / 1000 + "bn" : x.amountUSDm + "m"}` : "n/a"}</span>
          </button></li>))}
      </ol>
      <div className="rounded-lg border p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl font-semibold">Pillar {p.id}: {p.name}</h3>
          <span className="text-sm">{p.amountUSDm ? <strong>US${p.amountUSDm.toLocaleString()} million</strong> : "No separate amount stated"} <SourceChip paras={[p.amountPara]} /></span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
        <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stated targets and timelines</h4>
        <ul className="mt-1 space-y-1 text-sm">{p.headlineTargets.map((t) => <li key={t.text}>{t.text} <SourceChip paras={[t.para]} /></li>)}</ul>
        {p.feeds.length > 0 && <>
          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Feeds into (¶68: “one production system”)</h4>
          <p className="mt-1 text-sm">{p.feeds.map((f) => PILLARS[f - 1].short).join(" · ")} <SourceChip paras={[68]} /></p></>}
        <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Extracted commitments ({items.length})</h4>
        <ul className="mt-1 divide-y text-sm">{items.map((c) => (
          <li key={c.id} className="py-2"><div className="font-medium">{c.title} <span className="font-normal text-muted-foreground">{c.amount ? `· ${fmtMoney(c.amount)}` : ""}</span></div>
            <div className="text-muted-foreground">{c.description}</div></li>))}
          {!items.length && <li className="py-2 text-muted-foreground">No commitments extracted for this pillar yet.</li>}</ul>
        <p className="mt-3 text-xs text-muted-foreground">Amounts inside a pillar (e.g. Pwalugu Dam) are components of that pillar’s total, not additions to it.</p>
      </div>
    </div>
  );
}
