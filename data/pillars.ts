import type { Pillar } from "./types";

// Source: ¶66–68 (structure), pillar chapters ¶80–338. Amounts are as stated; the sum is computed in lib/calc.ts.
export const PILLARS: Pillar[] = [
  { id: 1, name: "Macroeconomic Stability & Affordable Finance", short: "Stability & Finance", amountUSDm: null, amountPara: 81,
    summary: "Institutionalise stability and make credit cheaper and longer-term. No separate investment amount is stated for this pillar.",
    headlineTargets: [
      { text: "Primary balance of at least 0.5% of GDP from 2027", para: 83 },
      { text: "Real GDP growth of about 8% by 2030", para: 84 },
      { text: "Unemployment below 8% by 2030", para: 84 },
      { text: "Cost of capital into single digits (ambition)", para: 96 }], role: "Affordable finance must reach farmers, manufacturers and exporters.", rolePara: 68 },
  { id: 2, name: "Commercial Agriculture", short: "Agriculture", amountUSDm: 3000, amountPara: 118,
    summary: "Eight integrated industries: rice, sugar, poultry, maize & soya feed, aquaculture, oil palm, vegetables and cocoa value addition.",
    headlineTargets: [
      { text: "Commercial rice imports prohibited by 2030", para: 148 },
      { text: "Sugar self-sufficiency by 2030", para: 152 },
      { text: "Process 50% of cocoa locally by 2028 and 100% by 2030", para: 192 },
      { text: "Rice hubs: +100,000 ha, 5–6 t/ha, ~125,000 jobs", para: 137 }], role: "Supplies food and industrial raw materials.", rolePara: 68 },
  { id: 3, name: "Energy Infrastructure", short: "Energy", amountUSDm: 2200, amountPara: 200,
    summary: "Thermal, solar and storage capacity, grid modernisation and a nuclear-readiness programme.",
    headlineTargets: [
      { text: "1,450 MW thermal plant: 600 MW by Dec 2028, 850 MW by Dec 2030", para: 206 },
      { text: "600 MW solar with 2,000 MWh battery storage", para: 208 },
      { text: "Phase out emergency power plants by 2030", para: 218 }], role: "Reliable energy supports a 24-hour economy.", rolePara: 68 },
  { id: 4, name: "Critical Minerals Value Addition", short: "Critical Minerals", amountUSDm: 1500, amountPara: 253,
    summary: "Industrial mineral economy around manganese, bauxite, lithium and gold, with a Western Region processing enclave and rail.",
    headlineTargets: [
      { text: "100% local gold refining by Dec 2028", para: 256 },
      { text: "All manganese and bauxite processed locally by end-2030", para: 258 }], role: "Minerals and cocoa must gain value in Ghana before export.", rolePara: 68 },
  { id: 5, name: "Tourism, Culture & Creative Arts", short: "Tourism & Creative", amountUSDm: 1000, amountPara: 273,
    summary: "A year-round visitor economy: Black Star Experience, heritage sites, conventions and medical tourism.",
    headlineTargets: [{ text: "Higher arrivals, longer stays and more visitor spending by 2030 (no numeric target in ¶291)", para: 291 }], role: "Turns heritage and creativity into businesses, jobs and foreign exchange.", rolePara: 68 },
  { id: 6, name: "Textiles & Garments", short: "Textiles", amountUSDm: 1000, amountPara: 294,
    summary: "Modernised mills, garment enclaves with shared facilities and Ghanaian-only public procurement of uniforms and textiles.",
    headlineTargets: [
      { text: "Enclave infrastructure and priority facility upgrades begin in 2027", para: 307 },
      { text: "New and upgraded lines onstream in 2028", para: 308 }], role: "Expands local manufacturing, creates jobs and links Ghanaian skills to global fashion markets.", rolePara: 68 },
  { id: 7, name: "Pharmaceuticals & Biomanufacturing", short: "Pharma", amountUSDm: 1000, amountPara: 314,
    summary: "Hubs in the Eastern and Central Regions and a Ghana-first public medicine procurement rule.",
    headlineTargets: [
      { text: "Manufacture 60–80% of essential medicines locally by 2030", para: 325 },
      { text: "~20,000 direct and indirect jobs projected", para: 326 }], role: "Produces more medicines and vaccines in Ghana, strengthens health security and supplies markets across Africa.", rolePara: 68 },
  { id: 8, name: "Technology Economy", short: "Technology", amountUSDm: 300, amountPara: 328,
    summary: "A National AI Centre and rural 2G-to-4G upgrades, 2027–2028.",
    headlineTargets: [{ text: "US$300 million over 2027–2028", para: 328 }], role: "Widens sources of jobs and foreign exchange; rural connectivity lets talent in every region take part.", rolePara: 68 },
];

export const PROGRAMME = {
  totalUSDbn: 10, totalPara: 66, period: "2027–2030",
  y2027: { ghsBn: 30, pctGDP: 1.5, para: 111 },
  financing: [
    { text: "Lower the primary-surplus target by 1 percentage point of GDP over the period", para: 109 },
    { text: "Approved tax reforms and compliance measures expected to yield 0.5% of GDP", para: 110 }],
};
