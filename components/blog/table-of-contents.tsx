export type Heading = { id: string; text: string; level: 2 | 3 };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings: Heading[] = [];

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    headings.push({ id: slugify(text), text, level });
  }

  return headings;
}

export { TableOfContents } from "./table-of-contents-client";
