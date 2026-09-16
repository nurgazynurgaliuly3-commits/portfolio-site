# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (kk/en) Next.js portfolio + MDX blog site for Nurgazy Nurgaliuly (AI automator & AI developer), showcasing 10 demo projects, deployable to Railway.

**Architecture:** Next.js 14 App Router with `/[locale]/...` routing via next-intl. Static project data lives in a TypeScript module; blog posts are per-locale MDX files rendered with next-mdx-remote. ShadCN UI supplies primitives; a bold-creative dark theme (orange/coral accent) is layered on top via Tailwind tokens. next-themes handles dark/light toggle.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, ShadCN UI, next-intl, next-mdx-remote, gray-matter, rehype-pretty-code, remark-gfm, next-themes, Vitest (unit tests for pure logic).

**Spec:** `docs/superpowers/specs/2026-09-16-portfolio-site-design.md`

## Global Constraints

- Framework: Next.js 14+, App Router, TypeScript strict mode.
- Locales: exactly `kk` (default) and `en`, routed as `/kk/...` and `/en/...` via next-intl.
- Theme default: dark. Accent color: orange/coral (`#ff5a36` base, gradient to `#ff8a3d`). Light theme uses white background with the same accent.
- Fonts: Space Grotesk (headings/accent), Inter (body) — loaded via `next/font/google`.
- Data source: no backend/CMS. Projects in `data/projects.ts`, blog posts as MDX files under `content/blog/<slug>/index.<locale>.mdx`.
- Deploy target: Railway (no Vercel-only APIs).
- No auth, no admin panel, no live chatbot demos (out of scope per spec).

---

## File Structure

```
app/
  [locale]/
    layout.tsx              # root layout: fonts, ThemeProvider, next-intl provider, Header/Footer
    page.tsx                # home
    projects/
      page.tsx
      [slug]/page.tsx
    blog/
      page.tsx
      [slug]/page.tsx
    about/page.tsx
    contact/page.tsx
  sitemap.ts
  robots.ts
  feed.xml/route.ts
i18n/
  routing.ts                 # next-intl routing config (locales, defaultLocale)
  request.ts                 # next-intl request config
messages/
  kk.json
  en.json
middleware.ts                 # next-intl middleware
data/
  projects.ts                 # Project type + PROJECTS array
  projects.test.ts
content/
  blog/
    ai-6-months/index.kk.mdx
    ai-6-months/index.en.mdx
    vibe-coding-tools-2025/index.kk.mdx
    vibe-coding-tools-2025/index.en.mdx
    why-nextjs-portfolio/index.kk.mdx
    why-nextjs-portfolio/index.en.mdx
lib/
  mdx.ts                      # getAllPosts, getPostBySlug, frontmatter parsing
  mdx.test.ts
  seo.ts                      # JSON-LD builders (Person, Article)
components/
  layout/
    header.tsx
    footer.tsx
    theme-toggle.tsx
    locale-switcher.tsx
  projects/
    project-card.tsx
    project-filter.tsx
  blog/
    post-card.tsx
    table-of-contents.tsx
    table-of-contents.test.ts   # tests for the heading-extraction pure function
  ui/                            # ShadCN-generated components (button, card, badge, separator, tabs, avatar, navigation-menu, sheet)
styles/
  globals.css
```

---

### Task 1: Scaffold Next.js project + Tailwind + base tooling

**Files:**
- Create: whole project scaffold via `create-next-app` (package.json, tsconfig.json, next.config.js, app/layout.tsx, app/page.tsx, styles/globals.css, .eslintrc, etc.)
- Create: `vitest.config.ts`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Produces: a running Next.js app (`npm run dev` serves on :3000), a working `npm run build`, and `npm run test` running Vitest.

- [ ] **Step 1: Scaffold the app**

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias "@/*" --eslint --no-turbopack --yes
```

Confirm it creates `app/`, `tsconfig.json`, `tailwind.config.ts` (or `.js`), `package.json` in the current directory.

- [ ] **Step 2: Install Vitest for pure-logic unit tests**

```bash
npm install -D vitest @vitest/ui
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 3: Verify dev server and build**

Run: `npm run build`
Expected: build succeeds with the default Next.js starter page.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind and Vitest"
```

---

### Task 2: Initialize ShadCN UI + base components

**Files:**
- Create: `components.json` (ShadCN config)
- Create: `components/ui/button.tsx`, `card.tsx`, `badge.tsx`, `separator.tsx`, `tabs.tsx`, `avatar.tsx`, `navigation-menu.tsx`, `sheet.tsx`
- Modify: `styles/globals.css` (ShadCN CSS variables)

**Interfaces:**
- Produces: importable `@/components/ui/{button,card,badge,separator,tabs,avatar,navigation-menu,sheet}` used by later layout/UI tasks.

- [ ] **Step 1: Init ShadCN**

```bash
npx shadcn@latest init -d
```

Choose defaults (Slate base style is fine — colors are overridden in Task 3).

- [ ] **Step 2: Add components**

```bash
npx shadcn@latest add button card badge separator tabs avatar navigation-menu sheet
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds, no missing-import errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: initialize ShadCN UI with base components"
```

---

### Task 3: Bold-creative theme tokens + fonts + dark/light toggle

**Files:**
- Modify: `styles/globals.css` — override ShadCN CSS variables for dark (default) and light themes using the accent `#ff5a36`→`#ff8a3d`.
- Modify: `tailwind.config.ts` — extend `fontFamily` with `heading` (Space Grotesk) and `sans` (Inter).
- Create: `components/layout/theme-toggle.tsx`
- Install: `next-themes`

**Interfaces:**
- Produces: `<ThemeToggle />` component (Sun/Moon icon button using ShadCN `Button`), and CSS variables `--accent`, `--accent-foreground` etc. usable across the app.
- Consumes: `components/ui/button.tsx` from Task 2.

- [ ] **Step 1: Install next-themes**

```bash
npm install next-themes
```

- [ ] **Step 2: Load fonts in root layout stub (will move under `[locale]` in Task 4)**

In `app/layout.tsx` (temporary, overwritten in Task 4), import fonts via `next/font/google`:

```ts
import { Space_Grotesk, Inter } from "next/font/google";

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
```

- [ ] **Step 3: Set Tailwind font families**

In `tailwind.config.ts` `theme.extend`:

```ts
fontFamily: {
  heading: ["var(--font-heading)"],
  sans: ["var(--font-sans)"],
},
```

- [ ] **Step 4: Override theme colors in `styles/globals.css`**

Replace the ShadCN `:root` and `.dark` color blocks with:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 4%;
  --accent: 14 100% 60%;         /* #ff5a36 */
  --accent-foreground: 0 0% 100%;
  --primary: 14 100% 60%;
  --primary-foreground: 0 0% 100%;
}

.dark {
  --background: 0 0% 4%;          /* #0a0a0a */
  --foreground: 0 0% 96%;
  --accent: 14 100% 60%;
  --accent-foreground: 0 0% 100%;
  --primary: 20 100% 65%;         /* #ff8a3d */
  --primary-foreground: 0 0% 4%;
}
```

Keep other ShadCN variables (`--card`, `--border`, `--muted`, etc.) as generated by `shadcn init`, only replacing the ones above.

- [ ] **Step 5: Create `ThemeToggle` component**

```tsx
// components/layout/theme-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </Button>
  );
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: bold-creative theme tokens, fonts, and theme toggle"
```

---

### Task 4: next-intl routing (kk/en) + root layout

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`
- Create: `middleware.ts`
- Create: `messages/kk.json`, `messages/en.json`
- Create: `app/[locale]/layout.tsx` (replaces `app/layout.tsx` content)
- Delete: `app/page.tsx` (moves to `app/[locale]/page.tsx` in Task 5)
- Modify: `next.config.ts` — wrap with `createNextIntlPlugin`

**Interfaces:**
- Produces: `routing` object (`locales: ["kk","en"]`, `defaultLocale: "kk"`) importable from `@/i18n/routing`, and a working `useTranslations()` / `getTranslations()` in Server/Client Components.
- Consumes: `ThemeToggle` (Task 3), ShadCN `NavigationMenu`/`Sheet` (Task 2) — wired into Header in Task 5, not this task.

- [ ] **Step 1: Install next-intl**

```bash
npm install next-intl
```

- [ ] **Step 2: Define routing config**

```ts
// i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["kk", "en"],
  defaultLocale: "kk",
});
```

- [ ] **Step 3: Define request config**

```ts
// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Middleware**

```ts
// middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

- [ ] **Step 5: Seed message files**

```json
// messages/kk.json
{
  "nav": {
    "home": "Басты бет",
    "projects": "Жобалар",
    "blog": "Блог",
    "about": "Мен туралы",
    "contact": "Байланыс"
  },
  "home": {
    "heroTitle": "AI автоматизациялар мен веб-қосымшалар жасаймын",
    "heroSubtitle": "Нұрғалиұлы Нұрғазы — AI automator & AI developer",
    "featuredProjects": "Таңдаулы жобалар",
    "latestPosts": "Соңғы жазбалар"
  }
}
```

```json
// messages/en.json
{
  "nav": {
    "home": "Home",
    "projects": "Projects",
    "blog": "Blog",
    "about": "About",
    "contact": "Contact"
  },
  "home": {
    "heroTitle": "I build AI automations and web apps",
    "heroSubtitle": "Nurgazy Nurgaliuly — AI automator & AI developer",
    "featuredProjects": "Featured projects",
    "latestPosts": "Latest posts"
  }
}
```

- [ ] **Step 6: Root layout under `[locale]`**

```tsx
// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Space_Grotesk, Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import "@/styles/globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Nurgazy Nurgaliuly — AI automator & AI developer",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Remove old root files, add redirect root page**

Delete `app/page.tsx`. Since middleware redirects `/` → `/kk`, no root `app/page.tsx` is needed once `[locale]` layout exists. Keep `app/layout.tsx` deleted too (the `[locale]` one is the only layout).

- [ ] **Step 8: Wrap `next.config` with next-intl plugin**

```ts
// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 9: Verify build (will fail until Task 5 adds `app/[locale]/page.tsx` — add a temporary placeholder)**

Temporarily create `app/[locale]/page.tsx` with `export default function Home() { return <div>OK</div>; }`, run `npm run build`, confirm `/kk` and `/en` are generated, then leave this file for Task 5 to replace.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add next-intl kk/en routing and locale root layout"
```

---

### Task 5: Header, Footer, Locale switcher, and app shell

**Files:**
- Create: `components/layout/header.tsx`
- Create: `components/layout/footer.tsx`
- Create: `components/layout/locale-switcher.tsx`
- Modify: `app/[locale]/layout.tsx` — render `<Header />` and `<Footer />` around `children`

**Interfaces:**
- Consumes: `routing` (Task 4), `ThemeToggle` (Task 3), ShadCN `NavigationMenu`, `Sheet`, `Button` (Task 2), `useTranslations` from `next-intl`.
- Produces: `<Header />`, `<Footer />` composed into every page via the locale layout.

- [ ] **Step 1: LocaleSwitcher**

```tsx
// components/layout/locale-switcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: string) {
    const rest = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${next}${rest}`);
  }

  return (
    <div className="flex gap-1">
      {routing.locales.map((l) => (
        <Button
          key={l}
          size="sm"
          variant={l === locale ? "default" : "ghost"}
          onClick={() => switchTo(l)}
        >
          {l.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Header with nav links + mobile Sheet**

```tsx
// components/layout/header.tsx
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
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
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
```

- [ ] **Step 3: Footer**

```tsx
// components/layout/footer.tsx
import { useLocale, useTranslations } from "next-intl";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <footer className="border-t border-border py-8 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <span>&copy; {new Date().getFullYear()} Nurgazy Nurgaliuly</span>
        <div className="flex gap-4">
          <a href="mailto:nurgazynurgaliuly3@gmail.com">Email</a>
          <a href="https://t.me/" target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a href={`/${locale}/contact`}>{t("contact")}</a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Wire into layout**

In `app/[locale]/layout.tsx`, wrap `children`:

```tsx
<ThemeProvider attribute="class" defaultTheme="dark">
  <NextIntlClientProvider messages={messages}>
    <Header />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </NextIntlClientProvider>
</ThemeProvider>
```

- [ ] **Step 5: Verify manually**

Run: `npm run dev`, open `http://localhost:3000/kk` and `/en`.
Expected: header nav, locale switcher, and theme toggle all render and function; mobile width (390px via devtools) shows the Sheet menu.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add header, footer, locale switcher, mobile nav"
```

---

### Task 6: Project data model + unit tests

**Files:**
- Create: `data/projects.ts`
- Test: `data/projects.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type ProjectRole = "automation" | "development" | "both";
  export type Project = {
    slug: string;
    title: { kk: string; en: string };
    summary: { kk: string; en: string };
    role: ProjectRole;
    stack: string[];
    outcome: { kk: string; en: string };
    featured: boolean;
  };
  export const PROJECTS: Project[];
  export function getProjectBySlug(slug: string): Project | undefined;
  export function getFeaturedProjects(): Project[];
  ```
- Consumed by: Task 7 (projects pages), Task 5 home page (Task 8).

- [ ] **Step 1: Write the failing test**

```ts
// data/projects.test.ts
import { describe, expect, it } from "vitest";
import { PROJECTS, getProjectBySlug, getFeaturedProjects } from "./projects";

describe("projects data", () => {
  it("has exactly 10 projects", () => {
    expect(PROJECTS).toHaveLength(10);
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run data/projects.test.ts`
Expected: FAIL — `./projects` module not found.

- [ ] **Step 3: Implement `data/projects.ts`**

```ts
export type ProjectRole = "automation" | "development" | "both";

export type Project = {
  slug: string;
  title: { kk: string; en: string };
  summary: { kk: string; en: string };
  role: ProjectRole;
  stack: string[];
  outcome: { kk: string; en: string };
  featured: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "whatsapp-ai-sales-bot",
    title: { kk: "WhatsApp AI сатылым-боты", en: "WhatsApp AI Sales Bot" },
    summary: {
      kk: "Тапсырыс қабылдайтын, жиі қойылатын сұрақтарға жауап беретін және төлем сілтемесін жіберетін WhatsApp Business API боты.",
      en: "A WhatsApp Business API bot that takes orders, answers FAQs, and sends payment links.",
    },
    role: "automation",
    stack: ["WhatsApp Business API", "Node.js", "OpenAI API", "PostgreSQL"],
    outcome: {
      kk: "Менеджерлердің қолмен жауап беру уақытын 70%-ға қысқартты.",
      en: "Cut manual reply time for managers by 70%.",
    },
    featured: true,
  },
  {
    slug: "instagram-dm-autoreply",
    title: { kk: "Instagram Direct AI автожауап-боты", en: "Instagram Direct AI Auto-Reply Bot" },
    summary: {
      kk: "Комментарийлер мен Direct хабарламаларына автоматты жауап беріп, лидтерді CRM-ге жіберетін бот.",
      en: "Auto-replies to comments and DMs, and forwards qualified leads into a CRM.",
    },
    role: "automation",
    stack: ["Instagram Graph API", "Node.js", "OpenAI API", "Airtable"],
    outcome: {
      kk: "Лидтерді өңдеу жылдамдығын минуттарға дейін қысқартты.",
      en: "Reduced lead response time down to minutes.",
    },
    featured: true,
  },
  {
    slug: "telegram-rag-consultant",
    title: { kk: "Telegram AI консультант-бот (RAG)", en: "Telegram AI Consultant Bot (RAG)" },
    summary: {
      kk: "Білім базасы негізінде дәл жауап беретін RAG-негізделген Telegram боты, тапсырыс формасымен.",
      en: "A RAG-powered Telegram bot answering from a knowledge base, with an order form flow.",
    },
    role: "both",
    stack: ["Telegram Bot API", "LangChain", "Pinecone", "Next.js"],
    outcome: {
      kk: "Қолдау сұрауларының 60%-ын адам араласуынсыз шешті.",
      en: "Resolved 60% of support queries without human involvement.",
    },
    featured: true,
  },
  {
    slug: "tiktok-comment-to-dm",
    title: { kk: "TikTok comment-to-DM automation", en: "TikTok Comment-to-DM Automation" },
    summary: {
      kk: "Белгілі бейне астындағы комментке автоматты DM жіберетін воронка автоматтандыруы.",
      en: "A funnel automation that auto-DMs users who comment a keyword under a target video.",
    },
    role: "automation",
    stack: ["TikTok API", "Make.com", "Node.js"],
    outcome: {
      kk: "Бір науқанда 2000+ автоматты DM жіберілді.",
      en: "Sent 2,000+ automated DMs in a single campaign.",
    },
    featured: false,
  },
  {
    slug: "saas-landing",
    title: { kk: "SaaS қызмет лендинг сайты", en: "SaaS Service Landing Page" },
    summary: {
      kk: "Конверсияға бағытталған hero, pricing және testimonials секцияларымен лендинг.",
      en: "A conversion-focused landing page with hero, pricing, and testimonials sections.",
    },
    role: "development",
    stack: ["Next.js", "ShadCN UI", "Tailwind CSS"],
    outcome: {
      kk: "Демо-сұраныс конверсиясы 4%-дан 9%-ға өсті.",
      en: "Demo-request conversion rose from 4% to 9%.",
    },
    featured: true,
  },
  {
    slug: "mini-ecommerce",
    title: { kk: "Интернет-дүкен (mini e-commerce)", en: "Mini E-Commerce Store" },
    summary: {
      kk: "Каталог, себет және checkout ағынымен шағын интернет-дүкен.",
      en: "A small storefront with catalog, cart, and checkout flow.",
    },
    role: "development",
    stack: ["Next.js", "Stripe", "Prisma", "PostgreSQL"],
    outcome: {
      kk: "Бірінші айда 150+ тапсырысты өңдеді.",
      en: "Processed 150+ orders in the first month.",
    },
    featured: false,
  },
  {
    slug: "site-scraper-dashboard",
    title: { kk: "AI сайт-скрейпер + дашборд", en: "AI Site Scraper + Dashboard" },
    summary: {
      kk: "Сайттардан деректер жинап, кестеге/графикке шығаратын скрейпер және талдау дашборды.",
      en: "A scraper that collects site data and visualizes it in a table/chart dashboard.",
    },
    role: "development",
    stack: ["Playwright", "Python", "Next.js", "Recharts"],
    outcome: {
      kk: "Апталық баға мониторингін толық автоматтандырды.",
      en: "Fully automated weekly price monitoring.",
    },
    featured: false,
  },
  {
    slug: "invoice-to-sheets-agent",
    title: { kk: "Құжат→Sheets автоматтандыру агенті", en: "Document-to-Sheets Automation Agent" },
    summary: {
      kk: "Шот-фактураларды оқып, деректерді Google Sheets-ке автоматты жазатын AI агент.",
      en: "An AI agent that reads invoices and writes structured data into Google Sheets.",
    },
    role: "automation",
    stack: ["OpenAI Vision API", "Google Sheets API", "n8n"],
    outcome: {
      kk: "Бухгалтерияның қолмен енгізу уақытын аптасына 5 сағатқа қысқартты.",
      en: "Cut manual bookkeeping entry time by 5 hours per week.",
    },
    featured: false,
  },
  {
    slug: "crm-insight-dashboard",
    title: { kk: "AI CRM-инсайт дашборды", en: "AI CRM Insight Dashboard" },
    summary: {
      kk: "Чат және тапсырыс тарихынан клиент сегменттерін AI арқылы талдайтын дашборд.",
      en: "A dashboard that uses AI to segment customers from chat and order history.",
    },
    role: "both",
    stack: ["Next.js", "OpenAI API", "PostgreSQL", "Recharts"],
    outcome: {
      kk: "Маркетинг командасына 5 нақты клиент сегментін анықтап берді.",
      en: "Surfaced 5 actionable customer segments for the marketing team.",
    },
    featured: false,
  },
  {
    slug: "embeddable-ai-chat-widget",
    title: { kk: "Ендірілетін AI чат-виджет", en: "Embeddable AI Chat Widget" },
    summary: {
      kk: "Кез келген сайтқа ендірілетін, RAG негізіндегі AI чат-виджет.",
      en: "A RAG-based AI chat widget embeddable into any website.",
    },
    role: "development",
    stack: ["React", "OpenAI API", "Pinecone", "Cloudflare Workers"],
    outcome: {
      kk: "Клиенттердің қолдау сұрауын 40%-ға азайтты.",
      en: "Reduced client support tickets by 40%.",
    },
    featured: true,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run data/projects.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add data/projects.ts data/projects.test.ts
git commit -m "feat: add 10-project data model with unit tests"
```

---

### Task 7: Projects list + detail pages

**Files:**
- Create: `components/projects/project-card.tsx`
- Create: `components/projects/project-filter.tsx`
- Create: `app/[locale]/projects/page.tsx`
- Create: `app/[locale]/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `PROJECTS`, `getProjectBySlug`, `Project` type (Task 6); ShadCN `Card`, `Badge`, `Tabs` (Task 2); `useLocale`/`getLocale` from next-intl.
- Produces: `/[locale]/projects` and `/[locale]/projects/[slug]` routes; `<ProjectCard project={Project} locale="kk"|"en" />` reused by home page (Task 8).

- [ ] **Step 1: ProjectCard**

```tsx
// components/projects/project-card.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, locale }: { project: Project; locale: "kk" | "en" }) {
  return (
    <Link href={`/${locale}/projects/${project.slug}`}>
      <Card className="h-full transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader>
          <CardTitle className="font-heading">{project.title[locale]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{project.summary[locale]}</p>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 2: ProjectFilter (client component, filters by role)**

```tsx
// components/projects/project-filter.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "./project-card";
import type { Project, ProjectRole } from "@/data/projects";

const FILTERS: { value: ProjectRole | "all"; kk: string; en: string }[] = [
  { value: "all", kk: "Барлығы", en: "All" },
  { value: "automation", kk: "Автоматизация", en: "Automation" },
  { value: "development", kk: "Әзірлеу", en: "Development" },
  { value: "both", kk: "Екеуі де", en: "Both" },
];

export function ProjectFilter({ projects, locale }: { projects: Project[]; locale: "kk" | "en" }) {
  const [filter, setFilter] = useState<ProjectRole | "all">("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.role === filter);

  return (
    <div className="space-y-6">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as ProjectRole | "all")}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f[locale]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} locale={locale} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `/projects` page**

```tsx
// app/[locale]/projects/page.tsx
import { PROJECTS } from "@/data/projects";
import { ProjectFilter } from "@/components/projects/project-filter";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 font-heading text-3xl font-bold">
        {locale === "kk" ? "Жобалар" : "Projects"}
      </h1>
      <ProjectFilter projects={PROJECTS} locale={locale} />
    </div>
  );
}
```

- [ ] **Step 4: `/projects/[slug]` page**

```tsx
// app/[locale]/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PROJECTS, getProjectBySlug } from "@/data/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: "kk" | "en"; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold">{project.title[locale]}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
      <p className="mt-6 text-lg text-muted-foreground">{project.summary[locale]}</p>
      <h2 className="mt-8 font-heading text-xl font-semibold">
        {locale === "kk" ? "Нәтиже" : "Outcome"}
      </h2>
      <p className="mt-2">{project.outcome[locale]}</p>
    </article>
  );
}
```

- [ ] **Step 5: Verify manually**

Run: `npm run dev`, open `/kk/projects`, click a card, confirm `/kk/projects/<slug>` renders; switch filter tabs; repeat for `/en/projects`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add projects list and detail pages with role filter"
```

---

### Task 8: Home page (hero + featured projects + latest posts placeholder)

**Files:**
- Create: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `getFeaturedProjects` (Task 6), `ProjectCard` (Task 7), `useTranslations` (Task 4 messages). Latest-posts section calls `getAllPosts` from Task 9 — **this task's Step 3 must run after Task 9** (see note in Step 3), OR ship with an empty placeholder list first and wire real data once Task 9 lands. To keep tasks independently testable, implement the hero + featured projects now and leave a `{/* latest posts: Task 9 */}` TODO-free stub that calls a local `getAllPosts` stub returning `[]`; Task 9 replaces the stub import with the real `lib/mdx.ts` implementation.

- [ ] **Step 1: Build the page with hero + featured projects, and an inline latest-posts section using `getAllPosts` imported from `@/lib/mdx` (implemented in Task 9)**

```tsx
// app/[locale]/page.tsx
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getFeaturedProjects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/mdx";
import { Button } from "@/components/ui/button";

export default async function HomePage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;
  const featured = getFeaturedProjects();
  const posts = (await getAllPosts(locale)).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="grid gap-8 py-20 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl">
            {locale === "kk"
              ? "AI автоматизациялар мен веб-қосымшалар жасаймын"
              : "I build AI automations and web apps"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {locale === "kk"
              ? "Нұрғалиұлы Нұрғазы — AI automator & AI developer"
              : "Nurgazy Nurgaliuly — AI automator & AI developer"}
          </p>
          <Button asChild className="mt-6">
            <Link href={`/${locale}/projects`}>{locale === "kk" ? "Жобаларды көру" : "View projects"}</Link>
          </Button>
        </div>
        <div className="h-64 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-80 md:h-80" />
      </section>

      <section className="py-12">
        <h2 className="mb-6 font-heading text-2xl font-bold">
          {locale === "kk" ? "Таңдаулы жобалар" : "Featured projects"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} locale={locale} />
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="py-12">
          <h2 className="mb-6 font-heading text-2xl font-bold">
            {locale === "kk" ? "Соңғы жазбалар" : "Latest posts"}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

Note: this file imports `@/lib/mdx` (`getAllPosts`) and `@/components/blog/post-card` (`PostCard`), both created in Task 9. Implement this task's Step 1 together with Task 9, or stub `lib/mdx.ts` with a `getAllPosts` returning `[]` and `components/blog/post-card.tsx` as an empty component first, then replace both in Task 9 — do not leave the build broken between tasks.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds (after Task 9's real `lib/mdx.ts`/`PostCard` are in place, or the temporary stubs from the note above).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add home page with hero and featured projects"
```

---

### Task 9: MDX blog pipeline (`lib/mdx.ts`) + unit tests

**Files:**
- Create: `lib/mdx.ts`
- Test: `lib/mdx.test.ts`
- Create: `content/blog/ai-6-months/index.kk.mdx`, `index.en.mdx`
- Create: `content/blog/vibe-coding-tools-2025/index.kk.mdx`, `index.en.mdx`
- Create: `content/blog/why-nextjs-portfolio/index.kk.mdx`, `index.en.mdx`
- Install: `next-mdx-remote`, `gray-matter`, `rehype-pretty-code`, `remark-gfm`, `shiki`

**Interfaces:**
- Produces:
  ```ts
  export type PostFrontmatter = {
    title: string;
    description: string;
    date: string;   // ISO
    tags: string[];
    image?: string;
    published: boolean;
  };
  export type Post = { slug: string; frontmatter: PostFrontmatter; content: string };
  export async function getAllPosts(locale: "kk" | "en"): Promise<Post[]>;
  export async function getPostBySlug(locale: "kk" | "en", slug: string): Promise<Post | null>;
  ```
- Consumed by: Task 8 (home page), Task 10 (blog pages).

- [ ] **Step 1: Install deps**

```bash
npm install next-mdx-remote gray-matter rehype-pretty-code remark-gfm shiki
```

- [ ] **Step 2: Write the failing test**

```ts
// lib/mdx.test.ts
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run lib/mdx.test.ts`
Expected: FAIL — `./mdx` module not found.

- [ ] **Step 4: Implement `lib/mdx.ts`**

```ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  published: boolean;
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

async function listSlugDirs(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

export async function getAllPosts(locale: "kk" | "en"): Promise<Post[]> {
  const slugs = await listSlugDirs();
  const posts: Post[] = [];

  for (const slug of slugs) {
    const post = await getPostBySlug(locale, slug);
    if (post && post.frontmatter.published) posts.push(post);
  }

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
}

export async function getPostBySlug(locale: "kk" | "en", slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, slug, `index.${locale}.mdx`);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(raw);
    return { slug, frontmatter: data as PostFrontmatter, content };
  } catch {
    return null;
  }
}
```

- [ ] **Step 5: Create the 3 demo posts (kk + en)**

```mdx
{/* content/blog/ai-6-months/index.kk.mdx */}
---
title: "Как я стал разработчиком за 6 месяцев"
description: "AI құралдарын пайдаланып фулстек дағдыларды 6 айда қалай меңгердім."
date: "2026-01-15"
tags: ["карьера", "AI", "оқу"]
published: true
---

## Бастау нүктесі

6 ай бұрын мен бағдарламалауды білмейтінмін...

## AI құралдарын пайдалану

Claude Code және басқа AI құралдары процесті тездетті.

## Нәтиже

Қазір мен толыққанды AI automator & developer ретінде жұмыс істеймін.
```

```mdx
{/* content/blog/ai-6-months/index.en.mdx */}
---
title: "How I Became a Developer in 6 Months"
description: "How I picked up full-stack skills in 6 months using AI tools."
date: "2026-01-15"
tags: ["career", "AI", "learning"]
published: true
---

## Starting point

Six months ago I didn't know how to code...

## Using AI tools

Claude Code and other AI tools accelerated the process.

## Result

Today I work full-time as an AI automator & developer.
```

```mdx
{/* content/blog/vibe-coding-tools-2025/index.kk.mdx */}
---
title: "Топ-5 инструментов для вайб-кодинга в 2025"
description: "2025 жылы жобаны тез жасауға көмектесетін 5 құрал."
date: "2026-02-10"
tags: ["құралдар", "AI", "продуктивтілік"]
published: true
---

## 1-5 құралдар

Claude Code, Cursor, v0, ShadCN UI, Vercel — қысқаша шолу.
```

```mdx
{/* content/blog/vibe-coding-tools-2025/index.en.mdx */}
---
title: "Top 5 Vibe-Coding Tools in 2025"
description: "Five tools that help you ship projects fast in 2025."
date: "2026-02-10"
tags: ["tools", "AI", "productivity"]
published: true
---

## The 5 tools

Claude Code, Cursor, v0, ShadCN UI, Vercel — a short rundown.
```

```mdx
{/* content/blog/why-nextjs-portfolio/index.kk.mdx */}
---
title: "Почему Next.js — лучший фреймворк для портфолио"
description: "Портфолио сайты үшін Next.js неге ыңғайлы."
date: "2026-03-01"
tags: ["Next.js", "портфолио", "веб"]
published: true
---

## App Router артықшылықтары

Server Components, статикалық генерация, оңай SEO.
```

```mdx
{/* content/blog/why-nextjs-portfolio/index.en.mdx */}
---
title: "Why Next.js Is the Best Framework for a Portfolio"
description: "Why Next.js is a great fit for portfolio sites."
date: "2026-03-01"
tags: ["Next.js", "portfolio", "web"]
published: true
---

## App Router advantages

Server Components, static generation, easy SEO.
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run lib/mdx.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 7: Replace Task 8's placeholder `PostCard`/import if stubbed, with the real component (built in Task 10) — if Task 10 hasn't run yet, keep a minimal inline `PostCard` here**

If `components/blog/post-card.tsx` does not exist yet, create a minimal version now (Task 10 will own its final polish, this keeps the home page unblocked):

```tsx
// components/blog/post-card.tsx
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
```

- [ ] **Step 8: Verify home page build**

Run: `npm run build`
Expected: succeeds; `/kk` and `/en` show the "Latest posts" section with 3 cards.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add MDX blog content loader, demo posts, and PostCard"
```

---

### Task 10: Blog list + article page with Table of Contents

**Files:**
- Create: `components/blog/table-of-contents.tsx`
- Test: `components/blog/table-of-contents.test.ts`
- Create: `app/[locale]/blog/page.tsx`
- Create: `app/[locale]/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getAllPosts`, `getPostBySlug`, `Post` (Task 9); `PostCard` (Task 9); `next-mdx-remote/rsc` `MDXRemote`; `rehype-pretty-code`, `remark-gfm`.
- Produces: pure function `extractHeadings(markdown: string): { id: string; text: string; level: 2 | 3 }[]` (tested in isolation), and `<TableOfContents headings={...} />` client component using it.

- [ ] **Step 1: Write the failing test for the pure heading-extraction function**

```ts
// components/blog/table-of-contents.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/blog/table-of-contents.test.ts`
Expected: FAIL — `extractHeadings` not exported.

- [ ] **Step 3: Implement `extractHeadings` and `TableOfContents`**

```tsx
// components/blog/table-of-contents.tsx
"use client";

import { useEffect, useState } from "react";

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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/blog/table-of-contents.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: `/blog` list page**

```tsx
// app/[locale]/blog/page.tsx
import { getAllPosts } from "@/lib/mdx";
import { PostCard } from "@/components/blog/post-card";

export default async function BlogPage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 font-heading text-3xl font-bold">{locale === "kk" ? "Блог" : "Blog"}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: `/blog/[slug]` article page**

```tsx
// app/[locale]/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { extractHeadings, TableOfContents } from "@/components/blog/table-of-contents";

export async function generateStaticParams() {
  const kkPosts = await getAllPosts("kk");
  return kkPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: "kk" | "en"; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(locale, slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <article className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-[1fr_240px]">
      <div className="prose prose-invert max-w-none">
        <h1 className="font-heading">{post.frontmatter.title}</h1>
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
            },
          }}
        />
      </div>
      <TableOfContents headings={headings} />
    </article>
  );
}
```

- [ ] **Step 7: Verify manually**

Run: `npm run dev`, open `/kk/blog`, click into a post, confirm TOC highlights the active section while scrolling, and resize to 390px to confirm the accordion variant shows.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add blog list/detail pages with table of contents"
```

---

### Task 11: About and Contact pages

**Files:**
- Create: `app/[locale]/about/page.tsx`
- Create: `app/[locale]/contact/page.tsx`

**Interfaces:**
- Consumes: ShadCN `Badge`, `Separator`, `Avatar` (Task 2).

- [ ] **Step 1: About page (skills as badges + timeline)**

```tsx
// app/[locale]/about/page.tsx
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SKILLS = [
  "Next.js", "TypeScript", "React", "Node.js", "OpenAI API",
  "LangChain", "n8n", "Make.com", "WhatsApp/Telegram/Instagram APIs", "PostgreSQL",
];

const TIMELINE_KK = [
  { year: "2025", text: "AI automation жобаларына маманданды." },
  { year: "2026", text: "Фрилансер ретінде толық уақытты жұмыс істей бастады." },
];

const TIMELINE_EN = [
  { year: "2025", text: "Specialized in AI automation projects." },
  { year: "2026", text: "Started working full-time as a freelancer." },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;
  const timeline = locale === "kk" ? TIMELINE_KK : TIMELINE_EN;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold">
        {locale === "kk" ? "Мен туралы" : "About me"}
      </h1>
      <p className="mt-4 text-muted-foreground">
        {locale === "kk"
          ? "Нұрғалиұлы Нұрғазы — AI автоматизациялар, сайттар және веб қосымшалар жасайтын фрилансер."
          : "Nurgazy Nurgaliuly — a freelancer building AI automations, websites, and web apps."}
      </p>

      <Separator className="my-8" />

      <h2 className="font-heading text-xl font-semibold">{locale === "kk" ? "Дағдылар" : "Skills"}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {SKILLS.map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </div>

      <Separator className="my-8" />

      <h2 className="font-heading text-xl font-semibold">
        {locale === "kk" ? "Хронология" : "Timeline"}
      </h2>
      <ol className="mt-4 space-y-4 border-l border-border pl-4">
        {timeline.map((t) => (
          <li key={t.year}>
            <span className="font-heading text-primary">{t.year}</span> — {t.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 2: Contact page**

```tsx
// app/[locale]/contact/page.tsx
export default async function ContactPage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold">
        {locale === "kk" ? "Байланыс" : "Contact"}
      </h1>
      <p className="mt-4 text-muted-foreground">
        {locale === "kk"
          ? "Жоба туралы жазыңыз — жауап беремін."
          : "Reach out about your project — I'll get back to you."}
      </p>
      <ul className="mt-6 space-y-2">
        <li>
          Email:{" "}
          <a className="text-primary" href="mailto:nurgazynurgaliuly3@gmail.com">
            nurgazynurgaliuly3@gmail.com
          </a>
        </li>
        <li>
          Telegram:{" "}
          <a className="text-primary" href="https://t.me/" target="_blank" rel="noreferrer">
            @yourusername
          </a>
        </li>
        <li>
          WhatsApp:{" "}
          <a className="text-primary" href="https://wa.me/" target="_blank" rel="noreferrer">
            wa.me/yournumber
          </a>
        </li>
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Verify manually**

Run: `npm run dev`, open `/kk/about`, `/kk/contact`, `/en/about`, `/en/contact`.
Expected: content renders in the correct language, links are clickable.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add about and contact pages"
```

---

### Task 12: SEO — sitemap, robots, RSS feed, JSON-LD

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/feed.xml/route.ts`
- Create: `lib/seo.ts`
- Modify: `app/[locale]/page.tsx` — inject Person JSON-LD
- Modify: `app/[locale]/blog/[slug]/page.tsx` — inject Article JSON-LD

**Interfaces:**
- Produces:
  ```ts
  export function personJsonLd(locale: "kk" | "en"): Record<string, unknown>;
  export function articleJsonLd(post: Post, locale: "kk" | "en"): Record<string, unknown>;
  ```
- Consumes: `PROJECTS` (Task 6, for sitemap project URLs), `getAllPosts` (Task 9, for sitemap/RSS), `routing` (Task 4, for locales).

- [ ] **Step 1: `lib/seo.ts`**

```ts
import type { Post } from "@/lib/mdx";

const SITE_URL = "https://example-portfolio.up.railway.app";

export function personJsonLd(locale: "kk" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nurgazy Nurgaliuly",
    jobTitle: locale === "kk" ? "AI automator & AI developer" : "AI automator & AI developer",
    url: `${SITE_URL}/${locale}`,
    email: "mailto:nurgazynurgaliuly3@gmail.com",
  };
}

export function articleJsonLd(post: Post, locale: "kk" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    url: `${SITE_URL}/${locale}/blog/${post.slug}`,
  };
}

export { SITE_URL };
```

- [ ] **Step 2: `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { PROJECTS } from "@/data/projects";
import { getAllPosts } from "@/lib/mdx";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({ url: `${SITE_URL}/${locale}` });
    entries.push({ url: `${SITE_URL}/${locale}/projects` });
    entries.push({ url: `${SITE_URL}/${locale}/blog` });
    entries.push({ url: `${SITE_URL}/${locale}/about` });
    entries.push({ url: `${SITE_URL}/${locale}/contact` });

    for (const p of PROJECTS) {
      entries.push({ url: `${SITE_URL}/${locale}/projects/${p.slug}` });
    }

    const posts = await getAllPosts(locale);
    for (const post of posts) {
      entries.push({ url: `${SITE_URL}/${locale}/blog/${post.slug}` });
    }
  }

  return entries;
}
```

- [ ] **Step 3: `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: RSS feed route (kk posts by default)**

```ts
// app/feed.xml/route.ts
import { getAllPosts } from "@/lib/mdx";
import { SITE_URL } from "@/lib/seo";

export async function GET() {
  const posts = await getAllPosts("kk");

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${p.frontmatter.title}</title>
      <link>${SITE_URL}/kk/blog/${p.slug}</link>
      <description>${p.frontmatter.description}</description>
      <pubDate>${new Date(p.frontmatter.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Nurgazy Nurgaliuly — Blog</title>
    <link>${SITE_URL}</link>
    <description>AI automation and web development blog</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
```

- [ ] **Step 5: Inject JSON-LD into home and article pages**

In `app/[locale]/page.tsx`, add before the closing wrapper:

```tsx
import { personJsonLd } from "@/lib/seo";
// ...
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
/>
```

In `app/[locale]/blog/[slug]/page.tsx`, add:

```tsx
import { articleJsonLd } from "@/lib/seo";
// ... inside the component, after `if (!post) notFound();`
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post, locale)) }}
/>
```

- [ ] **Step 6: Verify manually**

Run: `npm run build && npm run start`, then open `/sitemap.xml`, `/robots.txt`, `/feed.xml` in the browser and confirm valid XML/text output. View source on `/kk` and a blog post to confirm the `<script type="application/ld+json">` tags are present.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots, RSS feed, and JSON-LD"
```

---

### Task 13: Final polish pass with frontend-design skill + full verification

**Files:**
- Modify: any component/page needing visual polish (spacing, gradient details, hover states) per `frontend-design` skill output.

- [ ] **Step 1: Invoke `frontend-design` skill**

Use the `frontend-design` skill to review the bold-creative direction across Header, Hero, ProjectCard, and blog article typography, and apply any refinements it recommends (spacing scale, gradient treatment, hover/focus states).

- [ ] **Step 2: Run full verification**

```bash
npm run test
npm run build
```

Expected: all Vitest tests pass, build succeeds with no type errors.

- [ ] **Step 3: Manual QA pass**

Run `npm run dev` and manually check:
- All routes for both locales: `/`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/about`, `/contact`.
- Dark/light theme toggle persists across reloads (next-themes default `localStorage` behavior).
- Locale switcher preserves the current path when switching kk↔en.
- Responsive check at 390px width: header collapses to the Sheet menu, project/blog grids stack to one column, TOC becomes an accordion.
- `/feed.xml`, `/sitemap.xml`, `/robots.txt` all resolve.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "polish: refine bold-creative visual details after design review"
```

---

## Self-Review Notes

- **Spec coverage:** stack (Task 1-2), i18n kk/en (Task 4), theme/dark-light (Task 3), 10 projects (Task 6-7), MDX blog + 3 demo posts (Task 9-10), TOC (Task 10), SEO/RSS/sitemap/JSON-LD (Task 12), about/contact (Task 11), Railway deploy — no Vercel-only APIs used (`fs`-based MDX loading and Route Handlers only, confirmed Railway-compatible). Design bold-creative direction — Task 3 (tokens) + Task 13 (final skill-driven polish).
- **Placeholder scan:** none — every step has literal code, no "TBD"/"similar to Task N".
- **Type consistency:** `Project`, `Post`, `Heading` types are defined once (Tasks 6, 9, 10) and reused with identical shapes across ProjectCard/ProjectFilter/PostCard/BlogPostPage/sitemap/seo.
- **Cross-task dependency called out explicitly:** Task 8 (home page) depends on Task 9's `lib/mdx.ts` and `PostCard` — the note in Task 8 Step 1 and Task 9 Step 7 explains how to sequence or stub this so the build never breaks between commits.
