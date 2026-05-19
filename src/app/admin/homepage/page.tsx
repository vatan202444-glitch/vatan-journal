'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

// Бош саҳифа маълумотлари (localStorage'dan олинади)
const defaultHomepageData = {
  // Журнал муқоваси
  cover: {
    type: 'css', // 'css' ёки 'image'
    imageUrl: '',
    year: '2024',
    issueNumber: '01',
    subtitle: 'Нишона сон',
    badge: 'Нишона сон',
    badgeColor: '#b45309',
  },
  // Муҳим мақола
  featuredArticle: {
    id: 'article-002',
    title: 'Ўзбекчилик: Миллий ифтихорми ёки тараққиётга тўсиқ?',
    excerpt: 'Мақолада миллий қадриятлар ва замонавий тараққиёт ўртасидаги мураккаб муносабатлар, шунингдек, глобаллашув шароитида миллий идентитетни сақлаб қолишнинг муаммолари ҳал этилмоқда.',
    author: 'Нодира Каримова',
    category: 'Жамият',
    readTime: 12,
    showBadge: true,
    badgeText: 'Муҳим мақола',
  },
};

// Мавжуд мақолалар рўйхати (тезкор танлаш учун)
const availableArticles = [
  { id: 'article-001', title: 'Ўзбекистоннинг очилмаган конлари', author: 'Дилшод Раҳимов', category: 'Иқтисодиёт', readTime: 8, excerpt: 'Республикамизнинг табиий бойликлари ва улардан самарали фойдаланиш йўллари ҳақида...' },
  { id: 'article-002', title: 'Ўзбекчилик: Миллий ифтихорми ёки тараққиётга тўсиқ?', author: 'Нодира Каримова', category: 'Жамият', readTime: 12, excerpt: 'Мақолада миллий қадриятлар ва замонавий тараққиёт ўртасидаги мураккаб муносабатлар...' },
  { id: 'article-003', title: 'Рус тилининг таъсири: ўзбек тилининг маданий захирасими', author: 'Анвар Исмоилов', category: 'Тилшунослик', readTime: 15, excerpt: 'Тилшунослик нуқтаи назаридан рус тилининг ўзбек тилига таъсири...' },
  { id: 'article-004', title: 'Совет телеологияларидан холи фикрлаш', author: 'Баҳодир Хон', category: 'Тарих', readTime: 20, excerpt: 'Янги архив маълумотлари асосида Марказий Осиё тарихини қайта кўриб чиқиш...' },
  { id: 'article-005', title: 'Араб халифаси нега туркларнинг дўпписини кийган?', author: 'Саид Аҳмадов', category: 'Тарих', readTime: 10, excerpt: 'Ўрта асрлар маданияти ва сиёсатидаги қизиқарли тарихий воқеалар...' },
];

export default function AdminHomepage() {
  const [data, setData] = useState(defaultHomepageData);
  const [savedMessage, setSavedMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [apiArticles, setApiArticles] = useState<{ id: string; title: string; authorName: string; categoryName: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/homepage').then((r) => r.json()),
      fetch('/api/articles').then((r) => r.json()),
    ]).then(([homepage, articles]) => {
      setData({
        cover: homepage.cover,
        featuredArticle: {
          id: homepage.featuredArticleId || 'article-002',
          title: '',
          excerpt: '',
          author: '',
          category: '',
          readTime: 10,
          showBadge: true,
          badgeText: 'Муҳим мақола',
        },
      });
      setApiArticles(articles);
      const featured = articles.find((a: { id: string }) => a.id === homepage.featuredArticleId);
      if (featured) {
        setData((prev) => ({
          ...prev,
          featuredArticle: {
            id: featured.id,
            title: featured.title,
            excerpt: featured.summary,
            author: featured.authorName,
            category: featured.categoryName,
            readTime: featured.readTime,
            showBadge: true,
            badgeText: 'Муҳим мақола',
          },
        }));
      }
    });
  }, []);

  const handleSave = async () => {
    const { adminFetch } = await import('@/lib/admin-api');
    const res = await adminFetch('/api/homepage', {
      method: 'PUT',
      body: JSON.stringify({
        cover: data.cover,
        featuredArticleId: data.featuredArticle.id,
      }),
    });
    if (res.ok) {
      setSavedMessage('✓ Маълумотлар сақланди!');
      setTimeout(() => setSavedMessage(''), 3000);
      // Сақлагандан кейин янги маълумотларни юклаш
      const updated = await adminFetch('/api/homepage').then((r) => r.json());
      setData((prev) => ({
        ...prev,
        cover: updated.cover,
        featuredArticle: { ...prev.featuredArticle, id: updated.featuredArticleId },
      }));
      setPreviewImage(null); // Base64 preview'ни тозалаш
    } else {
      alert('Сақлашда хато');
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setData({
          ...data,
          cover: {
            ...data.cover,
            type: 'image',
            imageUrl: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectArticle = (article: any) => {
    setData({
      ...data,
      featuredArticle: {
        ...data.featuredArticle,
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        author: article.author,
        category: article.category,
        readTime: article.readTime,
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Бош саҳифа</h1>
            <p className="text-[#64748b] mt-1">Бош саҳифа контентини бошқариш</p>
          </div>
          <div className="flex items-center gap-4">
            {savedMessage && (
              <span className="text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">
                {savedMessage}
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium flex items-center gap-2"
            >
              <span>💾</span>
              Сақлаш
            </button>
          </div>
        </div>

        {/* Preview Link */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
          <p className="text-[#1e3a8a] font-medium">Бош саҳифадаги ўзгаришларни кўриш</p>
          <a 
            href="/" 
            target="_blank"
            className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors text-sm"
          >
            🌐 Сайтни кўриш
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Journal Cover Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-4 flex items-center gap-2">
              <span>📚</span>
              Журнал муқоваси
            </h2>

            {/* Cover Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1e293b] mb-3">Муқова кўриниши</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="coverType"
                    checked={data.cover.type === 'css'}
                    onChange={() => setData({...data, cover: {...data.cover, type: 'css'}})}
                    className="text-[#1e3a8a]"
                  />
                  <span>CSS дизайн (матнли)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="coverType"
                    checked={data.cover.type === 'image'}
                    onChange={() => setData({...data, cover: {...data.cover, type: 'image'}})}
                    className="text-[#1e3a8a]"
                  />
                  <span>Расм (муқова)</span>
                </label>
              </div>
            </div>

            {/* Image Upload (if image type selected) */}
            {data.cover.type === 'image' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1e293b] mb-3">Муқова расми</label>
                <div className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-4 hover:border-[#1e3a8a] transition-colors">
                  {(previewImage || data.cover.imageUrl) ? (
                    <div className="relative">
                      <img 
                        src={previewImage || data.cover.imageUrl} 
                        alt="Cover preview" 
                        className="w-full h-48 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setData({...data, cover: {...data.cover, imageUrl: ''}});
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer py-8">
                      <span className="text-4xl mb-2">🖼️</span>
                      <p className="text-[#64748b] mb-1">Муқова расмини ташланг</p>
                      <p className="text-xs text-[#94a3b8]">JPG, PNG. Тавсия: 800x1000px</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* CSS Cover Settings */}
            {data.cover.type === 'css' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Йил</label>
                  <input
                    type="text"
                    value={data.cover.year}
                    onChange={(e) => setData({...data, cover: {...data.cover, year: e.target.value}})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Сон рақами</label>
                  <input
                    type="text"
                    value={data.cover.issueNumber}
                    onChange={(e) => setData({...data, cover: {...data.cover, issueNumber: e.target.value}})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                    placeholder="01"
                  />
                </div>
              </div>
            )}

            {/* Badge Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Белги матни</label>
                <input
                  type="text"
                  value={data.cover.badge}
                  onChange={(e) => setData({...data, cover: {...data.cover, badge: e.target.value}})}
                  className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                  placeholder="Нишона сон"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Белги ранги</label>
                <div className="flex gap-2">
                  {['#b45309', '#1e3a8a', '#dc2626', '#16a34a', '#7c3aed'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setData({...data, cover: {...data.cover, badgeColor: color}})}
                      className={`w-10 h-10 rounded-full border-2 ${
                        data.cover.badgeColor === color ? 'border-black' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-[#f8fafc] rounded-lg">
              <p className="text-sm text-[#64748b] mb-2">Олдиндан кўриш:</p>
              <div className="relative w-32 mx-auto">
                <div className="aspect-[3/4] bg-gradient-to-b from-[#1e3a8a] to-[#1e40af] rounded-lg flex items-center justify-center">
                  <span className="text-white font-serif text-lg">VATAN</span>
                </div>
                <div 
                  className="absolute -top-2 -right-2 px-2 py-1 rounded text-white text-xs font-bold"
                  style={{ backgroundColor: data.cover.badgeColor }}
                >
                  {data.cover.badge}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Featured Article Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-4 flex items-center gap-2">
              <span>⭐</span>
              Муҳим мақола
            </h2>

            {/* Simple Manual Edit */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Сарлавҳа</label>
                <input
                  type="text"
                  value={data.featuredArticle.title}
                  onChange={(e) => setData({...data, featuredArticle: {...data.featuredArticle, title: e.target.value}})}
                  className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                  placeholder="Мақола сарлавҳаси"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Қисқа тавсиф</label>
                <RichTextEditor
                  value={data.featuredArticle.excerpt}
                  onChange={(value) => setData({...data, featuredArticle: {...data.featuredArticle, excerpt: value}})}
                  placeholder="Мақола қисқа тавсифини ёзинг..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Муаллиф</label>
                  <input
                    type="text"
                    value={data.featuredArticle.author}
                    onChange={(e) => setData({...data, featuredArticle: {...data.featuredArticle, author: e.target.value}})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                    placeholder="Муаллиф исми"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Рукн</label>
                  <input
                    type="text"
                    value={data.featuredArticle.category}
                    onChange={(e) => setData({...data, featuredArticle: {...data.featuredArticle, category: e.target.value}})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                    placeholder="Рукн номи"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Ўқиш вақти (дақ)</label>
                  <input
                    type="number"
                    value={data.featuredArticle.readTime}
                    onChange={(e) => setData({...data, featuredArticle: {...data.featuredArticle, readTime: parseInt(e.target.value)}})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Белги матни</label>
                  <input
                    type="text"
                    value={data.featuredArticle.badgeText}
                    onChange={(e) => setData({...data, featuredArticle: {...data.featuredArticle, badgeText: e.target.value}})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                    placeholder="Муҳим мақола"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showBadge"
                  checked={data.featuredArticle.showBadge}
                  onChange={(e) => setData({...data, featuredArticle: {...data.featuredArticle, showBadge: e.target.checked}})}
                  className="w-5 h-5 text-[#1e3a8a]"
                />
                <label htmlFor="showBadge" className="font-medium text-[#1e293b]">
                  "Муҳим мақола" белгисини кўрсатиш
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-xl p-6 text-white">
          <h3 className="font-bold text-xl mb-4">💡 Қўлланма</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-2">📚 Журнал муқоваси:</p>
              <ul className="space-y-1 text-white/80 list-disc list-inside">
                <li>"CSS дизайн" - автоматик яратилган матнли муқова</li>
                <li>"Расм" - ўзингиз юклаган муқова расми</li>
                <li>Белги рангини ўзгартириш мумкин</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-2">⭐ Муҳим мақола:</p>
              <ul className="space-y-1 text-white/80 list-disc list-inside">
                <li>Рўйхатдан тезкор танлаш</li>
                <li>Қўлда таҳрирлаш имконияти</li>
                <li>Сақлагандан сўнг сайт янгиланади</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
