'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import dynamic from 'next/dynamic';
import { adminFetch } from '@/lib/admin-api';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface PageData { id: string; title: string; content: string; }

const defaultPages: PageData[] = [
  { id: 'about', title: 'Журнал ҳақида', content: '' },
  { id: 'contact', title: 'Боғланиш', content: '' },
];

export default function AdminPages() {
  const [pages, setPages] = useState<PageData[]>(defaultPages);
  const [activePage, setActivePage] = useState<PageData>(defaultPages[0]);
  const [content, setContent] = useState(activePage.content);
  const [savedMsg, setSavedMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/pages')
      .then(res => res.json())
      .then((data: PageData[]) => {
        if (data && data.length > 0) {
          // Merge with defaults to ensure titles are correct if empty
          const merged = defaultPages.map(dp => {
            const found = data.find(p => p.id === dp.id);
            return found ? found : dp;
          });
          setPages(merged);
          setActivePage(merged[0]);
          setContent(merged[0].content);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePageSelect = (page: PageData) => {
    setActivePage(page);
    setContent(page.content);
  };

  const handleSave = async () => {
    try {
      const res = await adminFetch('/api/pages', {
        method: 'PUT',
        body: JSON.stringify({ id: activePage.id, title: activePage.title, content }),
      });
      if (res.ok) {
        setPages(pages.map(p => p.id === activePage.id ? { ...p, content } : p));
        setSavedMsg('✓ Саҳифа сақланди!');
        setTimeout(() => setSavedMsg(''), 3000);
      }
    } catch { alert('Сақлашда хатолик'); }
  };

  if (loading) return <AdminLayout><div className="p-8">Юкланмоқда...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Саҳифалар</h1>
            <p className="text-[#64748b] mt-1">Сайт саҳифаларини таҳрирлаш</p>
          </div>
          <div className="flex items-center gap-4">
            {savedMsg && <span className="text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">{savedMsg}</span>}
            <button onClick={handleSave} className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium">
              💾 Сақлаш
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Page List */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-4">
            <h3 className="font-semibold text-[#1e293b] mb-3">Саҳифалар</h3>
            <div className="space-y-2">
              {pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => handlePageSelect(page)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activePage.id === page.id ? 'bg-[#1e3a8a] text-white' : 'hover:bg-[#f8fafc] text-[#1e293b]'
                  }`}
                >
                  <p className="font-medium">{page.title}</p>
                  <p className={`text-xs ${activePage.id === page.id ? 'text-white/70' : 'text-[#64748b]'}`}>/{page.id}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-4">📃 {activePage.title}</h2>
            <RichTextEditor value={content} onChange={setContent} placeholder="Саҳифа контентини ёзинг..." />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
