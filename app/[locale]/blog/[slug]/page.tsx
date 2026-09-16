import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { extractHeadings, TableOfContents } from "@/components/blog/table-of-contents";
import { articleJsonLd } from "@/lib/seo";

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
    <article className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post, locale)) }}
      />
      <div className="prose">
        <h1>{post.frontmatter.title}</h1>
        <div className="rule-accent mt-6 h-[3px] w-16 rounded-full" />
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
