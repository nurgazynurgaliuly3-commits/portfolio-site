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
    <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
      <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em]">
        {locale === "kk" ? "Мен туралы" : "About me"}
      </h1>
      <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
        {locale === "kk"
          ? "Нұрғалиұлы Нұрғазы — AI автоматизациялар, сайттар және веб қосымшалар жасайтын фрилансер."
          : "Nurgazy Nurgaliuly — a freelancer building AI automations, websites, and web apps."}
      </p>

      <Separator className="my-12" />

      <h2 className="section-heading text-xl">{locale === "kk" ? "Дағдылар" : "Skills"}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {SKILLS.map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </div>

      <Separator className="my-12" />

      <h2 className="section-heading text-xl">
        {locale === "kk" ? "Хронология" : "Timeline"}
      </h2>
      <ol className="mt-6 space-y-5 border-l border-border pl-5">
        {timeline.map((t) => (
          <li key={t.year}>
            <span className="font-heading font-semibold text-primary">{t.year}</span>{" "}
            <span className="text-muted-foreground">{t.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
