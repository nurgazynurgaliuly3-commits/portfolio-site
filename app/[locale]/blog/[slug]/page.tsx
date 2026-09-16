import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { extractHeadings, TableOfContents } from "@/components/blog/table-of-contents";

export async function generateStaticParams() {
  const kkPosts = await getAllPosts("kk");
  return kkPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: "kk" | "en"; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(locale, slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <article className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-[1fr_240px]">
      <div className="prose prose-invert max-w-none">
        <h1 className="font-heading">{post.frontmatter.title}</h1>
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-dark" }]],
            },
          }}
        />
      </div>
      <TableOfContents headings={headings} />
    </article>
  );
}
