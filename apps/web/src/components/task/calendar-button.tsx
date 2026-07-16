"use client";

import { CalendarPlus } from "lucide-react";
import { buildGoogleCalendarUrl, type Task } from "@ntnu-guide/shared";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CalendarButton({
  task,
  variant = "outline",
  size = "sm",
}: {
  task: Task;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default";
}) {
  const url = buildGoogleCalendarUrl(task);

  const button = (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={!url}
      onClick={() => {
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      }}
    >
      <CalendarPlus />
      加入行事曆
    </Button>
  );

  if (url) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>{button}</span>
      </TooltipTrigger>
      <TooltipContent>日期尚未公告，暫無法加入行事曆</TooltipContent>
    </Tooltip>
  );
}
