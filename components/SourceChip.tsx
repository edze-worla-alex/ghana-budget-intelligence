import { citeText, getPara, pdfHref } from "@/lib/source";

/** Links straight to the PDF page; hovering shows the paragraph text so claims are checkable in one step. */
export function SourceChip({ paras }: { paras: number[] }) {
  return (
    <span className="inline-flex flex-wrap gap-1 align-middle">
      {paras.map((n) => (
        <a key={n} href={pdfHref(n)} target="_blank" rel="noreferrer" title={getPara(n)?.text ?? "Paragraph not found"}
          className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground hover:border-[#D5A62E] hover:text-foreground">
          {citeText([n])}
        </a>
      ))}
    </span>
  );
}
