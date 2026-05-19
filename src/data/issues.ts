export interface Issue {
  id: string;
  issueNumber: string;
  date: string;
  year: string;
  title: string;
  coverImage: string;
  pdfUrl: string;
  description: string;
  articleCount: number;
  featured?: boolean;
}

export const issues: Issue[] = [
  {
    id: "1",
    issueNumber: "01",
    date: "2024-01-15",
    year: "2024",
    title: "Йўл бўшат, замона! Йўл бўшат, жаҳон!",
    coverImage: "/images/issues/issue-01-2024.jpg",
    pdfUrl: "/pdf/vatan-01-2024.pdf",
    description: "Бу сонда Ўзбекистоннинг тараққиёти ва маънавий қадриятлари ҳақида мақолалар тўпланган.",
    articleCount: 12,
    featured: true,
  },
  {
    id: "2",
    issueNumber: "02",
    date: "2024-02-15",
    year: "2024",
    title: "Маънавият тараққиёти ва замонавий қадриятлар",
    coverImage: "/images/issues/issue-02-2024.jpg",
    pdfUrl: "/pdf/vatan-02-2024.pdf",
    description: "Маънавиятни ривожлантириш ва замонавий қадриятларни асраш масалалари.",
    articleCount: 10
  },
  {
    id: "3",
    issueNumber: "03",
    date: "2024-03-15",
    year: "2024",
    title: "Илм ва маърифат - халқарвий тараққиёт асоси",
    coverImage: "/images/issues/issue-03-2024.jpg",
    pdfUrl: "/pdf/vatan-03-2024.pdf",
    description: "Илмий тадқиқотлар ва маърифат тизимининг ривожланиши.",
    articleCount: 14
  },
  {
    id: "4",
    issueNumber: "04",
    date: "2024-04-15",
    year: "2024",
    title: "Тарих ва хотира",
    coverImage: "/images/issues/issue-04-2024.jpg",
    pdfUrl: "/pdf/vatan-04-2024.pdf",
    description: "Ўзбек халқининг қадимий тарихи ва хотиралар.",
    articleCount: 11
  },
  {
    id: "5",
    issueNumber: "05",
    date: "2024-05-15",
    year: "2024",
    title: "Маданият ва санъат",
    coverImage: "/images/issues/issue-05-2024.jpg",
    pdfUrl: "/pdf/vatan-05-2024.pdf",
    description: "Миллий маданият ва санъатнинг замонавий ривожи.",
    articleCount: 13
  },
  {
    id: "6",
    issueNumber: "06",
    date: "2024-06-15",
    year: "2024",
    title: "Ёшлар ва келажак",
    coverImage: "/images/issues/issue-06-2024.jpg",
    pdfUrl: "/pdf/vatan-06-2024.pdf",
    description: "Ёшларни тарбиялаш ва келажакка тайёрлаш масалалари.",
    articleCount: 9
  }
];
