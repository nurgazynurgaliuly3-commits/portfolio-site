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
