import { SourceChip } from "@/components/SourceChip";

export function ChartCard({ title, kicker, how, paras, note, className = "", children }: {
  title: string; kicker?: string; how: string; paras?: number[]; note?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <section className={`flex flex-col rounded-2xl border bg-card p-5 ${className}`}>
      {kicker && <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#087A4B] dark:text-[#D5A62E]">{kicker}</div>}
      <h2 className="mt-0.5 text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{how}</p>
      <div className="mt-4 flex-1">{children}</div>
      {(note || paras) && <div className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">{note && <p>{note}</p>}{paras && <SourceChip paras={paras} />}</div>}
    </section>
  );
}
