import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] text-[#faf9f6] shadow-lg border-b-4 border-[#d97706]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="text-4xl font-bold text-[#d97706] font-serif tracking-wider">VATAN</div>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-[#d97706] transition-colors font-medium">
              Бош саҳифа
            </Link>
            <Link href="/articles" className="hover:text-[#d97706] transition-colors font-medium">
              Мақолалар
            </Link>
            <Link href="/authors" className="hover:text-[#d97706] transition-colors font-medium">
              Муаллифлар
            </Link>
            <Link href="/archive" className="hover:text-[#d97706] transition-colors font-medium">
              Архив
            </Link>
            <Link href="/categories" className="hover:text-[#d97706] transition-colors font-medium">
              Рукнлар
            </Link>
          </nav>

          <button className="md:hidden text-2xl">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
