"use client";

import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PublishButton() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [publishing, setPublishing] = useState(false);

  async function refreshStatus() {
    try {
      const res = await fetch("/api/publish");
      if (!res.ok) return;
      const body = await res.json();
      setPending(body.changed ?? []);
    } catch {
      // Best-effort status badge — a failed poll just leaves the last known count.
    }
  }

  useEffect(() => {
    // Initial fetch of pending-changes count on mount, not state synced from a system
    // that changes over time by itself — same pattern as the app-wide hydration guards.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshStatus();
    const onFocus = () => refreshStatus();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  async function onPublish() {
    setPublishing(true);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `發布失敗（${res.status}）`);
      toast.success(`已發布（commit ${body.commit}）`);
      setMessage("");
      setOpen(false);
      await refreshStatus();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "發布失敗");
    } finally {
      setPublishing(false);
    }
  }

  function onOpenChange(next: boolean) {
    if (next) refreshStatus();
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <UploadCloud className="size-4" />
          發布
          {pending.length > 0 && <Badge variant="secondary">{pending.length}</Badge>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>發布變更到 GitHub</DialogTitle>
        </DialogHeader>

        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">目前沒有待發布的變更。</p>
        ) : (
          <>
            <div className="rounded-md border bg-muted/50 p-3 text-xs font-mono">
              {pending.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="publish-message" className="text-sm font-medium">
                Commit 訊息（選填）
              </label>
              <Textarea
                id="publish-message"
                rows={2}
                placeholder="Update task data"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={onPublish} disabled={publishing || pending.length === 0}>
            {publishing ? "發布中…" : "發布"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
