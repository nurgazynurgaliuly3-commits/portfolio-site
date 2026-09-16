import { PROJECTS } from "@/data/projects";
import { ProjectFilter } from "@/components/projects/project-filter";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
      <h1 className="mb-10 font-heading text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em]">
        {locale === "kk" ? "Жобалар" : "Projects"}
      </h1>
      <ProjectFilter projects={PROJECTS} locale={locale} />
    </div>
  );
}
