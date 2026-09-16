import GithubSlugger from "github-slugger";

export type Heading = { id: string; text: string; level: 2 | 3 };

export function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings: Heading[] = [];
  const slugger = new GithubSlugger();

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    headings.push({ id: slugger.slug(text), text, level });
  }

  return headings;
}

export { TableOfContents } from "./table-of-contents-client";
