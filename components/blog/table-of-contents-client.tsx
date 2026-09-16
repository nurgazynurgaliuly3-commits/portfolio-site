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
      <nav className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <p className="mb-3 font-heading text-sm font-semibold tracking-tight">Contents</p>
        <ul className="space-y-0.5 border-l border-border text-sm">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`-ml-px block border-l-2 py-1.5 leading-snug transition-colors ${
                  h.level === 3 ? "pl-7" : "pl-4"
                } ${
                  activeId === h.id
                    ? "border-l-primary font-medium text-foreground"
                    : "border-l-transparent text-muted-foreground hover:border-l-primary/40 hover:text-foreground"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <details className="order-first mb-2 rounded-xl px-4 py-3 ring-1 ring-foreground/10 lg:hidden">
        <summary className="cursor-pointer font-heading text-sm font-semibold tracking-tight">
          Contents
        </summary>
        <ul className="mt-3 space-y-1.5 text-sm">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
              <a href={`#${h.id}`} className="text-muted-foreground hover:text-primary">
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
