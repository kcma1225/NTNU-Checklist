import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listLinks } from "@/lib/data-store";
import { DeleteButton } from "@/components/delete-button";

export const dynamic = "force-dynamic";

export default function LinksPage() {
  const links = listLinks();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">常用連結</h1>
          <p className="text-sm text-muted-foreground">共 {links.length} 筆，直接寫入 data/links.json</p>
        </div>
        <Button asChild>
          <Link href="/links/new">
            <Plus />
            新增連結
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名稱</TableHead>
              <TableHead>網址</TableHead>
              <TableHead>圖示</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-medium">{link.label}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{link.url}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{link.icon}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/links/${link.id}`}>編輯</Link>
                  </Button>
                  <DeleteButton resource="links" id={link.id} label={link.label} redirectTo="/links" />
                </TableCell>
              </TableRow>
            ))}
            {links.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  尚無連結
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
