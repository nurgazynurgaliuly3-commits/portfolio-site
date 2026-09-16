import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PROJECTS, getProjectBySlug } from "@/data/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "kk" | "en"; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title[locale],
    description: project.summary[locale],
    alternates: {
      languages: {
        kk: `/kk/projects/${slug}`,
        en: `/en/projects/${slug}`,
      },
    },
  };
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
      {project.image && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl border border-border">
          <Image
            src={project.image}
            alt={project.title[locale]}
            fill
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover object-top"
            priority
          />
        </div>
      )}
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
