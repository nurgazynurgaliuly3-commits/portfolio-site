import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  published: boolean;
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

async function listSlugDirs(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

export async function getAllPosts(locale: "kk" | "en"): Promise<Post[]> {
  const slugs = await listSlugDirs();
  const posts: Post[] = [];

  for (const slug of slugs) {
    const post = await getPostBySlug(locale, slug);
    if (post && post.frontmatter.published) posts.push(post);
  }

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
}

export async function getPostBySlug(locale: "kk" | "en", slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, slug, `index.${locale}.mdx`);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(raw);
    return { slug, frontmatter: data as PostFrontmatter, content };
  } catch {
    return null;
  }
}
