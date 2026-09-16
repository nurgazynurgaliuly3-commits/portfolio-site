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
      kk: "Каталог, sebет және checkout ағынымен шағын интернет-дүкен.",
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
