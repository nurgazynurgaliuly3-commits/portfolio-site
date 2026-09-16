import { describe, expect, it } from "vitest";
import { PROJECTS, getProjectBySlug, getFeaturedProjects } from "./projects";

describe("projects data", () => {
  it("has exactly 11 projects", () => {
    expect(PROJECTS).toHaveLength(11);
  });

  it("has unique slugs", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every project has kk and en title/summary/outcome", () => {
    for (const p of PROJECTS) {
      expect(p.title.kk).toBeTruthy();
      expect(p.title.en).toBeTruthy();
      expect(p.summary.kk).toBeTruthy();
      expect(p.summary.en).toBeTruthy();
      expect(p.outcome.kk).toBeTruthy();
      expect(p.outcome.en).toBeTruthy();
    }
  });

  it("getProjectBySlug finds an existing project", () => {
    const first = PROJECTS[0];
    expect(getProjectBySlug(first.slug)).toEqual(first);
  });

  it("getProjectBySlug returns undefined for unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("getFeaturedProjects returns only featured ones", () => {
    const featured = getFeaturedProjects();
    expect(featured.every((p) => p.featured)).toBe(true);
    expect(featured.length).toBeGreaterThan(0);
  });
});
