import { getAllPosts } from "@/lib/mdx";
import { SITE_URL } from "@/lib/seo";

export async function GET() {
  const posts = await getAllPosts("kk");

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${p.frontmatter.title}</title>
      <link>${SITE_URL}/kk/blog/${p.slug}</link>
      <description>${p.frontmatter.description}</description>
      <pubDate>${new Date(p.frontmatter.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Nurgazy Nurgaliuly — Blog</title>
    <link>${SITE_URL}</link>
    <description>AI automation and web development blog</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
