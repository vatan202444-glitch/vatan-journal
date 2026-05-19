export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  specialization: string;
}

export const authors: Author[] = [
  {
    id: "1",
    name: "Абдулла Қодирий",
    avatar: "/images/authors/abdulla-qodiriy.jpg",
    bio: "Ўзбек адабиётининг таниқли вакили, роман ва ҳикоялар муаллифи.",
    specialization: "Адабиётшунослик"
  },
  {
    id: "2",
    name: "Содир Сафоев",
    avatar: "/images/authors/sodir-safoev.jpg",
    bio: "Тарих фанлари доктори, профессор, ўзбек тарихи бўйича эксперт.",
    specialization: "Тарих"
  },
  {
    id: "3",
    name: "Нигора Рахимова",
    avatar: "/images/authors/nigora-rahimova.jpg",
    bio: "Философия фанлари номзоди, маънавият ва маърифат масалалари бўйича тадқiqotчи.",
    specialization: "Философия"
  },
  {
    id: "4",
    name: "Бахтиёр Каримов",
    avatar: "/images/authors/baxtiyor-karimov.jpg",
    bio: "Иқтисод фанлари доктори, иқтисодиёт ва бизнес бўйича маслаҳатчи.",
    specialization: "Иқтисодиёт"
  },
  {
    id: "5",
    name: "Дилфуза Холматова",
    avatar: "/images/authors/dilfuza-xolmatova.jpg",
    bio: "Педагогика фанлари номзоди, таълим тизими тараққиёти бўйича эксперт.",
    specialization: "Педагогика"
  }
];
