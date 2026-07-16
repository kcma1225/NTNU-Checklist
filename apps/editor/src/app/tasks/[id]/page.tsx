import { notFound } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { DeleteButton } from "@/components/delete-button";
import { getTask, listCategories, NotFoundError } from "@/lib/data-store";

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = listCategories();

  let task;
  try {
    task = getTask(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">編輯任務</h1>
        <DeleteButton resource="tasks" id={task.id} label={task.title} redirectTo="/tasks" />
      </div>
      <TaskForm task={task} categories={categories} />
    </div>
  );
}
