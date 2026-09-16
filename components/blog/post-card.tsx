import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/lib/mdx";

export function PostCard({ post, locale }: { post: Post; locale: "kk" | "en" }) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block h-full rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Card className="card-interactive h-full">
        <CardHeader>
          <CardTitle className="font-heading text-lg tracking-tight transition-colors group-hover:text-primary">
            {post.frontmatter.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {post.frontmatter.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
