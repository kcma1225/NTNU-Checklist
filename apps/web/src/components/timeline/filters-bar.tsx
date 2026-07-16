"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutList, ListFilter, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppData } from "@/components/providers/app-data-context";
import { getCategoryBadgeClass } from "@/lib/category-colors";
import { STATUS_LABEL } from "@/lib/status-colors";
import { getUniqueAcademicYears, type TimelineFilters } from "@/lib/timeline-filters";
import { withParams } from "@/lib/url-params";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@ntnu-guide/shared";

const STATUS_OPTIONS: TaskStatus[] = ["overdue", "urgent", "upcoming", "tbd", "completed"];

export function FiltersBar({
  filters,
  view,
}: {
  filters: TimelineFilters;
  view: "timeline" | "list";
}) {
  const { tasks, categories } = useAppData();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const years = getUniqueAcademicYears(tasks);

  function go(updates: Record<string, string | string[] | null>) {
    router.replace(withParams(pathname, searchParams, updates), { scroll: false });
  }

  function toggleCategory(id: string) {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    go({ category: next.length > 0 ? next : null });
  }

  const hasActiveFilters =
    filters.q || filters.categories.length > 0 || filters.academicYear || filters.semester || filters.status;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.q}
            onChange={(e) => go({ q: e.target.value || null })}
            placeholder="搜尋任務名稱、地點或說明…"
            className="pl-8"
            aria-label="搜尋任務"
          />
        </div>

        <Select
          value={filters.academicYear ?? "all"}
          onValueChange={(v) => go({ year: v === "all" ? null : v })}
        >
          <SelectTrigger className="sm:w-32">
            <SelectValue placeholder="學年" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部學年</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y} 學年度
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.semester ? String(filters.semester) : "all"}
          onValueChange={(v) => go({ semester: v === "all" ? null : v })}
        >
          <SelectTrigger className="sm:w-28">
            <SelectValue placeholder="學期" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部學期</SelectItem>
            <SelectItem value="1">上學期</SelectItem>
            <SelectItem value="2">下學期</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? "all"}
          onValueChange={(v) => go({ status: v === "all" ? null : v })}
        >
          <SelectTrigger className="sm:w-32">
            <ListFilter className="size-3.5" />
            <SelectValue placeholder="狀態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部狀態</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && go({ view: v === "timeline" ? null : v })}
          className="shrink-0"
        >
          <ToggleGroupItem value="timeline" aria-label="時間軸檢視">
            <ListFilter className="size-4" />
            Timeline
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="列表檢視">
            <LayoutList className="size-4" />
            List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category) => {
          const active = filters.categories.includes(category.id);
          return (
            <button key={category.id} type="button" onClick={() => toggleCategory(category.id)}>
              <Badge
                variant="outline"
                className={cn(
                  getCategoryBadgeClass(category.colorToken),
                  "cursor-pointer transition-opacity",
                  !active && "opacity-50 hover:opacity-100",
                )}
              >
                {category.label}
              </Badge>
            </button>
          );
        })}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground"
            onClick={() => router.replace(pathname, { scroll: false })}
          >
            <X className="size-3" />
            清除篩選
          </Button>
        )}
      </div>
    </div>
  );
}
