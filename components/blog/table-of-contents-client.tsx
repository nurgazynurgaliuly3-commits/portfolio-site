"use client";

import { useEffect, useState } from "react";
import type { Heading } from "./table-of-contents";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      <nav className="hidden lg:sticky lg:top-24 lg:block">
        <p className="mb-2 text-sm font-semibold">Contents</p>
        <ul className="space-y-1 text-sm">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
              <a
                href={`#${h.id}`}
                className={activeId === h.id ? "text-primary" : "text-muted-foreground"}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <details className="mb-6 rounded-lg border border-border p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold">Contents</summary>
        <ul className="mt-2 space-y-1 text-sm">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
              <a href={`#${h.id}`}>{h.text}</a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
