import Link from "next/link";
import { Plus } from "lucide-react";
import { getTaskStatus, getDaysRemaining } from "@ntnu-guide/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listTasks, listCategories } from "@/lib/data-store";
import { DeleteButton } from "@/components/delete-button";

export const dynamic = "force-dynamic";

export default function TasksPage() {
  const tasks = listTasks();
  const categories = listCategories();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">任務</h1>
          <p className="text-sm text-muted-foreground">共 {tasks.length} 筆，直接寫入 data/tasks.json</p>
        </div>
        <Button asChild>
          <Link href="/tasks/new">
            <Plus />
            新增任務
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>任務名稱</TableHead>
              <TableHead>類別</TableHead>
              <TableHead>日期</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const category = categories.find((c) => c.id === task.category);
              const status = getTaskStatus(task, new Set());
              const days = getDaysRemaining(task);
              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{category?.label ?? task.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {task.startDate ? task.startDate.slice(0, 16).replace("T", " ") : "待公告"}
                    {days !== null && <span className="ml-1">({days}天)</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{status}</Badge>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/tasks/${task.id}`}>編輯</Link>
                    </Button>
                    <DeleteButton resource="tasks" id={task.id} label={task.title} redirectTo="/tasks" />
                  </TableCell>
                </TableRow>
              );
            })}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  尚無任務
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
