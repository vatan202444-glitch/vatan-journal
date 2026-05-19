'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin-api';

interface SeoData {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  favicon: string;
  googleAnalytics: string;
  robots: string;
}

const defaultSeo: SeoData = {
  title: 'VATAN — Илмий-маърифий журнал',
  description: 'Ўзбекистоннинг илмий-маърифий журнали. Иқтисодиёт, тарих, жамият, маданият ва тилшунослик бўйича илмий мақолалар.',
  keywords: 'vatan, журнал, илмий, маърифий, ўзбекистон, мақолалар',
  ogImage: '',
  favicon: '/favicon.ico',
  googleAnalytics: '',
  robots: 'index, follow',
};

export default function AdminSeo() {
  const [seo, setSeo] = useState<SeoData>(defaultSeo);
  const [savedMsg, setSavedMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'analytics'>('general');

  useEffect(() => {
    fetch('/api/seo').then(r => r.json()).then(data => setSeo({ ...defaultSeo, ...data })).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      const res = await adminFetch('/api/seo', { method: 'PUT', body: JSON.stringify(seo) });
      if (res.ok) {
        setSavedMsg('✓ SEO созламалар сақланди!');
        setTimeout(() => setSavedMsg(''), 3000);
      }
    } catch { alert('Сақлашда хатолик'); }
  };

  const tabs = [
    { id: 'general' as const, label: 'Асосий', icon: '🌐' },
    { id: 'social' as const, label: 'Ижтимоий', icon: '📱' },
    { id: 'analytics' as const, label: 'Аналитика', icon: '📈' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">SEO бошқаруви</h1>
            <p className="text-[#64748b] mt-1">Қидирув тизимларида кўринишни бошқариш</p>
          </div>
          <div className="flex items-center gap-4">
            {savedMsg && <span className="text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">{savedMsg}</span>}
            <button onClick={handleSave} className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium">
              💾 Сақлаш
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#e5e7eb]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-[#1e3a8a] text-[#1e3a8a]' : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Сайт сарлавҳаси (Title Tag)</label>
                <input type="text" value={seo.title} onChange={e => setSeo({...seo, title: e.target.value})} className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" />
                <p className="text-xs text-[#94a3b8] mt-1">{seo.title.length}/60 белги (тавсия: 50-60)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Тавсиф (Meta Description)</label>
                <textarea value={seo.description} onChange={e => setSeo({...seo, description: e.target.value})} className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] h-24" />
                <p className="text-xs text-[#94a3b8] mt-1">{seo.description.length}/160 белги (тавсия: 120-160)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Калит сўзлар (Keywords)</label>
                <input type="text" value={seo.keywords} onChange={e => setSeo({...seo, keywords: e.target.value})} className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" placeholder="калит, сўзлар, вергул, билан" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Robots мета</label>
                <select value={seo.robots} onChange={e => setSeo({...seo, robots: e.target.value})} className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]">
                  <option value="index, follow">index, follow (тавсия)</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>

              {/* SEO Preview */}
              <div className="mt-6 p-4 bg-[#f8fafc] rounded-lg border border-[#e5e7eb]">
                <p className="text-xs text-[#94a3b8] mb-2">Google да кўриниш:</p>
                <div className="max-w-lg">
                  <p className="text-[#1a0dab] text-lg hover:underline cursor-pointer">{seo.title || 'Сайт сарлавҳаси'}</p>
                  <p className="text-[#006621] text-sm">https://vatanjournal.uz</p>
                  <p className="text-[#545454] text-sm mt-1">{seo.description || 'Сайт тавсифи бу ерда кўринади...'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">OG тасвир (Open Graph Image URL)</label>
                <input type="text" value={seo.ogImage} onChange={e => setSeo({...seo, ogImage: e.target.value})} className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" placeholder="https://..." />
                <p className="text-xs text-[#94a3b8] mt-1">Ижтимоий тармоқларда улашилганда кўринадиган расм (1200x630 тавсия)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Favicon</label>
                <input type="text" value={seo.favicon} onChange={e => setSeo({...seo, favicon: e.target.value})} className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" placeholder="/favicon.ico" />
              </div>

              {/* Social Preview */}
              <div className="mt-6 p-4 bg-[#f8fafc] rounded-lg border border-[#e5e7eb]">
                <p className="text-xs text-[#94a3b8] mb-2">Facebook/Telegram да кўриниш:</p>
                <div className="max-w-md border border-[#ddd] rounded-lg overflow-hidden">
                  <div className="bg-[#e5e7eb] h-40 flex items-center justify-center text-4xl">
                    {seo.ogImage ? <img src={seo.ogImage} alt="" className="w-full h-full object-cover" /> : '🖼️'}
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-xs text-[#94a3b8] uppercase">vatanjournal.uz</p>
                    <p className="font-semibold text-[#1e293b] text-sm mt-1">{seo.title}</p>
                    <p className="text-xs text-[#64748b] mt-1 line-clamp-2">{seo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Google Analytics ID</label>
                <input type="text" value={seo.googleAnalytics} onChange={e => setSeo({...seo, googleAnalytics: e.target.value})} className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" placeholder="G-XXXXXXXXXX" />
                <p className="text-xs text-[#94a3b8] mt-1">Google Analytics ўлчов ID сини киритинг</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#1e3a8a] mb-2">📊 Кўришлар ҳисоби</h4>
                <p className="text-sm text-[#64748b]">Мақолалар кўришлар сони автоматик равишда ҳисобланади. Ҳар бир мақола саҳифаси очилганда кўришлар +1 бўлади.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
