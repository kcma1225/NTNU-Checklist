"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LinkIconSchema, type Link } from "@ntnu-guide/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const linkFormSchema = z.object({
  id: z.string().min(1, "必填").regex(/^[a-z0-9-]+$/, "只能使用小寫英文、數字與連字號"),
  label: z.string().min(1, "必填"),
  description: z.string().optional(),
  url: z.string().url("請輸入完整網址（含 https://）"),
  icon: LinkIconSchema,
});

type LinkFormValues = z.infer<typeof linkFormSchema>;

export function LinkForm({ link }: { link?: Link }) {
  const router = useRouter();
  const isEdit = Boolean(link);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: link
      ? { id: link.id, label: link.label, description: link.description ?? "", url: link.url, icon: link.icon }
      : { id: "", label: "", description: "", url: "", icon: "link" },
  });

  async function onSubmit(values: LinkFormValues) {
    setSubmitting(true);
    try {
      const res = await fetch(isEdit ? `/api/links/${link!.id}` : "/api/links", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `儲存失敗（${res.status}）`);
      }
      toast.success(isEdit ? "已更新連結" : "已建立連結");
      router.push("/links");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "儲存失敗");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="id">連結 ID</Label>
        <Input id="id" placeholder="library" {...register("id")} disabled={isEdit} />
        {errors.id && <p className="text-xs text-destructive">{errors.id.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="label">名稱</Label>
        <Input id="label" placeholder="圖書館" {...register("label")} />
        {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">說明</Label>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="url">網址</Label>
        <Input id="url" placeholder="https://www.lib.ntnu.edu.tw" {...register("url")} />
        {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="icon">圖示</Label>
        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="icon" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LinkIconSchema.options.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    {icon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "儲存中…" : isEdit ? "儲存變更" : "建立連結"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/links")}>
          取消
        </Button>
      </div>
    </form>
  );
}
