'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  { href: '/admin/dashboard', label: 'Бошқарув панели', icon: '📊' },
  { href: '/admin/homepage', label: 'Бош саҳифа', icon: '🏠' },
  { href: '/admin/quote', label: 'Иқтибос', icon: '💬' },
  { href: '/admin/articles', label: 'Мақолалар', icon: '📄' },
  { href: '/admin/articles/new', label: 'Янги мақола', icon: '➕' },
  { href: '/admin/authors', label: 'Муаллифлар', icon: '✍️' },
  { href: '/admin/categories', label: 'Рукнлар', icon: '📁' },
  { href: '/admin/issues', label: 'Журнал сонлари', icon: '📚' },
  { href: '/admin/tags', label: 'Теглар', icon: '🏷️' },
  { href: '/admin/pages', label: 'Саҳифалар', icon: '📃' },
  { href: '/admin/media', label: 'Медиа', icon: '🖼️' },
  { href: '/admin/seo', label: 'SEO', icon: '🔍' },
  { href: '/admin/subscribers', label: 'Обуначилар', icon: '📧' },
  { href: '/admin/payments', label: 'Тўловлар', icon: '💳' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-[#1e3a8a] text-xl font-semibold">Юкланмоқда...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside 
        className={`bg-[#1e3a8a] text-white transition-all duration-300 flex flex-col h-screen sticky top-0 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <span className="text-3xl font-extrabold font-serif text-[#fbbf24]">V</span>
            {isSidebarOpen && (
              <div>
                <span className="text-xl font-bold font-serif">VATAN</span>
                <p className="text-xs text-white/60">Админ панель</p>
              </div>
            )}
          </Link>
        </div>

        {/* Menu - scrollable */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                pathname === item.href 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white transition-colors"
          >
            <span>🏠</span>
            {isSidebarOpen && <span className="font-medium text-sm">Сайтга қайтиш</span>}
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-red-300 transition-colors w-full mt-1"
          >
            <span>🚪</span>
            {isSidebarOpen && <span className="font-medium text-sm">Чиқиш</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-[#64748b] hover:text-[#1e3a8a] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-[#64748b] text-sm">
              👤 Администратор
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
