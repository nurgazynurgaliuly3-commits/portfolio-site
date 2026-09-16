import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PROJECTS, getProjectBySlug } from "@/data/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: "kk" | "en"; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 md:py-20">
      <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em] text-balance">
        {project.title[locale]}
      </h1>
      <div className="rule-accent mt-6 h-[3px] w-16 rounded-full" />
      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <Badge key={s} variant="secondary" className="text-[0.7rem]">
            {s}
          </Badge>
        ))}
      </div>
      <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">{project.summary[locale]}</p>
      <h2 className="section-heading mt-14 text-xl">
        {locale === "kk" ? "Нәтиже" : "Outcome"}
      </h2>
      <p className="mt-3 max-w-[62ch] leading-relaxed">{project.outcome[locale]}</p>
    </article>
  );
}
