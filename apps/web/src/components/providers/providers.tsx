"use client";

import type { Category, GuideSection, Link, Task } from "@ntnu-guide/shared";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppDataProvider } from "@/components/providers/app-data-context";
import { CompletedTasksProvider } from "@/components/providers/completed-tasks-context";

interface Data {
  tasks: Task[];
  links: Link[];
  guide: GuideSection[];
  categories: Category[];
}

export function Providers({ data, children }: { data: Data; children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider delayDuration={200}>
        <AppDataProvider data={data}>
          <CompletedTasksProvider>{children}</CompletedTasksProvider>
        </AppDataProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
