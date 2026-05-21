import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const serifFont = sansFont; // Use same font for serif

export const metadata: Metadata = {
  title: "VATAN - Маънавий-маърифий, илмий-оммабоп журнал",
  description: "Ўзбекистоннинг маънавий қадриятларини, илмий тадқиқотларини ва маданий меросини ёритувчи таниқли журнал",
};

import { UserProvider } from '@/contexts/UserContext';
import { readData } from '@/lib/storage';
import { categories as initialCategories, Category } from '@/data/categories';
import type { QuoteSettings } from '@/app/api/quote/route';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch dynamic categories to pass to Header
  const allCategories = readData<Category[]>('categories.json', initialCategories);
  // Pick top 4 categories for the header navigation
  const headerCategories = allCategories.slice(0, 4).map(c => ({ name: c.name, slug: c.slug }));

  // Fetch quote for header
  const defaultQuote: QuoteSettings = {
    text: 'Жаҳон илм-фани ва маданиятига улкан ҳисса қўшган ўзбек халқининг ўзига хос улфатлари...',
    author: 'Шавкат Мирзиёев',
  };
  const quote = readData<QuoteSettings>('quote.json', defaultQuote);

  return (
    <html
      lang="uz"
      className={`${serifFont.variable} ${sansFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <Header initialCategories={headerCategories} quote={quote} />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </UserProvider>
      </body>
    </html>
  );
}
