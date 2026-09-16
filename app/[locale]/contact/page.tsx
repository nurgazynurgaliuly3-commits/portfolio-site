export default async function ContactPage({ params }: { params: Promise<{ locale: "kk" | "en" }> }) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-xl px-4 py-14 md:py-20">
      <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em]">
        {locale === "kk" ? "Байланыс" : "Contact"}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {locale === "kk"
          ? "Жоба туралы жазыңыз — жауап беремін."
          : "Reach out about your project — I'll get back to you."}
      </p>
      <ul className="mt-8 space-y-3 text-[0.95rem]">
        <li>
          Email:{" "}
          <a className="font-medium underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-primary" href="mailto:nurgazynurgaliuly3@gmail.com">
            nurgazynurgaliuly3@gmail.com
          </a>
        </li>
      </ul>
    </div>
  );
}
