import { PROJECTS } from "@/data/projects";
import { ProjectFilter } from "@/components/projects/project-filter";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 font-heading text-3xl font-bold">
        {locale === "kk" ? "Жобалар" : "Projects"}
      </h1>
      <ProjectFilter projects={PROJECTS} locale={locale} />
    </div>
  );
}
