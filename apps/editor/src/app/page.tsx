import Link from "next/link";
import { ListTodo, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listTasks, listLinks } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const tasks = listTasks();
  const links = listLinks();
  const tbdCount = tasks.filter((t) => t.startDate === null).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">內容編輯器</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          編輯 data/tasks.json 與 data/links.json，儲存後重新執行公開網站的
          build 即可看到更新。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/tasks">
          <Card className="transition-colors hover:bg-accent">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <ListTodo className="size-5 text-primary" />
              <CardTitle>任務</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              共 {tasks.length} 筆，其中 {tbdCount} 筆日期待公告
            </CardContent>
          </Card>
        </Link>

        <Link href="/links">
          <Card className="transition-colors hover:bg-accent">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <Link2 className="size-5 text-primary" />
              <CardTitle>常用連結</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">共 {links.length} 筆</CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
