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
