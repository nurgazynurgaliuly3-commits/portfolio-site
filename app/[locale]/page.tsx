import Link from "next/link";
import { getFeaturedProjects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/mdx";
import { Button } from "@/components/ui/button";
import { personJsonLd } from "@/lib/seo";

export default async function HomePage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;
  const featured = getFeaturedProjects();
  const posts = (await getAllPosts(locale)).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
      />
      <section className="grid gap-8 py-20 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl">
            {locale === "kk"
              ? "AI автоматизациялар мен веб-қосымшалар жасаймын"
              : "I build AI automations and web apps"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {locale === "kk"
              ? "Нұрғалиұлы Нұрғазы — AI automator & AI developer"
              : "Nurgazy Nurgaliuly — AI automator & AI developer"}
          </p>
          <Button render={<Link href={`/${locale}/projects`} />} className="mt-6">
            {locale === "kk" ? "Жобаларды көру" : "View projects"}
          </Button>
        </div>
        <div className="h-64 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-80 md:h-80" />
      </section>

      <section className="py-12">
        <h2 className="mb-6 font-heading text-2xl font-bold">
          {locale === "kk" ? "Таңдаулы жобалар" : "Featured projects"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} locale={locale} />
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="py-12">
          <h2 className="mb-6 font-heading text-2xl font-bold">
            {locale === "kk" ? "Соңғы жазбалар" : "Latest posts"}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
