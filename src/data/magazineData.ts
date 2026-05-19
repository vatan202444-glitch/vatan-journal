// Types for Magazine Data
export interface Issue {
  id: string;
  title: string;
  slug: string;
  issueNumber: string;
  year: string;
  month: string;
  slogan: string;
  coverImage?: string;
  pdfUrl?: string;
  publishedDate: string;
  articleCount: number;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  excerpt: string;
  content: string;
  author: string;
  authorId?: string;
  date: string;
  readTime: number;
  issueId: string;
  featured?: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
}

// Magazine Issues Data
export const magazineIssues: Issue[] = [
  {
    id: "issue-2024-01",
    title: "VATAN 01/2024",
    slug: "vatan-2024-01",
    issueNumber: "01",
    year: "2024",
    month: "Январь",
    slogan: "Йўл бўшат, замона! Йўл бўшат, жаҳон! ЎЗБЕК КЕЛАЁТИР...",
    coverImage: "/images/issues/vatan-2024-01-cover.jpg",
    pdfUrl: "/pdf/vatan-2024-01.pdf",
    publishedDate: "2024-01-15",
    articleCount: 12,
    description: "Янги йилнинг биринчи сони. Ўзбекистоннинг истиқболли тараққиёти, илмий-маърифий ислоҳотлар ва миллий қадриятлар ҳақида мақолалар."
  },
  {
    id: "issue-2025-02",
    title: "VATAN 2025 йил 2-сон",
    slug: "vatan-2025-02",
    issueNumber: "02",
    year: "2025",
    month: "Февраль",
    slogan: "Маърифат йўлида: илм, маданият ва инсоний қадриятлар",
    coverImage: "/images/issues/vatan-2025-02-cover.jpg",
    pdfUrl: "/pdf/vatan-2025-02.pdf",
    publishedDate: "2025-02-20",
    articleCount: 10,
    description: "2025 йилнинг иккинчи сони. Маърифат, илм-фан ва замонавий тараққиёт масалаларига бағишланган."
  }
];

// Categories Data
export const magazineCategories: Category[] = [
  {
    id: "cat-economy",
    name: "Иқтисодий ислоҳот",
    slug: "iqtisodiy-ishlohot",
    description: "Ўзбекистоннинг иқтисодий ислоҳотлари, инвестиция муҳити ва тадбиркорликни ривожлантириш масалалари",
    articleCount: 1
  },
  {
    id: "cat-society",
    name: "Жамият",
    slug: "jamiyat",
    description: "Жамиятдаги ижтимоий-сиёсий жараёнлар, фикр-мулоҳазалар ва замонавий муаммолар",
    articleCount: 1
  },
  {
    id: "cat-linguistics",
    name: "Тилшунослик",
    slug: "tilshunoslik",
    description: "Ўзбек тили, адабиёт ва лингвистика бўйича илмий-тадқиқот мақолалари",
    articleCount: 1
  },
  {
    id: "cat-history",
    name: "Тарих",
    slug: "tarix",
    description: "Ўзбекистон ва Марказий Осиё тарихи, маданий мерос ва тарихий тадқиқотлар",
    articleCount: 2
  }
];

// Articles Data
export const magazineArticles: Article[] = [
  {
    id: "article-001",
    title: "Ўзбекистоннинг очилмаган конлари",
    slug: "ozbekistonnin-ochilmagan-konlari",
    category: "Иқтисодий ислоҳот",
    categorySlug: "iqtisodiy-ishlohot",
    excerpt: "Ўзбекистон табиий бойликларга бой бўлган бўлса-да, улардан тўла фойдалана олмаяпти. Қандай қилиб бу конларни очиш мумкин?",
    content: `Ўзбекистон табиий ресурсларга бой бўлган мамлакат. Республика ҳудудида 1800 дан зиёд кон-конструкциялар, шунингдек 2500 га яқин минерал-хом ашё базалари мавжуд. Бироқ улардан фойдаланиш самарадорлиги ҳали ҳам паст даражада.

Табиий ресурслардан тўла фойдаланмасликнинг асосий сабаблари:
- Эски технологиялар ва замонавий ечимларни жорий этмаслик
- Инвестицияларни жалб қилишдаги муаммolar
- Мутахассислар етишмовчилиги
- Инфратузилманинг ривожланмаганлиги

Мақолада бу масалаларнинг мураккаб таҳлили берилади ва истиқболли йўналишлар таклиф қилинади.`,
    author: "Дилшод Раҳимов",
    authorId: "author-001",
    date: "2024-01-10",
    readTime: 15,
    issueId: "issue-2024-01",
    featured: true,
    tags: ["иқтисод", "конлар", "ресурслар", "инвестиция"]
  },
  {
    id: "article-002",
    title: "Ўзбекчилик: Миллий ифтихорми ёки тараққиётга тўсиқ?",
    slug: "ozbekchilik-milliy-iftihormi-yoki-toraqqiyotga-tosiq",
    category: "Жамият",
    categorySlug: "jamiyat",
    excerpt: "Миллий гуруҳга тайналган шахсларнинг хатти-ҳаракатлари, уларнинг жамиятга таъсири ва бу ҳодисанинг ижтимоий-сиёсий моҳияти",
    content: `"Ўзбекчилик" тушунчаси охирги йилларда жамиятда кенг тарқалган. Бироқ бу тушунча орасида катта фарқлар мавжуд. Бири учун бу миллий ифтихор, бошқалари эса бу тараққиётга тўсиқ.

Мақолада тадқиқ қилинган асосий масалалар:
- Миллий гуруҳларнинг пайдо бўлиши сабаблари
- Уларнинг ижтимоий тармоқлардаги фаолияти
- Жамиятдаги этник толерантликка таъсири
- Давлат сиёсати ва миллий аҳамият

Муаллиф бу феноменни илмий ёқдан таҳлил қилиб, муаммоли томонларини кўрсатади.`,
    author: "Нодира Каримова",
    authorId: "author-002",
    date: "2024-01-12",
    readTime: 12,
    issueId: "issue-2024-01",
    featured: true,
    tags: ["жамият", "миллият", "толерантлик", "сотсиология"]
  },
  {
    id: "article-003",
    title: "Рус тилининг таъсири: ўзбек тилининг маданий захирасими ёки колониал хотира?",
    slug: "rus-tilining-tasiri-uzbek-tilining-madaniy-zaxirasimi-yoki-kolonial-xotira",
    category: "Тилшунослик",
    categorySlug: "tilshunoslik",
    excerpt: "Рус тили ўзбек тилига кирган сўзлар, уларнинг маданий аҳамияти ва колониал ўтмйш билан боглиқлиги ҳақида илмий тадқиқот",
    content: `Совет даврида рус тили ўзбек тилига миҳнатлаб кириб келди. Бу жараён натижасида ўзбек тили сўзлар боягини бойитди, бироқ бир қанча салбий оқибатларга ҳам олиб келди.

Мақолада кўриб чиқилган масалалар:
- Рус тилидан келган сўзларнинг семантик таҳлили
- Буларнинг замонавий ўзбек тилидаги функцияси
- Миллий тил сифатида ўзбек тилининг эволюцияси
- Тил сиёсати ва тил планировкаси

Лингвистик таҳлил натижалари кўрсатадики, бу жараён мураккаб ва кўп қиррали.`,
    author: "Анвар Исмоилов",
    authorId: "author-003",
    date: "2024-01-14",
    readTime: 18,
    issueId: "issue-2024-01",
    featured: false,
    tags: ["тил", "лингвистика", "рус тили", "колониализм"]
  },
  {
    id: "article-004",
    title: "Совет телеологияларидан холи фикрлаш: Марказий Осиё тарихини ўрганиш истиқболлари",
    slug: "sovet-teleologiyalardan-xoli-fikrlash-markaziy-osiyo-tarixini-orgonish-istiqbollari",
    category: "Тарих",
    categorySlug: "tarix",
    excerpt: "Совет даврида яратилган тарихий концепциялардан воз кечиш ва Марказий Осиё тарихини янги назардан кўрган ҳолда ўрганиш",
    content: `Совет даврида Марказий Осиё тарихи белгиланган шаблонлар доирасида ёзилган. Ушбу мақолада бу шаблонларнинг етишмовчиликлари ва улардан холи бўлган илмий ёндашувлар таклиф қилинади.

Тадқиқот мавзулари:
- Совет тарихнавислигидаги методологик хатоликлар
- Колониал таҳрифлар ва улардан соқлалиш
- Архивлардан фойдаланиш имкониятлари
- Халқаро тадқиқотлар тажрибаси

Янги методология тарихни объектив рӯйхатга олиш учун зарур.`,
    author: "Баҳодир Хон",
    authorId: "author-004",
    date: "2024-01-16",
    readTime: 20,
    issueId: "issue-2024-01",
    featured: true,
    tags: ["тарих", "совет", "марказий осиё", "архив"]
  },
  {
    id: "article-005",
    title: "Араб халифаси нега туркларнинг дўпписини кийган?",
    slug: "arab-xalifasi-nega-turklarning-doppisini-kiygan",
    category: "Тарих",
    categorySlug: "tarix",
    excerpt: "Аббосийлар халифаси ал-Муктазирнинг турк дўпписини кийиши ортидаги сиёсий ва маданий сабаблар",
    content: `Тарихий манбаларда Аббосийлар халифаси ал-Муктазир (908-932) туркларнинг дўпписини кийгани ҳақида ёзувлар мавжуд. Бу ҳодиса қандай сабабларга асосланган?

Мақолада таҳлил қилинган томонлар:
- Аббосийлар даврида туркларнинг ҳарбий-сийсий роли
- Халифа ва турк аскарлари ўртасидаги муносабатлар
- Дўппи сиёсий статус символи сифатида
- Маданий алмашинув ва интеграция жараёнлари

Тарихий тадқиқот натижалари олимлар учун қизиқарли бўлиши мумкин.`,
    author: "Саид Аҳмадов",
    authorId: "author-005",
    date: "2025-02-15",
    readTime: 14,
    issueId: "issue-2025-02",
    featured: true,
    tags: ["тарих", "араб", "турк", "халифа", "аббосийлар"]
  }
];

// Helper functions
export function getIssueById(id: string): Issue | undefined {
  return magazineIssues.find(issue => issue.id === id);
}

export function getArticleById(id: string): Article | undefined {
  return magazineArticles.find(article => article.id === id);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return magazineArticles.filter(article => article.categorySlug === categorySlug);
}

export function getArticlesByIssue(issueId: string): Article[] {
  return magazineArticles.filter(article => article.issueId === issueId);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return magazineCategories.find(cat => cat.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return magazineArticles.filter(article => article.featured);
}
