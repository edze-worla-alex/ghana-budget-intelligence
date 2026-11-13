import type { Money } from "@/data/types";
export const fmtMoney = (m?: Money) =>
  m ? `${m.currency === "USD" ? "US$" : "GH¢"}${m.value.toLocaleString("en-GB")} ${m.unit}` : "Not stated";
export const toUSDm = (m?: Money) => (m && m.currency === "USD" ? m.value * (m.unit === "billion" ? 1000 : 1) : undefined);
