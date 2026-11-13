import raw from "@/data/budget/paragraphs.json";

export interface Para { n: number; page: number; text: string }
const PARAS = raw as Para[];
const BY_N = new Map(PARAS.map((p) => [p.n, p]));

export const allParas = () => PARAS;
export const getPara = (n: number) => BY_N.get(n);
export const pageOf = (n: number) => BY_N.get(n)?.page;
export const pdfHref = (n: number) => `/budget-speech.pdf#page=${pageOf(n) ?? 1}`;
export const SOURCE = { title: "2027 Budget Speech (Ghana)", delivered: "12 November 2026", file: "/budget-speech.pdf" } as const;
/** "¶136, ¶137 · p.23–24" */
export function citeText(paras: number[]) {
  const pages = [...new Set(paras.map(pageOf).filter(Boolean))] as number[];
  const pg = pages.length ? (pages.length > 1 ? `p.${Math.min(...pages)}–${Math.max(...pages)}` : `p.${pages[0]}`) : "";
  return `${paras.map((n) => `¶${n}`).join(", ")}${pg ? " · " + pg : ""}`;
}
