"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "./project-card";
import type { Project, ProjectRole } from "@/data/projects";

const FILTERS: { value: ProjectRole | "all"; kk: string; en: string }[] = [
  { value: "all", kk: "Барлығы", en: "All" },
  { value: "automation", kk: "Автоматизация", en: "Automation" },
  { value: "development", kk: "Әзірлеу", en: "Development" },
  { value: "both", kk: "Екеуі де", en: "Both" },
];

export function ProjectFilter({ projects, locale }: { projects: Project[]; locale: "kk" | "en" }) {
  const [filter, setFilter] = useState<ProjectRole | "all">("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.role === filter);

  return (
    <div className="space-y-6">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as ProjectRole | "all")}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f[locale]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} locale={locale} />
        ))}
      </div>
    </div>
  );
}
