'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin-api';
import { issues as initialIssues, Issue } from '@/data/issues';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  summary?: string;
  content?: string;
  contentHtml?: string;
  authorName: string;
  categoryName: string;
  date: string;
  readTime: number;
  featured?: boolean;
  imageUrl?: string;
  status?: 'published' | 'draft';
  issueId?: string;
  issueNumber?: string;
  shortLink?: string;
  views?: number;
  metaDescription?: string;
  publishAt?: string;
  isPremium?: boolean;
}

const categories = ['Иқтисодиёт', 'Тарих', 'Жамият', 'Маданият', 'Тилшунослик', 'Фото', 'Видео', 'Маънавият', 'Илм', 'Таълим', 'Адабиёт'];

export default function EditArticle() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;
  const [issues, setIssues] = useState<Issue[]>([]);
  const [articleImage, setArticleImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    authorName: '',
    categoryName: '',
    summary: '',
    content: '',
    readTime: '',
    status: 'draft' as 'published' | 'draft',
    isPremium: false,
    issueId: '',
    issueNumber: '',
    shortLink: '',
    views: '0',
    metaDescription: '',
    publishAt: '',
  });

  // Load article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await adminFetch(`/api/articles`);
        const articles: Article[] = await response.json();
        const article = articles.find(a => a.id === articleId);
        
        if (article) {
          setFormData({
            title: article.title || '',
            subtitle: article.subtitle || '',
            authorName: article.authorName || '',
            categoryName: article.categoryName || '',
            summary: article.summary || '',
            content: article.content || '',
            readTime: article.readTime?.toString() || '',
            status: article.status || 'draft',
            isPremium: article.isPremium || false,
            issueId: article.issueId || '',
            issueNumber: article.issueNumber || '',
            shortLink: article.shortLink || '',
            views: article.views?.toString() || '0',
            metaDescription: article.metaDescription || '',
            publishAt: article.publishAt || '',
          });
          if (article.imageUrl) {
            setArticleImage(article.imageUrl);
          }
        }
      } catch (error) {
        console.error('Failed to load article:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  // Load issues from API
  useEffect(() => {
    adminFetch('/api/issues')
      .then(res => res.json())
      .then(data => {
        setIssues(data);
      })
      .catch(err => {
        console.error('Failed to load issues:', err);
      });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArticleImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setArticleImage(null);
  };

  const handleIssueChange = (issueId: string) => {
    const selectedIssue = issues.find(i => i.id === issueId);
    setFormData({
      ...formData,
      issueId,
      issueNumber: selectedIssue?.issueNumber || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Clean HTML content - remove inline styles and unwanted attributes
    const cleanContent = (html: string) => {
      return html
        .replace(/style="[^"]*"/gi, '') // Remove all style attributes
        .replace(/lang="[^"]*"/gi, '') // Remove lang attributes
        .replace(/class="[^"]*"/gi, '') // Remove class attributes
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    };

    // Strip all HTML tags - for subtitle only
    const stripHtmlTags = (html: string) => {
      return html
        .replace(/<[^>]*>/g, '') // Remove all HTML tags
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    };

    const articleData = {
      ...formData,
      id: articleId,
      readTime: parseInt(formData.readTime),
      imageUrl: articleImage || undefined,
      summary: cleanContent(formData.summary),
      content: cleanContent(formData.content),
      subtitle: stripHtmlTags(formData.subtitle),
      issueId: formData.issueId || undefined,
      issueNumber: formData.issueNumber || undefined,
      shortLink: formData.shortLink || undefined,
      views: parseInt(formData.views) || 0,
      metaDescription: formData.metaDescription || undefined,
      publishAt: formData.publishAt || undefined,
    };

    try {
      const response = await adminFetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        body: JSON.stringify(articleData),
      });
      if (!response.ok) throw new Error('Save failed');
      
      // Redirect to articles list after successful save
      router.push('/admin/articles');
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('Мақолани сақлашда хатолик юз берди');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#64748b]">Юкланмоқда...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Мақолани тahrirлаш</h1>
            <p className="text-[#64748b] mt-1">Мақола маълумотларini ўзгартириш</p>
          </div>
          <Link
            href="/admin/articles"
            className="px-6 py-3 border border-[#e5e7eb] text-[#1e293b] rounded-lg hover:bg-[#f8fafc] transition-colors font-medium"
          >
            ← Орқага
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Сарлавҳа *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                placeholder="Мақола сарлавҳаси"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Подзаголовок (Сарлавҳа тўлиқлиги)</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                placeholder="Мақола подзаголовки"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Муаллиф *</label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                placeholder="Муаллиф исми"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Рукн *</label>
              <select
                value={formData.categoryName}
                onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                required
              >
                <option value="">Рукн танланг</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Ўқиш вақти (дақиқа)</label>
              <input
                type="number"
                value={formData.readTime}
                onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Қисқа линк (Мажбурий эмас)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94a3b8]">/</span>
                <input
                  type="text"
                  value={formData.shortLink}
                  onChange={(e) => setFormData({...formData, shortLink: e.target.value})}
                  className="w-full pl-8 px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                  placeholder="масалан: jmgp"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-[#1e293b] mb-2">Мақола расми</label>
            <div className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-6 hover:border-[#1e3a8a] transition-colors">
              {articleImage ? (
                <div className="relative">
                  <img 
                    src={articleImage} 
                    alt="Article preview" 
                    className="w-full h-64 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer py-8">
                  <span className="text-4xl mb-2">🖼️</span>
                  <p className="text-[#64748b] mb-2">Расмни бу ерга ташланг ёки танлаш учун босинг</p>
                  <p className="text-xs text-[#94a3b8]">JPG, PNG. Максимал ҳажм: 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e293b] mb-2">Матн *</label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({...formData, content: value})}
              placeholder="Мақола матнини бу ерга киритинг..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">🔍 SEO Қидирув Таърифи (Meta Description)</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] text-sm text-[#1e293b] h-24"
                placeholder="Google/Yandex қидируви учун 150-160 белгилик қисқа таъриф..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">⏱ Кейинроқ чоп этиш (Scheduled Publish)</label>
              <input
                type="datetime-local"
                value={formData.publishAt}
                onChange={(e) => setFormData({...formData, publishAt: e.target.value})}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] text-[#1e293b]"
              />
              <p className="text-xs text-[#64748b] mt-1">Танланган вақт келганда статус автоматик равишда 'Чоп этилган'га ўзгаради.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Статус</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'published' | 'draft'})}
                    className="text-[#1e3a8a]"
                  />
                  <span>Қоралама</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'published' | 'draft'})}
                    className="text-[#1e3a8a]"
                  />
                  <span>Чоп этиш</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Обуна тури</label>
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData({...formData, isPremium: e.target.checked})}
                />
                <span className="flex items-center gap-1 font-medium">
                  <span className="text-amber-500">🔒</span> Premium (Фақат обуначилар учун)
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Кўринишлар сони</label>
              <input
                type="number"
                value={formData.views}
                onChange={(e) => setFormData({...formData, views: e.target.value})}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-[#e5e7eb]">
            <Link
              href="/admin/articles"
              className="px-6 py-3 border border-[#e5e7eb] rounded-lg hover:bg-[#f8fafc] transition-colors font-medium"
            >
              Бекор қилиш
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Юкланмоқда...' : 'Сақлаш'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
