'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import type { Article } from '@/lib/data';

function ArticlesContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then((data: Article[]) => {
        setArticles(data.filter((a) => a.status !== 'draft'));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const filtered = searchTerm
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : articles;

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-[#64748b]">
        Юкланмоқда...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-[#1e3a8a] font-serif mb-4 text-center">
          Мақолалар
        </h1>
        <p className="text-[#64748b] text-center mb-8 max-w-2xl mx-auto">
          Журналда чоп этилган барча мақолалар рўйхати
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Мақолаларни қидиринг..."
              className="w-full px-5 py-3 bg-white border border-[#e5e7eb] rounded-lg text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#1e3a8a] shadow-sm"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]"
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
          </div>
          {searchTerm && (
            <p className="text-sm text-[#64748b] mt-2 text-center">
              &ldquo;{searchTerm}&rdquo; бўйича {filtered.length} та натижа топилди
            </p>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#94a3b8] text-lg mb-4">Мақола топилмади</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#1e3a8a] hover:underline"
            >
              Барчасини кўрсатиш
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#1e3a8a]/10 text-[#1e3a8a] text-xs font-medium px-2.5 py-0.5 rounded">
                      {article.categoryName}
                    </span>
                    <span className="text-[#94a3b8] text-sm">{article.issueNumber}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1e293b] mb-3 hover:text-[#1e3a8a] transition-colors">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="text-[#64748b] mb-4 line-clamp-3">{article.summary}</p>
                  <div className="flex items-center justify-between text-sm text-[#94a3b8]">
                    <span className="font-medium text-[#475569]">{article.authorName}</span>
                    <span>{article.readTime} дақиқа ўқиш</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center text-[#64748b]">
          Юкланмоқда...
        </div>
      }
    >
      <ArticlesContent />
    </Suspense>
  );
}
