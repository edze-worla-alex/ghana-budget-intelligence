import { allParas, type Para } from "@/lib/source";

const STOP = new Set("a an and are as at be by for from how in is it of on or that the this to what will with does do my me i can about mean means budget government ghana".split(" "));
// Light query expansion so everyday words reach the speech's own vocabulary.
const EXPAND: Record<string, string[]> = {
  farmer: ["agriculture", "farmers", "outgrowers", "smallholders"], farmers: ["agriculture", "outgrowers"],
  poultry: ["chicken", "feed", "maize", "soyabean", "hatcheries"], chicken: ["poultry"],
  job: ["jobs", "employment"], jobs: ["employment"], student: ["students", "skills", "training", "education"],
  sme: ["smes", "enterprise", "finance"], business: ["enterprise", "finance", "credit"],
  power: ["energy", "electricity"], electricity: ["energy", "power"], medicine: ["pharmaceutical", "medicines"],
  fish: ["aquaculture", "fisheries"], rice: ["rice", "hubs", "imports"],
};
const tok = (s: string) => s.toLowerCase().replace(/[^a-z0-9¢$.% ]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));
const stem = (w: string) => w.replace(/(ing|ed|es|s)$/, "");

interface Idx { docs: { p: Para; tf: Map<string, number>; len: number }[]; df: Map<string, number>; avg: number }
let idx: Idx | null = null;
function build(): Idx {
  const docs = allParas().map((p) => {
    const tf = new Map<string, number>();
    for (const t of tok(p.text).map(stem)) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { p, tf, len: [...tf.values()].reduce((a, b) => a + b, 0) };
  });
  const df = new Map<string, number>();
  docs.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) ?? 0) + 1)));
  return { docs, df, avg: docs.reduce((s, d) => s + d.len, 0) / docs.length };
}

/** BM25 over paragraphs. Neighbouring paragraphs are pulled in because the speech splits lists across ¶. */
export function retrieve(query: string, k = 8): Para[] {
  idx ??= build();
  const base = tok(query);
  const terms = [...new Set([...base, ...base.flatMap((t) => EXPAND[t] ?? [])].map(stem))];
  const N = idx.docs.length, k1 = 1.4, b = 0.75;
  const scored = idx.docs.map((d) => {
    let s = 0;
    for (const t of terms) {
      const f = d.tf.get(t); if (!f) continue;
      const n = idx!.df.get(t) ?? 0;
      s += Math.log(1 + (N - n + 0.5) / (n + 0.5)) * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / idx!.avg)));
    }
    return { p: d.p, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, k);
  return scored.map((x) => x.p).sort((a, b) => a.n - b.n);
}
