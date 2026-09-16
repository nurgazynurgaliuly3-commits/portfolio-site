import { getAllPosts } from "@/lib/mdx";
import { PostCard } from "@/components/blog/post-card";

export default async function BlogPage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 font-heading text-3xl font-bold">{locale === "kk" ? "Блог" : "Blog"}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
