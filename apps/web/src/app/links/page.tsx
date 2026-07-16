import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllLinks } from "@/lib/data";
import { getLinkIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "常用連結 | NTNU 碩士生指南",
};

export default function LinksPage() {
  const links = getAllLinks();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">常用連結</h1>
        <p className="mt-1 text-sm text-muted-foreground">校內常用系統與單位網站</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => {
          const Icon = getLinkIcon(link.icon);
          return (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
              <Card className="h-full transition-colors hover:bg-accent">
                <CardContent className="flex items-start gap-3">
                  <div className="rounded-md border bg-muted p-2">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      {link.label}
                      <ArrowUpRight className="size-3.5 text-muted-foreground" />
                    </div>
                    {link.description && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{link.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
