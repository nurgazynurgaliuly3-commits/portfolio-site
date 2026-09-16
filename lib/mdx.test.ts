import { describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug } from "./mdx";

describe("mdx content loader", () => {
  it("lists only published posts for kk, sorted newest first", async () => {
    const posts = await getAllPosts("kk");
    expect(posts.length).toBeGreaterThanOrEqual(3);
    expect(posts.every((p) => p.frontmatter.published)).toBe(true);
    const dates = posts.map((p) => new Date(p.frontmatter.date).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it("getPostBySlug returns the matching post for en", async () => {
    const posts = await getAllPosts("en");
    const target = posts[0];
    const found = await getPostBySlug("en", target.slug);
    expect(found?.frontmatter.title).toBe(target.frontmatter.title);
  });

  it("getPostBySlug returns null for unknown slug", async () => {
    expect(await getPostBySlug("kk", "no-such-post")).toBeNull();
  });
});
