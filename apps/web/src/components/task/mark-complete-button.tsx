"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompletedTasks } from "@/components/providers/completed-tasks-context";
import { cn } from "@/lib/utils";

export function MarkCompleteButton({
  taskId,
  size = "sm",
}: {
  taskId: string;
  size?: "sm" | "default";
}) {
  const { isComplete, toggleComplete, mounted } = useCompletedTasks();
  const done = mounted && isComplete(taskId);

  return (
    <Button
      type="button"
      variant={done ? "default" : "outline"}
      size={size}
      className={cn(done && "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600")}
      onClick={() => toggleComplete(taskId)}
    >
      <Check />
      {done ? "已完成" : "標記完成"}
    </Button>
  );
}
