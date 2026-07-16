"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Task } from "@ntnu-guide/shared";
import type { Category } from "@ntnu-guide/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  taskFormSchema,
  taskToFormValues,
  formValuesToTaskPayload,
  type TaskFormValues,
} from "@/lib/task-form-schema";

export function TaskForm({
  task,
  categories,
}: {
  task?: Task;
  categories: Category[];
}) {
  const router = useRouter();
  const isEdit = Boolean(task);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: taskToFormValues(task),
  });

  const tbd = watch("tbd");

  async function onSubmit(values: TaskFormValues) {
    setSubmitting(true);
    try {
      const payload = formValuesToTaskPayload(values);
      const res = await fetch(isEdit ? `/api/tasks/${task!.id}` : "/api/tasks", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `儲存失敗（${res.status}）`);
      }
      toast.success(isEdit ? "已更新任務" : "已建立任務");
      router.push("/tasks");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "儲存失敗");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="id">任務 ID</Label>
          <Input id="id" placeholder="health-check" {...register("id")} disabled={isEdit} />
          {errors.id && <p className="text-xs text-destructive">{errors.id.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">類別</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="選擇類別" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">任務名稱</Label>
        <Input id="title" placeholder="碩士班新生健康檢查" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">簡短說明（顯示於卡片）</Label>
        <Textarea id="summary" rows={2} {...register("summary")} />
        {errors.summary && <p className="text-xs text-destructive">{errors.summary.message}</p>}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="tbd"
            render={({ field }) => (
              <Checkbox id="tbd" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="tbd" className="font-normal">
            日期尚未公布（顯示為「待公告」，不可加入行事曆）
          </Label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="startDate">開始時間（台灣時間）</Label>
            <Input
              id="startDate"
              type="datetime-local"
              disabled={tbd}
              {...register("startDate")}
            />
            {errors.startDate && (
              <p className="text-xs text-destructive">{errors.startDate.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="endDate">結束時間（可留空，預設 +1 小時）</Label>
            <Input id="endDate" type="datetime-local" disabled={tbd} {...register("endDate")} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="location">地點</Label>
        <Input id="location" placeholder="師大校本部體育館" {...register("location")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="department">負責單位</Label>
        <Input id="department" placeholder="教務處" {...register("department")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">詳細說明</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        <p className="text-xs text-muted-foreground">
          支援簡易 Markdown：## 標題（最多到 ####）、[連結文字](https://…)、**粗體**
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="checklist">準備資料（每行一項，同樣支援 Markdown 連結）</Label>
        <Textarea
          id="checklist"
          rows={4}
          placeholder={"身分證正反面影本\n[健康檢查表下載](https://acad.ntnu.edu.tw/forms/health-check.pdf)"}
          {...register("checklist")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="officialUrl">官方網站連結</Label>
          <Input id="officialUrl" placeholder="https://…" {...register("officialUrl")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mapUrl">地圖連結</Label>
          <Input id="mapUrl" placeholder="https://…" {...register("mapUrl")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="documentUrl">文件下載連結</Label>
          <Input id="documentUrl" placeholder="https://…" {...register("documentUrl")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="academicYear">學年度</Label>
          <Input id="academicYear" placeholder="115" {...register("academicYear")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="semester">學期</Label>
          <Controller
            control={control}
            name="semester"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="semester" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未指定</SelectItem>
                  <SelectItem value="1">上學期</SelectItem>
                  <SelectItem value="2">下學期</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <Controller
            control={control}
            name="calendarEnabled"
            render={({ field }) => (
              <Checkbox
                id="calendarEnabled"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="calendarEnabled" className="font-normal">
            允許加入 Google 行事曆
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "儲存中…" : isEdit ? "儲存變更" : "建立任務"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/tasks")}>
          取消
        </Button>
      </div>
    </form>
  );
}
