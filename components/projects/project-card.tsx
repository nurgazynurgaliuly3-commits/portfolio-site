import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, locale }: { project: Project; locale: "kk" | "en" }) {
  return (
    <Link href={`/${locale}/projects/${project.slug}`}>
      <Card className="h-full transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader>
          <CardTitle className="font-heading">{project.title[locale]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{project.summary[locale]}</p>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
