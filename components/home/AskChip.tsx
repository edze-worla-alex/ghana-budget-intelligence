"use client";
/** Opens the floating assistant and sends it a question. */
export function AskChip({ q, className = "" }: { q: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent("ask-budget", { detail: { q } }))}>{q}</button>
  );
}
