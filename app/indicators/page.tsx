import type { Metadata } from "next";
import { INDICATORS } from "@/data/indicators";
import { IndicatorChart } from "@/components/charts/IndicatorChart";
import { ChartCard } from "@/components/ChartCard";
import { DonutPillars } from "@/components/charts/DonutPillars";
import { DeliveryCalendar, DebtRings, FinancingStack, GrowthCompare, InflationBand, PrimaryBalance, ReservesGauge, SectorDonut, UnemploymentDonut } from "@/components/charts/IndicatorSuite";
import { deliveryByYear, pillarTotals, sectorCounts } from "@/lib/calc";

export const metadata: Metadata = { title: "Economic indicators" };

const H = ({ children }: { children: React.ReactNode }) => <h2 className="mb-3 mt-10 text-xl font-semibold tracking-tight first:mt-0">{children}</h2>;

export default function Page() {
  const t = pillarTotals();
  return (
    <div>
      <div className="mb-8"><h1 className="text-3xl font-semibold tracking-tight">Economic indicators</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Reported figures, 2027 targets, 2027–2030 targets and 2030 ambitions, kept visually distinct. Only values the speech states are plotted; gaps are not estimated. * End-2024 values are implied by ¶42’s “from … to …” wording.</p></div>

      <H>The recovery, 2022 to now</H>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard kicker="Area + target band" title="Inflation" how="From 54.1% at end-2022 to single digits. The dashed gold path runs to the 2027 target band of 8% ± 2." paras={[33, 42, 402, 457]}><InflationBand /></ChartCard>
        <ChartCard kicker="Bars + trend" title="Primary balance (% of GDP)" how="Deficit to surplus. The 2027 floor of 0.5% is deliberately below 2025’s 2.5% to make room for the programme." paras={[33, 42, 109, 457]}><PrimaryBalance /></ChartCard>
      </div>

      <H>Growth and jobs</H>
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <ChartCard kicker="Grouped bars + reference line" title="GDP growth: reported vs targets" how="H1-2026 growth beat the 2026 targets. The 2027 and 2027–30 figures are floors (“at least”)." paras={[398, 399, 457, 458, 84]}><GrowthCompare /></ChartCard>
        <ChartCard kicker="Donut" title="Unemployment: the gap to 2030" how="About 12.8% in 2025 against an ambition of below 8% by 2030. No path between them is stated." paras={[27, 84]} note="The 4.8 pp gap is computed (12.8 − 8), not stated."><UnemploymentDonut /></ChartCard>
      </div>

      <H>Buffers</H>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard kicker="Concentric rings" title="Public debt (% of GDP)" how="2022 is stated as “over 100%” (plotted at the floor). 2025 stands at 44.7%; the speech keeps debt “consistent with” 45%." paras={[33, 42, 83]}><DebtRings /></ChartCard>
        <ChartCard kicker="Gauge" title="Gross international reserves" how="Months of import cover against the 2027 floor of six months. End-2022 was under three weeks, which has no clean month value." paras={[33, 42, 400, 457]}><ReservesGauge /></ChartCard>
      </div>

      <H>The programme</H>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard kicker="Donut" title="Stated investment by pillar" how="Seven of the eight pillars state an amount; Pillar 1 does not." paras={[66, 118, 200, 253, 273, 294, 314, 328]} note={`The pillar amounts sum to US$${t.sumUSDm / 1000}bn${t.matchesHeadline ? ", matching the headline" : ""}. That sum is computed, not stated.`}><DonutPillars data={t.shares} /></ChartCard>
        <div className="grid gap-4">
          <ChartCard kicker="Stacked bar" title="How the programme is financed" how="Two fiscal measures over 2027–2030. Their sum is 1.5 pp of GDP (computed); the speech states the 2027 investment separately as 1.5% of GDP (GH¢30bn, ¶111)." paras={[109, 110, 111]}><FinancingStack /></ChartCard>
          <ChartCard kicker="Donut" title="Extracted commitments by sector" how="Count of commitments extracted from the speech, not an indicator of money." note="Computed from data/commitments.ts."><SectorDonut data={sectorCounts()} /></ChartCard>
        </div>
      </div>

      <H>Delivery calendar</H>
      <ChartCard kicker="Bars + cumulative line" title="When the speech says things start and finish" how="Each commitment is counted once per year it cites in its start or target text. Many items carry no date, so this is a floor on activity, not a forecast." note="Computed from the start and target fields of the extracted commitments; check the Tracker for the underlying paragraphs."><DeliveryCalendar data={deliveryByYear()} /></ChartCard>

      <H>Detail by indicator</H>
      <div className="grid gap-4 lg:grid-cols-2">
        {INDICATORS.map((i) => (
          <section key={i.id} className="rounded-2xl border bg-card p-5"><h3 className="font-medium">{i.name}</h3><div className="mt-2"><IndicatorChart ind={i} /></div>
            <p className="mt-3 text-sm text-muted-foreground">{i.insight}</p></section>))}
      </div>
    </div>
  );
}
