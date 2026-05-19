'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

interface HeaderProps {
  initialCategories?: { name: string, slug: string }[];
  quote?: { text: string, author: string };
}

export default function Header({ initialCategories = [], quote }: HeaderProps) {
  const { user, loading } = useUser();
  const [categories] = useState(initialCategories);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check local storage or system preference on mount
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/articles?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white text-[#1e293b] border-b border-[#e5e7eb] shadow-sm">
      {/* Top Quote Bar */}
      <div className="bg-[#f8fafc] border-b border-[#e5e7eb] py-2 px-4">
        <div className="container mx-auto text-center">
          <p className="text-xs md:text-sm text-[#64748b] italic font-serif max-w-4xl mx-auto">
            &ldquo;{quote?.text || 'Жаҳон илм-фани ва маданиятига улкан ҳисса қўшган ўзбек халқининг ўзига хос улфатлари...'}&rdquo;
            <span className="text-[#1e3a8a] not-italic font-medium ml-2">— {quote?.author || 'Шавкат Мирзиёев'}</span>
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col group">
            <span className="text-3xl md:text-4xl font-bold text-[#1e3a8a] font-serif tracking-[0.2em] group-hover:text-[#b45309] transition-colors">
              VATAN
            </span>
            <span className="text-[11px] text-[#64748b] tracking-[0.25em] uppercase mt-1">
              Ijtimoiy-siyosiy, ilmiy-ma&apos;rifiy jurnal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="text-[#475569] hover:text-[#1e3a8a] transition-colors text-base uppercase tracking-[0.12em] font-semibold"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search & User & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-[#64748b] hover:text-[#1e3a8a] transition-colors rounded-full hover:bg-[#f8fafc]"
              aria-label="Тунги режим"
              title="Тунги/Кундузги режим"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* User Button */}
            {!loading && (
              <Link
                href={user ? "/profile" : "/login"}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${user
                    ? 'border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#f8fafc] shadow-sm'
                    : 'border-transparent bg-[#1e3a8a] text-white hover:bg-[#1e40af] hover:shadow-md'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden md:inline">{user ? user.name : 'Кириш'}</span>
              </Link>
            )}

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#64748b] hover:text-[#1e3a8a] transition-colors"
              aria-label="Қидириш"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#64748b] hover:text-[#1e3a8a] transition-colors"
              aria-label="Меню"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 pb-2 animate-fadeIn border-t border-[#e5e7eb] pt-4">
            <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Мақолаларни қидиринг..."
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e5e7eb] text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#1e3a8a] text-sm rounded"
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#1e3a8a]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#e5e7eb] bg-[#f8fafc]">
          <nav className="container mx-auto px-4 py-6 space-y-1">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 text-[#475569] hover:text-[#1e3a8a] transition-colors text-base uppercase tracking-[0.12em] font-semibold border-b border-[#e5e7eb] last:border-0"
              >
                {category.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-[#e5e7eb] space-y-3">
              <Link href="/articles" onClick={() => setIsMenuOpen(false)} className="block py-2 text-[#64748b] hover:text-[#1e3a8a] transition-colors text-sm">
                Барча мақолалар
              </Link>

              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block py-2 text-[#64748b] hover:text-[#1e3a8a] transition-colors text-sm">
                Журнал ҳақида
              </Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2 text-[#64748b] hover:text-[#1e3a8a] transition-colors text-sm">
                Алоқа
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
