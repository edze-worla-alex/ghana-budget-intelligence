"use client";
import { useEffect, useState } from "react";

/** Counts up once on mount. Renders the final value on the server and with reduced motion. */
export function CountUp({ to, decimals = 0, prefix = "", suffix = "", duration = 1400 }: { to: number; decimals?: number; prefix?: string; suffix?: string; duration?: number }) {
  const [v, setV] = useState(to);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0; const t0 = performance.now(); setV(0);
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration); setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span className="tabular-nums">{prefix}{v.toFixed(decimals)}{suffix}</span>;
}
