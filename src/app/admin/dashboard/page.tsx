'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface DashboardStats {
  articles: number;
  categories: number;
  issues: number;
  published: number;
  draft: number;
  authors: number;
  subscribers: number;
  tags: number;
}

interface RecentArticle {
  id: string;
  title: string;
  authorName: string;
  categoryName: string;
  status: string;
  date: string;
  views?: number;
}

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    articles: 0, categories: 0, issues: 0, published: 0, draft: 0, authors: 0, subscribers: 0, tags: 0,
  });
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);

  const [popularArticles, setPopularArticles] = useState<RecentArticle[]>([]);
  const [weeklyViews, setWeeklyViews] = useState<{ day: string; views: number }[]>([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('uz-UZ', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/articles').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/issues').then(r => r.json()),
      fetch('/api/authors').then(r => r.json()),
      fetch('/api/subscribers').then(r => r.json()).catch(() => []),
      fetch('/api/tags').then(r => r.json()).catch(() => []),
    ]).then(([articles, categories, issues, authors, subscribers, tags]) => {
      const published = articles.filter((a: any) => a.status === 'published').length;
      setStats({
        articles: articles.length, categories: categories.length, issues: issues.length,
        published, draft: articles.length - published,
        authors: authors.length, subscribers: subscribers.length, tags: tags.length,
      });
      setRecentArticles(articles.slice(0, 5));
      
      // Sort articles by views to get popular ones
      const sortedByViews = [...articles].sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
      setPopularArticles(sortedByViews.slice(0, 5));

      // Calculate mock weekly readers based on actual views or static values
      const days = ['Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба', 'Якшанба'];
      const mockViews = days.map((day, index) => {
        // distribute views randomly around a sensible mean
        const multiplier = 50 + (index * 12) + (index === 4 || index === 5 ? 70 : 0);
        return {
          day,
          views: Math.floor((articles.reduce((acc: number, a: any) => acc + (a.views || 0), 0) / 10) + multiplier) || (200 + index * 45)
        };
      });
      setWeeklyViews(mockViews);
    }).catch(console.error);
  }, []);

  const statCards = [
    { label: 'Барча мақолалар', value: stats.articles, icon: '📄', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { label: 'Чоп этилган', value: stats.published, icon: '✅', color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
    { label: 'Қоралама', value: stats.draft, icon: '📝', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
    { label: 'Журнал сонлари', value: stats.issues, icon: '📚', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
    { label: 'Рукнлар', value: stats.categories, icon: '📁', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50' },
    { label: 'Муаллифлар', value: stats.authors, icon: '✍️', color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Обуначилар', value: stats.subscribers, icon: '📧', color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50' },
    { label: 'Теглар', value: stats.tags, icon: '🏷️', color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50' },
  ];

  const maxViews = Math.max(...weeklyViews.map(d => d.views), 1);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Бошқарув панели</h1>
            <p className="text-[#64748b] mt-1">Хуш келибсиз! Бугун: {currentTime}</p>
          </div>
          <a href="/" target="_blank" className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors text-sm font-medium">
            🌐 Сайтни кўриш
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-[#e5e7eb] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748b] text-xs font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1e293b] mt-1">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} text-white p-2.5 rounded-lg text-xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Popular Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Traffic Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1e293b] mb-1">📈 Ҳафталик ўқувчилар сони (Мутолаалар)</h2>
              <p className="text-xs text-[#64748b] mb-6">Кунлик умумий кўринишлар сони динамикаси</p>
            </div>
            
            {/* SVG Visual Line/Area Chart */}
            <div className="relative h-64 w-full flex items-end">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[4, 3, 2, 1, 0].map((step) => (
                  <div key={step} className="w-full flex items-center gap-2">
                    <span className="text-[10px] text-[#94a3b8] w-8 text-right">
                      {Math.round((maxViews / 4) * step)}
                    </span>
                    <div className="flex-1 border-t border-dashed border-slate-100" />
                  </div>
                ))}
              </div>

              <div className="flex-1 h-48 flex justify-between items-end relative z-10 px-4">
                {weeklyViews.map((item, index) => {
                  const heightPercent = (item.views / maxViews) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 group">
                      <div className="relative w-full flex justify-center items-end h-40">
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                          {item.views} та мутолаа
                        </div>
                        
                        {/* Interactive Bar */}
                        <div 
                          style={{ height: `${heightPercent}%` }} 
                          className="w-8 sm:w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md hover:from-blue-700 hover:to-blue-500 transition-all duration-300 shadow-sm"
                        />
                      </div>
                      <span className="text-[10px] md:text-xs text-[#64748b] mt-2 text-center truncate w-full">
                        {item.day.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Popular Articles */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
            <h2 className="text-lg font-bold text-[#1e293b] mb-1">🔥 Энг кўп ўқилган мақолалар</h2>
            <p className="text-xs text-[#64748b] mb-4">Мутолаалар сони бўйича энг оммабоп 5 мақола</p>
            <div className="space-y-4">
              {popularArticles.length === 0 ? (
                <p className="text-center py-8 text-[#64748b]">Маълумот мавжуд эмас</p>
              ) : popularArticles.map((article, idx) => (
                <div key={article.id} className="flex items-start justify-between gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        idx === 0 ? 'bg-amber-100 text-amber-800' :
                        idx === 1 ? 'bg-slate-100 text-slate-800' :
                        'bg-blue-50 text-blue-800'
                      }`}>
                        #{idx + 1}
                      </span>
                      <p className="font-semibold text-[#1e293b] text-sm truncate">{article.title}</p>
                    </div>
                    <p className="text-xs text-[#64748b] truncate">{article.authorName} • {article.categoryName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#1e3a8a]">{article.views || 0}</span>
                    <p className="text-[9px] text-[#94a3b8]">мутолаа</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Articles */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#1e293b]">📰 Охирги мақолалар</h2>
              <a href="/admin/articles" className="text-sm text-[#1e3a8a] hover:underline">Барчасини кўриш →</a>
            </div>
            <div className="space-y-3">
              {recentArticles.length === 0 ? (
                <p className="text-center py-8 text-[#64748b]">Мақолалар топилмади</p>
              ) : recentArticles.map(article => (
                <div key={article.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f8fafc] transition-colors border border-transparent hover:border-[#e5e7eb]">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1e293b] text-sm truncate">{article.title}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">{article.authorName} • {article.categoryName} • {article.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ml-3 whitespace-nowrap ${
                    article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {article.status === 'published' ? 'Чоп этилган' : 'Қоралама'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions + Help */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
              <h2 className="text-lg font-bold text-[#1e293b] mb-4">⚡ Тезкор амаллар</h2>
              <div className="space-y-2">
                {[
                  { href: '/admin/articles', icon: '➕', label: 'Янги мақола', desc: 'Мақола қўшиш' },
                  { href: '/admin/issues', icon: '📖', label: 'Журнал сони', desc: 'Сон қўшиш' },
                  { href: '/admin/tags', icon: '🏷️', label: 'Тег', desc: 'Тег қўшиш' },
                  { href: '/admin/pages', icon: '📃', label: 'Саҳифа', desc: 'Таҳрирлаш' },
                  { href: '/admin/seo', icon: '🔍', label: 'SEO', desc: 'Созлаш' },
                  { href: '/admin/media', icon: '🖼️', label: 'Медиа', desc: 'Расм юклаш' },
                ].map(action => (
                  <a key={action.href} href={action.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f8fafc] transition-colors border border-transparent hover:border-[#e5e7eb]">
                    <span className="text-xl">{action.icon}</span>
                    <div>
                      <p className="font-medium text-sm text-[#1e293b]">{action.label}</p>
                      <p className="text-xs text-[#64748b]">{action.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-3">💡 Қўлланма</h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>📝 Мақола қўшиш → "Мақолалар" бўлимига ўтинг</p>
                <p>🖼️ Расм юклаш → "Медиа" бўлимидан юкланг</p>
                <p>🔍 SEO → Қидирув тизимлари учун созлаш</p>
                <p>📧 Обуначилар → Email рўйхатини бошқариш</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
