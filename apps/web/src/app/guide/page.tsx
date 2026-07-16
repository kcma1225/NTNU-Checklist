import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
import { getGuideSections, getCategories } from "@/lib/data";
import { getCategoryBadgeClass } from "@/lib/category-colors";

export const metadata: Metadata = {
  title: "指南 | NTNU 碩士生指南",
};

export default function GuidePage() {
  const sections = getGuideSections();
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">指南</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          各階段的重點說明，詳細時程請以「時間軸」頁面為準。
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((section) => {
          const category = categories.find((c) => c.label === section.category);
          return (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {category && (
                    <Badge variant="outline" className={getCategoryBadgeClass(category.colorToken)}>
                      {category.label}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-foreground/90">
                {section.paragraphs.map((p, i) => (
                  <Markdown key={i}>{p}</Markdown>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
