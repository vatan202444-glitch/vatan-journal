'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import type { Article, Issue, HomepageSettings } from '@/lib/data';
import IssueCover from '@/components/ui/IssueCover';
import Image from 'next/image';

const NAV_CATEGORIES = [
  { name: 'Иқтисодиёт', slug: 'iqtisodiyot' },
  { name: 'Тарих', slug: 'tarix' },
  { name: 'Жамият', slug: 'jamiyat' },
  { name: 'Маданият', slug: 'madaniyat' },
];

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [journalIssues, setJournalIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubStatus('loading');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setSubStatus('success');
        setEmail('');
        setTimeout(() => setSubStatus(''), 3000);
      } else {
        setSubStatus('error');
      }
    } catch {
      setSubStatus('error');
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/homepage').then((r) => r.json()),
      fetch('/api/articles').then((r) => r.json()),
      fetch('/api/issues').then((r) => r.json()),
    ])
      .then(([homepage, arts, iss]) => {
        setSettings(homepage);
        setArticles((arts as Article[]).filter((a) => a.status !== 'draft'));
        setJournalIssues(iss);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cover = settings?.cover ?? {
    type: 'css' as const,
    imageUrl: '',
    year: '2024',
    issueNumber: '01',
    subtitle: 'Нишона сон',
    badge: 'Нишона сон',
    badgeColor: '#b45309',
  };

  const featuredArticle = useMemo(() => {
    const id = settings?.featuredArticleId ?? 'article-002';
    return (
      articles.find((a) => a.id === id) ??
      articles.find((a) => a.featured) ??
      articles[0]
    );
  }, [articles, settings]);

  const featuredIssue = journalIssues.find((i) => i.featured) ?? journalIssues[0];

  const categories = NAV_CATEGORIES.map((cat) => ({
    ...cat,
    count: articles.filter((a) => a.categorySlug === cat.slug).length,
  }));

  const displayArticles = (activeCategory
    ? articles.filter((a) => a.categorySlug === activeCategory)
    : articles
  ).slice(0, 6);

  const archivePreview = journalIssues.slice(0, 4);

  if (loading || !featuredArticle) {
    return (
      
        <div className="min-h-[60vh] flex items-center justify-center text-[#64748b]">
          Юкланмоқда...
        </div>
      
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      {/* HERO SECTION - Journal Cover Style */}
      <section className="relative min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#fcfbf7] to-[#f1f5f9] flex items-center overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#1e3a8a]/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#b45309]/5 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* LEFT - Journal Cover */}
            <div className="relative">
              <div className="relative max-w-md mx-auto">
                {/* Journal Cover - Priority: admin cover > featured issue > default */}
                {cover.type === 'image' && cover.imageUrl ? (
                  <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-2xl shadow-[#1e3a8a]/20 border border-[#e5e7eb]">
                    <Image
                      src={cover.imageUrl}
                      alt={`VATAN ${cover.year} йил ${cover.issueNumber}-сон`}
                      fill
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                ) : featuredIssue?.coverImage ? (
                  <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-2xl shadow-[#1e3a8a]/20 border border-[#e5e7eb]">
                    <IssueCover
                      coverImage={featuredIssue.coverImage}
                      year={featuredIssue.year}
                      issueNumber={featuredIssue.issueNumber}
                      title={featuredIssue.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-[3/4] bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#1e3a8a] rounded-lg overflow-hidden shadow-2xl shadow-[#1e3a8a]/30 border border-[#1e3a8a]/30">
                    {/* Header */}
                    <div className="absolute top-6 left-0 right-0 text-center">
                      <p className="text-white/80 text-[11px] tracking-[0.3em] uppercase font-medium">
                        Маънавий-маърифий, илмий-оммабоп журнал
                      </p>
                      <h2 className="text-6xl md:text-7xl font-extrabold text-[#fbbf24] font-serif tracking-[0.1em] mt-3">
                        VATAN
                      </h2>
                      <p className="text-white/70 text-base mt-2 font-medium">{cover.year}/{cover.issueNumber.padStart(2, '0')}</p>
                    </div>
                    
                    {/* Center Quote */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 px-6">
                      <p className="text-white text-center text-sm font-medium leading-relaxed italic">
                        "Йўл бўшат, замона!<br/>Йўл бўшат, жаҳон!"
                      </p>
                      <div className="w-16 h-0.5 bg-[#fbbf24] mx-auto my-4"></div>
                      <p className="text-[#fbbf24] text-center text-3xl font-extrabold font-serif">
                        ЎЗБЕК<br/>КЕЛАЁТИР...
                      </p>
                    </div>
                    
                    {/* Footer */}
                    <div className="absolute bottom-6 left-0 right-0 px-6 text-center">
                      <div className="w-12 h-0.5 bg-[#fbbf24] mx-auto mb-3"></div>
                      <p className="text-white/60 text-xs">
                        Ijtimoiy-siyosiy, ilmiy-ma'rifiy jurnal
                      </p>
                    </div>
                    
                    {/* Decorative corners */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#fbbf24]/50"></div>
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#fbbf24]/50"></div>
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#fbbf24]/50"></div>
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#fbbf24]/50"></div>
                  </div>
                )}
                
                {/* Floating badge */}
                <div 
                  className="absolute -top-4 -right-4 text-white px-4 py-2 rounded-lg shadow-lg"
                  style={{ backgroundColor: cover.badgeColor }}
                >
                  <p className="text-sm font-bold">{cover.badge}</p>
                </div>
                
                {/* Shadow effect */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-[#1e3a8a]/10 blur-xl rounded-full"></div>
              </div>
            </div>
            
            {/* RIGHT - Featured Article */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a8a]/10 border border-[#1e3a8a]/30 rounded mb-6">
                  <span className="w-2 h-2 bg-[#1e3a8a] rounded-full animate-pulse"></span>
                  <span className="text-[#1e3a8a] text-xs tracking-[0.2em] uppercase font-medium">
                    Муҳим мақола
                  </span>
                </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e293b] font-serif leading-tight mb-6">
                {featuredArticle.title}
              </h1>
              
              <div className="flex items-center justify-center lg:justify-start gap-6 mb-6 text-sm">
                <span className="text-[#b45309] border border-[#b45309]/30 px-3 py-1 rounded">{featuredArticle.categoryName}</span>
                <span className="text-[#64748b]">{featuredArticle.authorName}</span>
                <span className="text-[#64748b]">{featuredArticle.readTime} дақ</span>
              </div>
              
              <p className="text-lg text-[#475569] leading-loose mb-8 max-w-xl mx-auto lg:mx-0 font-medium">
                {featuredArticle.summary}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href={`/articles/${featuredArticle.slug}`}
                  className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-lg font-semibold text-sm uppercase tracking-widest transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #b45309 100%)',
                    backgroundSize: '200% 100%',
                    color: '#fff',
                    padding: '14px 32px',
                    boxShadow: '0 4px 20px rgba(180,83,9,0.35)',
                  }}
                >
                  {/* Shine effect */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
                  />
                  {/* Book icon */}
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Мақолани ўқиш</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES GRID BY CATEGORY */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#b45309] text-sm tracking-[0.3em] uppercase mb-4 font-semibold">Барча мақолалар</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1e3a8a] font-serif mb-4">Рукнлар бўйича</h2>
            <div className="w-24 h-1 bg-[#1e3a8a] mx-auto"></div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button type="button" onClick={() => setActiveCategory(null)} className={`px-6 py-2 border rounded font-semibold ${!activeCategory ? 'border-[#1e3a8a] text-[#1e3a8a] bg-[#1e3a8a]/5' : 'border-[#1e3a8a]/30 text-[#64748b]'}`}>Барчаси</button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-6 py-2 border rounded font-semibold transition-all ${activeCategory === cat.slug ? 'border-[#1e3a8a] text-[#1e3a8a] bg-[#1e3a8a]/5' : 'border-[#1e3a8a]/30 text-[#64748b] hover:border-[#1e3a8a] hover:text-[#1e3a8a]'}`}
              >
                {cat.name}
                <span className="ml-2 text-[#94a3b8] font-medium">({cat.count})</span>
              </button>
            ))}
          </div>
          
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.map((article) => (
              <article 
                key={article.id}
                className="group relative"
                onMouseEnter={() => setHoveredCard(article.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link href={`/articles/${article.slug}`}>
                  <div className={`relative bg-white border border-[#e5e7eb] p-6 transition-all duration-500 h-full flex flex-col shadow-sm ${hoveredCard === article.id ? 'border-[#1e3a8a]/30 -translate-y-2 shadow-lg' : ''}`}>
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs tracking-widest uppercase px-3 py-1 border rounded transition-colors duration-300 ${hoveredCard === article.id ? 'border-[#b45309] text-[#b45309]' : 'border-[#e5e7eb] text-[#64748b]'}`}>
                        {article.categoryName}
                      </span>
                      <span className="text-[#94a3b8] text-xs">{article.readTime} дақ</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className={`text-xl font-bold font-serif mb-4 transition-colors duration-300 ${hoveredCard === article.id ? 'text-[#1e3a8a]' : 'text-[#1e293b]'}`}>
                      {article.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-[#64748b] text-base leading-loose mb-6 flex-grow line-clamp-3 font-medium">
                      {article.summary}
                    </p>
                    
                    {/* Author & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#e5e7eb]">
                      <span className="text-[#64748b] text-sm font-semibold">{article.authorName}</span>
                      <span className={`text-sm font-semibold transition-colors duration-300 ${hoveredCard === article.id ? 'text-[#1e3a8a]' : 'text-[#64748b]'}`}>
                        Батафсил →
                      </span>
                    </div>
                    
                    {/* Corner decorations on hover */}
                    <div className={`absolute top-0 right-0 w-6 h-6 border-t border-r transition-all duration-300 ${hoveredCard === article.id ? 'border-[#1e3a8a]/30' : 'border-transparent'}`}></div>
                    <div className={`absolute bottom-0 left-0 w-6 h-6 border-b border-l transition-all duration-300 ${hoveredCard === article.id ? 'border-[#1e3a8a]/30' : 'border-transparent'}`}></div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/articles"
              className="inline-block border-2 border-[#1e3a8a] text-[#1e3a8a] px-12 py-4 hover:bg-[#1e3a8a] hover:text-white transition-all duration-300 tracking-wide uppercase text-sm font-semibold rounded"
            >
              Барча мақолалар
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST ISSUES PREVIEW */}
      <section className="py-24 bg-[#f8fafc] border-t border-[#e5e7eb]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#b45309] text-sm tracking-[0.3em] uppercase mb-4">Архив</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] font-serif mb-4">Журнал сонлари</h2>
            <div className="w-24 h-0.5 bg-[#1e3a8a] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {archivePreview.map((issue) => (
              <Link key={issue.id} href="/archive" className="group">
                <div className="relative aspect-[3/4] bg-white border border-[#e5e7eb] hover:border-[#1e3a8a]/30 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-lg">
                  <IssueCover
                    coverImage={issue.coverImage}
                    year={issue.year}
                    issueNumber={issue.issueNumber}
                    title={issue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#1e3a8a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                    <p className="text-[#fbbf24] text-xs tracking-widest uppercase">VATAN</p>
                    <p className="text-lg font-serif font-semibold">
                      {issue.issueNumber}/{issue.year}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-[#b45309] text-sm tracking-[0.3em] uppercase mb-4">Обуна</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] font-serif mb-4">
            Журналга обуна бўлинг
          </h2>
          <p className="text-[#64748b] mb-8">
            Янги сонлар ва мақолалар чоп этилганда бевосита почта жўнатмаларини қабул қилинг
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="flex-1 px-6 py-4 bg-[#f8fafc] border border-[#e5e7eb] text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#1e3a8a] transition-colors rounded"
            />
            <button
              type="submit"
              disabled={subStatus === 'loading'}
              className="bg-[#1e3a8a] text-white px-8 py-4 font-semibold hover:bg-[#1e40af] transition-colors tracking-wide uppercase text-sm rounded disabled:opacity-70"
            >
              {subStatus === 'loading' ? 'Кутинг...' : 'Обуна бўлиш'}
            </button>
          </form>
          {subStatus === 'success' && (
            <p className="mt-4 text-green-600 font-medium">✓ Муваффақиятли обуна бўлдингиз!</p>
          )}
          {subStatus === 'error' && (
            <p className="mt-4 text-red-600 font-medium">Хатолик юз берди ёки сиз аллақачон обуна бўлгансиз.</p>
          )}
        </div>
      </section>
    </div>
  );
}
