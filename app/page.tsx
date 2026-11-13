import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { PILLARS } from "@/data/pillars";
import { COMMITMENTS } from "@/data/commitments";
import { pillarTotals } from "@/lib/calc";
import { PILLAR_COLORS } from "@/lib/palette";
import { DonutPillars } from "@/components/charts/DonutPillars";
import { SourceChip } from "@/components/SourceChip";
import { CountUp } from "@/components/home/CountUp";
import { AskChip } from "@/components/home/AskChip";
import { MiniMap } from "@/components/home/MiniMap";

const KPIS = [
  { n: <CountUp to={10} prefix="US$" suffix="bn" />, l: "New Economy Programme, 2027–2030", p: [66], tip: "Spent over four years across eight connected pillars." },
  { n: <CountUp to={30} prefix="GH¢" suffix="bn" />, l: "2027 New Economy investment", p: [111], tip: "A cedi figure for 2027; not a conversion of the US$ total." },
  { n: <CountUp to={1.5} decimals={1} suffix="% GDP" />, l: "2027 programme commitment", p: [111], tip: "Financed by a lower primary-surplus target and tax reform (¶109–110)." },
  { n: <CountUp to={8} suffix=" pillars" />, l: "Economic transformation priorities", p: [67], tip: "Seven state an amount; Pillar 1 does not." },
  { n: <span>2027–30</span>, l: "Programme period", p: [66], tip: "Begins as Ghana turns 70 (¶56, ¶61)." },
];
const TICKER = ["Real GDP growth ≥ 5.2% (2027)", "Non-oil GDP growth ≥ 5.7%", "Inflation 8% ± 2 by end-2027", "Primary surplus ≥ 0.5% of GDP", "Reserves ≥ 6 months of import cover", "2030: growth ≈ 8% · unemployment < 8%", "Commercial rice imports banned by 2030", "Raw gold exports banned from Dec 2028"];
const THEN_NOW = [
  { k: "Inflation", from: "54.1%", to: <CountUp to={5.4} decimals={1} suffix="%" />, d: "−48.7 pp", p: [33, 42] },
  { k: "Primary balance", from: "−4.3% GDP", to: <CountUp to={2.5} decimals={1} prefix="+" suffix="% GDP" />, d: "+6.8 pp", p: [33, 42] },
  { k: "Public debt", from: "over 100% GDP", to: <CountUp to={44.7} decimals={1} suffix="% GDP" />, d: "over 55 pp lower", p: [33, 42] },
  { k: "Reserves", from: "under 3 weeks", to: <CountUp to={5.7} decimals={1} suffix=" months" />, d: "of import cover", p: [33, 42] },
];
const MATTERS = [
  { t: "Import bans with dates", d: "Commercial rice imports prohibited by 2030; raw gold exports by Dec 2028; raw manganese and bauxite by end-2030; cocoa 100% processed locally by 2030.", p: [148, 256, 258, 192], href: "/tracker" },
  { t: "Buy-Ghana public procurement", d: "Laws to be amended so public money for medicines and for uniforms and hospital textiles favours or requires Ghanaian-made goods.", p: [305, 317], href: "/tracker" },
  { t: "Power and rail from own resources", d: "A 1,450 MW thermal plant (600 MW by Dec 2028) and a Western Corridor Railway financed from petroleum revenue and royalties, not borrowing.", p: [206, 516, 519], href: "/map" },
  { t: "A lower primary-surplus target", d: "Part of the financing: the target falls by 1 percentage point of GDP, with a 2027 floor of 0.5%.", p: [109, 457], href: "/indicators" },
];
const TARGETS = [["Real GDP growth", "≥ 5.2%"], ["Non-oil GDP growth", "≥ 5.7%"], ["End-year inflation", "8% ± 2"], ["Primary surplus", "≥ 0.5% GDP"], ["Reserves", "≥ 6 months"]];

export default function Home() {
  const t = pillarTotals();
  const stated = PILLARS.filter((p) => p.amountUSDm);
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="animate-rise relative overflow-hidden rounded-3xl bg-[#101C2C] text-[#F8F7F3] ring-1 ring-white/10">
        <div className="absolute inset-x-0 top-0 flex h-1"><span className="flex-1 bg-[#CE1126]" /><span className="flex-1 bg-[#D5A62E]" /><span className="flex-1 bg-[#087A4B]" /></div>
        <div className="animate-drift absolute -left-28 -top-28 h-[26rem] w-[26rem] rounded-full bg-[#087A4B]/35 blur-3xl" />
        <div className="animate-drift2 absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-[#D5A62E]/25 blur-3xl" />
        <div className="bg-grid absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:p-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"><span className="h-1.5 w-1.5 rounded-full bg-[#D5A62E]" />Budget Speech · 12 November 2026</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              The New Economy.<br /><span className="bg-gradient-to-r from-[#D5A62E] via-[#F2D27A] to-[#3FBF8A] bg-clip-text text-transparent">New Ghana.</span><br />Jobs and Prosperity.
            </h1>
            <p className="mt-5 max-w-xl text-white/70">Explore the numbers, policies, economic priorities and investment commitments shaping Ghana’s 2027 financial year. Every figure links to its paragraph and page in the speech.</p>
            <p className="mt-3 text-sm font-medium text-[#D5A62E]">Understand the Budget. Follow the Money. Measure the Promises.</p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm">
              <Link href="/pillars" className="inline-flex items-center gap-2 rounded-full bg-[#D5A62E] px-5 py-2.5 font-semibold text-[#101C2C] transition hover:scale-[1.03]">Explore the programme <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/map" className="rounded-full border border-white/25 px-5 py-2.5 transition hover:bg-white/10">Regional map</Link>
              <Link href="/data" className="rounded-full border border-white/25 px-5 py-2.5 transition hover:bg-white/10">Download data</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Where the stated pillar money goes</div>
            <DonutPillars data={t.shares} dark />
            <p className="mt-3 text-[11px] text-white/45">Pillar 1 states no amount. The sum of the other seven is computed and equals the US$10bn headline.</p>
          </div>
        </div>
        {/* ticker */}
        <div className="relative overflow-hidden border-t border-white/10 bg-black/20 py-2.5 text-xs text-white/70" aria-hidden>
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">{[...TICKER, ...TICKER].map((x, i) => <span key={i} className="flex items-center gap-10">{x}<span className="text-[#D5A62E]">◆</span></span>)}</div>
        </div>
      </section>

      {/* KPIs */}
      <section aria-label="Budget at a glance" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {KPIS.map((k, i) => (
          <div key={k.l} title={k.tip} style={{ animationDelay: `${i * 70}ms` }} className="animate-rise group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-[#D5A62E]">
            <div className="text-3xl font-semibold tracking-tight">{k.n}</div>
            <div className="mt-1 text-sm text-muted-foreground">{k.l}</div>
            <div className="mt-3"><SourceChip paras={k.p} /></div>
          </div>))}
      </section>

      {/* THEN vs NOW */}
      <section>
        <div className="mb-3 flex items-end justify-between"><h2 className="text-xl font-semibold tracking-tight">From crisis to stability <span className="text-muted-foreground">· end-2022 → end-2025</span></h2><Link href="/indicators" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">All indicators <ArrowUpRight className="inline h-3.5 w-3.5" /></Link></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {THEN_NOW.map((r) => (
            <div key={r.k} className="relative overflow-hidden rounded-2xl border bg-card p-5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C8553D] to-[#087A4B]" />
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{r.k}</div>
              <div className="mt-3 text-sm text-[#C8553D] line-through decoration-1">{r.from}</div>
              <div className="text-3xl font-semibold tracking-tight text-[#087A4B] dark:text-[#3FBF8A]">{r.to}</div>
              <div className="mt-1 text-xs text-muted-foreground">{r.d} <span className="opacity-60">(computed)</span></div>
              <div className="mt-3"><SourceChip paras={r.p} /></div>
            </div>))}
        </div>
      </section>

      {/* BENTO: pillars + map + targets */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold tracking-tight">Eight pillars, one production system</h2><Link href="/pillars" className="text-sm text-muted-foreground hover:text-foreground">Explore <ArrowUpRight className="inline h-3.5 w-3.5" /></Link></div>
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <li key={p.id}><Link href="/pillars" className="group block">
                <div className="flex items-baseline justify-between text-sm"><span className="truncate"><span className="mr-2 font-mono text-xs text-muted-foreground">{p.id}</span>{p.short}</span>
                  <span className="tabular-nums text-muted-foreground">{p.amountUSDm ? (p.amountUSDm >= 1000 ? `US$${p.amountUSDm / 1000}bn` : `US$${p.amountUSDm}m`) : "no amount stated"}</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full transition-all group-hover:opacity-80" style={{ width: `${p.amountUSDm ? (p.amountUSDm / 3000) * 100 : 0}%`, background: PILLAR_COLORS[p.id] }} /></div>
              </Link></li>))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">Bar length is relative to the largest stated pillar (Agriculture, US$3bn). {stated.length} of 8 pillars state an amount.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="text-lg font-semibold tracking-tight">Where projects are named</h2>
          <p className="mb-3 mt-1 text-sm text-muted-foreground">Commitments naming each of the 16 regions.</p>
          <MiniMap />
          <Link href="/map" className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">Open the regional map <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
      </section>

      {/* ASK + TARGETS */}
      <section className="grid gap-4 lg:grid-cols-5">
        <div className="relative overflow-hidden rounded-2xl bg-[#101C2C] p-6 text-[#F8F7F3] lg:col-span-3">
          <div className="animate-drift absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D5A62E]/25 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[#D5A62E]"><Sparkles className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.16em]">Ask the Budget</span></div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">What does this mean for you?</h2>
            <p className="mt-1 max-w-lg text-sm text-white/65">Ask in plain language. Answers use only passages from the speech and cite the paragraph and page.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["What does this budget mean for a poultry farmer in the Volta Region?", "What is the plan for rice self-sufficiency?", "Which projects are expected to be completed by 2030?", "What does the budget say about local pharmaceutical production?"].map((q) => (
                <AskChip key={q} q={q} className="rounded-full border border-white/20 px-3 py-1.5 text-left text-sm text-white/85 transition hover:border-[#D5A62E] hover:bg-white/10" />))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">2027 targets</h2>
          <ul className="mt-3 divide-y text-sm">{TARGETS.map(([k, v]) => <li key={k} className="flex items-center justify-between py-2"><span className="text-muted-foreground">{k}</span><span className="font-semibold tabular-nums">{v}</span></li>)}</ul>
          <div className="mt-3"><SourceChip paras={[457]} /></div>
        </div>
      </section>

      {/* WHAT MATTERS */}
      <section>
        <h2 className="mb-3 text-xl font-semibold tracking-tight">What matters most</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {MATTERS.map((m, i) => (
            <div key={m.t} className="group rounded-2xl border bg-card p-5 transition hover:border-[#D5A62E]">
              <div className="flex items-start gap-3"><span className="font-mono text-sm text-[#D5A62E]">0{i + 1}</span>
                <div><Link href={m.href} className="font-medium">{m.t} <ArrowUpRight className="inline h-3.5 w-3.5 opacity-50 group-hover:opacity-100" /></Link>
                  <p className="mt-1 text-sm text-muted-foreground">{m.d}</p><div className="mt-2"><SourceChip paras={m.p} /></div></div></div>
            </div>))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{COMMITMENTS.length} commitments extracted so far. Everything shown is announced or targeted; none is verified delivery.</p>
      </section>
    </div>
  );
}
