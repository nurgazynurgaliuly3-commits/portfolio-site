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
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="font-heading text-lg font-bold">
          N.N.
        </Link>

        <nav className="hidden gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.key} href={l.href} className="text-sm hover:text-primary">
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
            <nav className="mt-8 flex flex-col gap-4">
              {links.map((l) => (
                <Link key={l.key} href={l.href} className="text-lg">
                  {l.label}
                </Link>
              ))}
              <div className="mt-4 flex items-center gap-2">
                <LocaleSwitcher />
                <ThemeToggle />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
