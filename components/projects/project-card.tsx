import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, locale }: { project: Project; locale: "kk" | "en" }) {
  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="group block h-full rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Card className="card-interactive h-full">
        <CardHeader>
          <CardTitle className="font-heading text-lg tracking-tight transition-colors group-hover:text-primary">
            {project.title[locale]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{project.summary[locale]}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <Badge key={s} variant="secondary" className="text-[0.7rem]">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
