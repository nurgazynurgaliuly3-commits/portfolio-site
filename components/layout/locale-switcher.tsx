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
