import { describe, expect, it } from "vitest";
import { extractHeadings } from "./table-of-contents";

describe("extractHeadings", () => {
  it("extracts h2 and h3 headings with slugified ids", () => {
    const md = `## First Section\n\ntext\n\n### Sub Section\n\n## Second Section`;
    expect(extractHeadings(md)).toEqual([
      { id: "first-section", text: "First Section", level: 2 },
      { id: "sub-section", text: "Sub Section", level: 3 },
      { id: "second-section", text: "Second Section", level: 2 },
    ]);
  });

  it("ignores h1 and h4+", () => {
    const md = `# Title\n\n## Keep\n\n#### Too deep`;
    expect(extractHeadings(md)).toEqual([{ id: "keep", text: "Keep", level: 2 }]);
  });

  it("returns an empty array for content with no headings", () => {
    expect(extractHeadings("just some text")).toEqual([]);
  });
});
