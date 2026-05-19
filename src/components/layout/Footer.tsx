import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-[#faf9f6] mt-auto border-t-4 border-[#d97706]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-[#d97706] mb-4 font-serif tracking-wider">VATAN</h3>
            <p className="text-[#cbd5e1] mb-4">
              Маънавий-маърифий, илмий-оммабоп журнал
            </p>
            <p className="text-[#94a3b8] text-sm">
              Ўзбекистоннинг маънавий қадриятларини, илмий тадқиқотларини 
              ва маданий меросини ёритувчи таниқли журнал.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#d97706]">Тезкор боғланиш</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#cbd5e1] hover:text-[#d97706] transition-colors">
                  Бош саҳифа
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-[#cbd5e1] hover:text-[#d97706] transition-colors">
                  Мақолалар
                </Link>
              </li>
              <li>
                <Link href="/authors" className="text-[#cbd5e1] hover:text-[#d97706] transition-colors">
                  Муаллифлар
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-[#cbd5e1] hover:text-[#d97706] transition-colors">
                  Архив
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#d97706]">Биз ҳақимизда</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-[#cbd5e1] hover:text-[#d97706] transition-colors">
                  Журнал ҳақида
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#cbd5e1] hover:text-[#d97706] transition-colors">
                  Алоқа
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-[#cbd5e1] hover:text-[#d97706] transition-colors">
                  Рукнлар
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#334155] mt-8 pt-8 text-center text-[#94a3b8]">
          <p>© {new Date().getFullYear()} VATAN Журнали. Барча ҳуқуқлар ҳимоя қилинган.</p>
        </div>
      </div>
    </footer>
  );
}
