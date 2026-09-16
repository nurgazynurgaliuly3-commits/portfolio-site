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
      <section className="grid items-center gap-10 py-16 md:grid-cols-[1.15fr_1fr] md:gap-14 md:pt-24 md:pb-20">
        <div>
          <h1 className="font-heading text-[clamp(2.5rem,7vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.035em] text-balance">
            {locale === "kk"
              ? "AI автоматизациялар мен веб-қосымшалар жасаймын"
              : "I build AI automations and web apps"}
          </h1>
          <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-muted-foreground">
            {locale === "kk"
              ? "Нұрғалиұлы Нұрғазы — AI automator & AI developer"
              : "Nurgazy Nurgaliuly — AI automator & AI developer"}
          </p>
          <Button render={<Link href={`/${locale}/projects`} />} size="lg" className="mt-8">
            {locale === "kk" ? "Жобаларды көру" : "View projects"}
          </Button>
        </div>
        <div className="hero-panel aspect-[4/3] w-full md:aspect-square md:max-h-[26rem]" />
      </section>

      <section className="py-12 md:py-16">
        <h2 className="section-heading mb-8 text-2xl md:text-3xl">
          {locale === "kk" ? "Таңдаулы жобалар" : "Featured projects"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} locale={locale} />
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="py-12 md:py-16">
          <h2 className="section-heading mb-8 text-2xl md:text-3xl">
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
