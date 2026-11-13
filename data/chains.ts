/** Value chains and employment figures exactly as the speech sequences them. Each step cites its paragraph(s). */
export interface ChainStep { text: string; paras: number[] }
export interface Chain { title: string; steps: ChainStep[] }

export const CHAINS: Record<number, Chain[]> = {
  1: [{ title: "Stability to ambition", steps: [
    { text: "Primary surplus of at least 0.5% of GDP from 2027", paras: [83] },
    { text: "Annual Investment-Grade Readiness Report", paras: [87] },
    { text: "2030 ambitions: growth of about 8%, unemployment below 8%", paras: [84] }] }],
  2: [
    { title: "Rice", steps: [
      { text: "Rice Development Hubs: irrigation, mechanisation, silos, mills, packaging, logistics", paras: [136, 137] },
      { text: "Import licences tied to purchases from Ghanaian farmers and millers (2027)", paras: [146] },
      { text: "Commercial rice imports prohibited (2030)", paras: [148] }] },
    { title: "Poultry", steps: [
      { text: "Breeders, hatcheries, feed, vaccines and poultry houses", paras: [156, 157, 158] },
      { text: "Maize and soyabean clusters tied to feed mills by bankable contracts", paras: [160, 161] },
      { text: "Ghana EXIM Bank finances commercial poultry and feed; at least 40% of levy revenue", paras: [490, 491, 492, 493] }] },
    { title: "Oil palm", steps: [
      { text: "100,000 hectares of suitable land identified", paras: [178] },
      { text: "US$500 million patient-finance window", paras: [176] },
      { text: "Self-sufficiency and export scale by 2032; potential for 250,000+ jobs", paras: [177] }] },
    { title: "Cocoa", steps: [
      { text: "At least 50% processed locally by 2028", paras: [192] },
      { text: "100% processed locally by 2030, ending raw cocoa exports", paras: [192] }] }],
  3: [
    { title: "Thermal power", steps: [
      { text: "Construction starts December 2026 at Kafodzidzi-Abrobeano", paras: [204] },
      { text: "First 600 MW by December 2028", paras: [206] },
      { text: "Remaining 850 MW by December 2030", paras: [206] }] },
    { title: "Nuclear readiness", steps: [
      { text: "24-month programme from January 2027", paras: [237] },
      { text: "EPC and financing contract by December 2028 (readiness, not generation)", paras: [238, 239] }] }],
  4: [
    { title: "Gold", steps: [{ text: "100% refined locally and raw artisanal gold exports prohibited by December 2028", paras: [256] }] },
    { title: "Manganese and bauxite", steps: [
      { text: "At least 50% processed locally by end-2028", paras: [257] },
      { text: "All processed locally by end-2030; raw exports prohibited", paras: [258] }] },
    { title: "Enclave and rail", steps: [
      { text: "Processing enclave in the Western Region, powered by Pillar 3", paras: [261, 262] },
      { text: "Western Corridor Railway, funded from petroleum revenue and royalties", paras: [263, 516, 519] }] }],
  5: [{ title: "Visitor economy", steps: [
    { text: "Black Star Experience programme", paras: [275] },
    { text: "Convention centre at La Trade Fair; convention bureau in 2027", paras: [281, 284] },
    { text: "SSNIT hotels in Accra, Kumasi, Cape Coast–Elmina, Volta and Northern Ghana by 2030", paras: [285] }] }],
  6: [{ title: "Textiles", steps: [
    { text: "Enclave infrastructure and priority facility upgrades begin in 2027", paras: [307] },
    { text: "New and upgraded lines onstream in 2028", paras: [308] },
    { text: "Public bodies buy uniforms and textiles only from Ghanaian manufacturers", paras: [305] }] }],
  7: [{ title: "Medicines", steps: [
    { text: "State-owned SPV builds hubs; construction begins 2027", paras: [315, 324] },
    { text: "Procurement law amended: public funds buy only Ghana-made medicines where available in sufficient quantity and of approved quality", paras: [317] },
    { text: "60–80% of essential medicines made locally by 2030", paras: [325] }] }],
  8: [{ title: "Technology", steps: [
    { text: "National AI Centre and rural 2G-to-4G upgrade, 2027–2028", paras: [328] },
    { text: "Rural connectivity lets talent in every region take part", paras: [68] }] }],
};

/** Employment the speech states. These are projections or potentials and are not additive. */
export const JOBS: { pillar: number; label: string; value: string; para: number }[] = [
  { pillar: 2, label: "Rice Development Hubs", value: "about 125,000 jobs", para: 137 },
  { pillar: 2, label: "Oil palm programme (potential)", value: "more than 250,000 jobs", para: 177 },
  { pillar: 7, label: "Pharmaceuticals (direct and indirect, projected)", value: "approximately 20,000 jobs", para: 326 },
  { pillar: 1, label: "National unemployment ambition (2030)", value: "below 8%", para: 84 },
];
