"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";

const NAV_KEYS = ["home", "projects", "blog", "about", "contact"] as const;
const NAV_HREFS: Record<(typeof NAV_KEYS)[number], string> = {
  home: "",
  projects: "/projects",
  blog: "/blog",
  about: "/about",
  contact: "/contact",
};

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();

  const links = NAV_KEYS.map((key) => ({
    key,
    label: t(key),
    href: `/${locale}${NAV_HREFS[key]}`,
  }));

  return (
    <header className="sticky top-0 z-40 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link
          href={`/${locale}`}
          className="font-heading text-xl font-bold tracking-[-0.04em] transition-colors hover:text-primary"
        >
          NN
        </Link>

        <nav className="hidden gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.key} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent>
            <nav className="mt-10 flex flex-col gap-1 px-2">
              {links.map((l) => (
                <Link
                  key={l.key}
                  href={l.href}
                  className="rounded-lg px-2 py-2.5 font-heading text-2xl font-semibold tracking-tight transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-6 flex items-center gap-2 px-2">
                <LocaleSwitcher />
                <ThemeToggle />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      {/* The site's signature gradient marks the header's edge instead of a
          flat 1px border. */}
      <div className="rule-accent h-px w-full opacity-30" />
    </header>
  );
}
