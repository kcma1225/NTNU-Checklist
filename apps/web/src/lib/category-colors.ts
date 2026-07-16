import type { Category } from "@ntnu-guide/shared";

type ColorToken = Category["colorToken"];

const BADGE: Record<ColorToken, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900",
  green:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
  amber:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
  purple:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-900",
  rose: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
  teal: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900",
  slate:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
};

const DOT: Record<ColorToken, string> = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  purple: "bg-violet-500",
  rose: "bg-rose-500",
  teal: "bg-teal-500",
  slate: "bg-slate-400",
};

export function getCategoryBadgeClass(token: ColorToken): string {
  return BADGE[token] ?? BADGE.slate;
}

export function getCategoryDotClass(token: ColorToken): string {
  return DOT[token] ?? DOT.slate;
}
