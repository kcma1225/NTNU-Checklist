"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteButton({
  resource,
  id,
  label,
  redirectTo,
}: {
  resource: "tasks" | "links";
  id: string;
  label: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function onConfirm() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/${resource}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`刪除失敗（${res.status}）`);
      toast.success("已刪除");
      setOpen(false);
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "刪除失敗");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" size="sm">
          <Trash2 />
          刪除
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確定要刪除「{label}」嗎？</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">此操作會直接寫入 data/ 目錄，且無法復原。</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={deleting}>
            {deleting ? "刪除中…" : "確定刪除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
