# Портфолио сайты — дизайн спецификациясы

Дата: 2026-09-16
Автор: Нұрғалиұлы Нұрғазы (фрилансер — AI automator & AI developer)

## Мақсаты

AI автоматизациялар мен веб-қосымшалар жасайтын фрилансер үшін портфолио + блог сайты. Сайт 10 демо/showcase жобаны (чатботтар, автоматизациялар, сайттар) көрсетеді, MDX блогы бар, kk/en тілдерін қолдайды, Railway-ге деплойланады.

## Стек

- Next.js 14+ (App Router), TypeScript
- Tailwind CSS + ShadCN UI (button, card, badge, separator, tabs, avatar, navigation-menu, sheet)
- next-intl — `/kk` және `/en` locale routing
- next-mdx-remote + gray-matter + rehype-pretty-code + remark-gfm — MDX блог
- next-themes — dark/light (негізгі тема: dark, bold creative бағытқа сай)
- Railway — деплой

## Дизайн бағыты (Bold creative)

- **Түстер:** қара негіз фон (`#0a0a0a` шамасында), ашық мәтін, акцент түс — orange/coral (`#ff5a36` шамасында, gradient нұсқасы `#ff5a36 → #ff8a3d`). Light темада ақ фон + сол акцент.
- **Типографика:** акцент шрифт — үлкен hero тақырыптары үшін geometric sans (мыс. Space Grotesk, Google Fonts арқылы), body мәтін үшін нейтрал sans (Inter). Үлкен, батыл өлшемдер hero-да.
- **Layout:** асимметриялық hero (мәтін сол жақта, декоративті градиент/фигура оң жақта), карточкаларда hover-де жеңіл scale/glow анимациясы.
- Толық token-дар мен компонент детальдары іске асыру сессиясында `frontend-design` скилі арқылы бекітіледі — бұл спец тек бағытты фиксациялайды.

## Деректер моделі

`data/projects.ts` — 10 жоба объектісі:

```ts
type Project = {
  slug: string;
  title: { kk: string; en: string };
  summary: { kk: string; en: string };
  role: "automation" | "development" | "both";
  stack: string[];
  outcome: { kk: string; en: string };
  featured: boolean;
};
```

10 жоба (қысқаша): WhatsApp AI сатылым-боты, Instagram Direct автожауап-боты, Telegram AI консультант-бот (RAG), TikTok comment-to-DM automation, SaaS лендинг сайты, mini e-commerce, AI сайт-скрейпер + дашборд, құжат→Sheets автоматтандыру агенті, AI CRM-инсайт дашборды, ендірілетін AI чат-виджет.

Блог мақалалары: `content/blog/<slug>/index.kk.mdx` және `index.en.mdx`, frontmatter: title, description, date, tags, image, published.

## Маршруттар (әр locale астында: `/kk/...`, `/en/...`)

- `/` — Hero, Featured projects (3-4), соңғы блог посттары
- `/projects` — 10 жобаның grid, стек бойынша фильтр (client-side)
- `/projects/[slug]` — жоба деталі: проблема → шешім → стек → нәтиже
- `/blog`, `/blog/[slug]` — MDX блог, TableOfContents (Intersection Observer, sticky desktop / аккордеон mobile)
- `/about` — дағдылар (badge/progress), таймлайн
- `/contact` — байланыс сілтемелері (email, Telegram, WhatsApp) + қарапайым форма (mailto немесе сыртқы форма сервисі)

## SEO / инфра

- `/feed.xml` (RSS, локальсіз немесе locale-бойынша)
- Динамикалық `sitemap.xml` (барлық locale+бет)
- `robots.txt`
- JSON-LD: Person (главная), Article (мақала беттерінде)
- `<link rel="alternate" hreflang>` locale-дар үшін

## Тестілеу/верификация

- `npm run dev` — барлық маршруттарды (kk/en) қолмен шолу
- `npm run build` — қатесіз өту
- Light/dark тема ауысуы
- 390px ені бойынша responsive тексеру
- `/feed.xml`, `/sitemap.xml` дұрыс генерацияланғанын тексеру

## Ауқымнан тыс (осы кезеңде жасалмайды)

- Нақты backend/CMS интеграциясы (деректер статикалық TS/MDX түрінде)
- Нақты чатбот демолары (тек кейс сипаттамасы, тірі демо емес)
- Аутентификация/админ панель
