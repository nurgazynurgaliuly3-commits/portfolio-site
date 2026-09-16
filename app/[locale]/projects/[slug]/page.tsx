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
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold">{project.title[locale]}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
      <p className="mt-6 text-lg text-muted-foreground">{project.summary[locale]}</p>
      <h2 className="mt-8 font-heading text-xl font-semibold">
        {locale === "kk" ? "Нәтиже" : "Outcome"}
      </h2>
      <p className="mt-2">{project.outcome[locale]}</p>
    </article>
  );
}
