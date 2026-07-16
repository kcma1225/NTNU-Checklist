import { TaskForm } from "@/components/task-form";
import { listCategories } from "@/lib/data-store";

export default function NewTaskPage() {
  const categories = listCategories();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">新增任務</h1>
      <TaskForm categories={categories} />
    </div>
  );
}
