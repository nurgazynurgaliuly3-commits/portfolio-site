import { getAllPosts } from "@/lib/mdx";
import { PostCard } from "@/components/blog/post-card";

export default async function BlogPage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
      <h1 className="mb-10 font-heading text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em]">{locale === "kk" ? "Блог" : "Blog"}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
