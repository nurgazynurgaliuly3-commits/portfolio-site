import type { Post } from "@/lib/mdx";

const SITE_URL = "https://example-portfolio.up.railway.app";

export function personJsonLd(locale: "kk" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nurgazy Nurgaliuly",
    jobTitle: locale === "kk" ? "AI automator & AI developer" : "AI automator & AI developer",
    url: `${SITE_URL}/${locale}`,
    email: "mailto:nurgazynurgaliuly3@gmail.com",
  };
}

export function articleJsonLd(post: Post, locale: "kk" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    url: `${SITE_URL}/${locale}/blog/${post.slug}`,
  };
}

export { SITE_URL };
