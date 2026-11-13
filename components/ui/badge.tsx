import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline";
const styles: Record<Variant, string> = { default: "bg-primary text-primary-foreground", secondary: "bg-muted text-foreground", outline: "border text-foreground" };
export function Badge({ className, variant = "default", ...p }: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", styles[variant], className)} {...p} />;
}
