export type Currency = "USD" | "GHS";
export type Money = { value: number; unit: "million" | "billion"; currency: Currency };
export type Status = "Announced" | "Planned" | "In preparation" | "In progress" | "Completed" | "Delayed" | "Unverified";
export type Sector = "Macro & Finance" | "Agriculture" | "Energy" | "Critical Minerals" | "Tourism & Creative Arts" | "Textiles & Garments" | "Pharmaceuticals" | "Technology" | "Infrastructure" | "Social & Sports";
export type RegionId =
  | "upper-west" | "upper-east" | "north-east" | "savannah" | "northern" | "bono" | "bono-east" | "oti"
  | "western-north" | "ahafo" | "ashanti" | "eastern" | "volta" | "western" | "central" | "greater-accra";

export interface Commitment {
  id: string;
  title: string;
  description: string;
  sector: Sector;
  pillar?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  amount?: Money;
  /** What the amount covers, because several amounts are nested or overlap — never sum across rows. */
  amountScope?: string;
  start?: string;
  target?: string;
  outcome?: string;
  institution?: string;
  regions: RegionId[];
  /** "stated" = region named in the speech; "inferred" = speech names a corridor/zone, region mapped by us. */
  locationBasis: "stated" | "inferred" | "national";
  status: Status;
  /** Speech paragraph numbers. Page is resolved from paragraphs.json. */
  paras: number[];
}

export interface Pillar {
  id: number; name: string; short: string;
  /** US$ million, only where the speech states it. Pillar 1 has none. */
  amountUSDm: number | null; amountPara: number;
  summary: string;
  headlineTargets: { text: string; para: number }[];
  feeds: number[]; // pillars it supplies (economic linkage, ¶68)
}

export type PointKind = "reported" | "target" | "ambition";
export interface IndicatorPoint { label: string; value: number | null; kind: PointKind; note?: string; para: number; display?: string }
export interface Indicator { id: string; name: string; unit: string; lowerIsBetter?: boolean; points: IndicatorPoint[]; insight: string }

export interface ProgressUpdate {
  commitmentId: string; date: string; status: Status; summary: string;
  evidenceUrl: string; verifiedBy: string; verification: "independent" | "official-report";
}
