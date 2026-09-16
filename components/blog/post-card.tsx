import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/lib/mdx";

export function PostCard({ post, locale }: { post: Post; locale: "kk" | "en" }) {
  return (
    <Link href={`/${locale}/blog/${post.slug}`}>
      <Card className="h-full transition hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-heading text-lg">{post.frontmatter.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{post.frontmatter.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
