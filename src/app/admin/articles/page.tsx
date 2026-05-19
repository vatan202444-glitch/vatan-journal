'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin-api';
import { issues as initialIssues, Issue } from '@/data/issues';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface Article {
  id: string;
  title: string;
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

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    title: '',
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

  const [hasDraft, setHasDraft] = useState(false);
  const [draftData, setDraftData] = useState<{ id: string | null; data: typeof formData } | null>(null);

  // Check for auto-saved draft
  useEffect(() => {
    if (isModalOpen) {
      const savedDraft = localStorage.getItem('vatan_article_draft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          const isMatchingContext = editingArticle ? parsed.id === editingArticle.id : parsed.id === null;
          if (isMatchingContext && parsed.data.title !== formData.title || parsed.data.content !== formData.content) {
            setDraftData(parsed);
            setHasDraft(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      setHasDraft(false);
      setDraftData(null);
    }
  }, [isModalOpen, editingArticle]);

  // Auto-save effect
  useEffect(() => {
    if (!isModalOpen) return;
    const interval = setTimeout(() => {
      localStorage.setItem('vatan_article_draft', JSON.stringify({
        id: editingArticle?.id || null,
        data: formData
      }));
    }, 2000);
    return () => clearTimeout(interval);
  }, [formData, isModalOpen, editingArticle]);

  const restoreDraft = () => {
    if (draftData) {
      setFormData(draftData.data);
      setHasDraft(false);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem('vatan_article_draft');
    setHasDraft(false);
    setDraftData(null);
  };

  // Load articles from API
  useEffect(() => {
    adminFetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        // Add status field if not present
        const articlesWithStatus = data.map((a: Article) => ({
          ...a,
          status: a.status || 'published',
          isPremium: a.isPremium || false
        }));
        setArticles(articlesWithStatus);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load articles:', err);
        setLoading(false);
      });
  }, []);

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

  const handleAddNew = () => {
    setEditingArticle(null);
    setArticleImage(null);
    setFormData({
      title: '',
      authorName: '',
      categoryName: '',
      summary: '',
      content: '',
      readTime: '',
      status: 'draft',
      isPremium: false,
      issueId: '',
      issueNumber: '',
      shortLink: '',
      views: '0',
      metaDescription: '',
      publishAt: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setArticleImage(article.imageUrl || null);
    setFormData({
      title: article.title,
      authorName: article.authorName,
      categoryName: article.categoryName,
      summary: article.summary || '',
      content: article.content || article.contentHtml || '',
      readTime: article.readTime.toString(),
      status: article.status || 'published',
      isPremium: article.isPremium || false,
      issueId: article.issueId || '',
      issueNumber: article.issueNumber || '',
      shortLink: article.shortLink || '',
      views: (article.views || 0).toString(),
      metaDescription: article.metaDescription || '',
      publishAt: article.publishAt || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Ушбу мақолани ўчиришни хохлайсизми?')) {
      try {
        await adminFetch(`/api/articles?id=${id}`, { method: 'DELETE' });
        setArticles(articles.filter(a => a.id !== id));
      } catch (error) {
        console.error('Failed to delete article:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const articleData = {
      ...formData,
      readTime: parseInt(formData.readTime),
      imageUrl: articleImage || undefined,
      summary: formData.summary,
      issueId: formData.issueId || undefined,
      issueNumber: formData.issueNumber || undefined,
      shortLink: formData.shortLink || undefined,
      views: parseInt(formData.views) || 0,
      metaDescription: formData.metaDescription || undefined,
      publishAt: formData.publishAt || undefined,
    };

    try {
      if (editingArticle) {
        const response = await adminFetch('/api/articles', {
          method: 'PUT',
          body: JSON.stringify({ ...articleData, id: editingArticle.id }),
        });
        if (!response.ok) throw new Error('Save failed');
        const updated = await response.json();
        setArticles(articles.map((a) => (a.id === editingArticle.id ? updated : a)));
      } else {
        const response = await adminFetch('/api/articles', {
          method: 'POST',
          body: JSON.stringify(articleData),
        });
        if (!response.ok) throw new Error('Save failed');
        const newArticle = await response.json();
        setArticles([newArticle, ...articles]);
      }

      setArticleImage(null);
      localStorage.removeItem('vatan_article_draft');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  };

  const handleIssueChange = (issueId: string) => {
    const selectedIssue = issues.find(i => i.id === issueId);
    setFormData({
      ...formData,
      issueId,
      issueNumber: selectedIssue?.issueNumber || '',
    });
  };

  const [articleImage, setArticleImage] = useState<string | null>(null);

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

  const filteredArticles = articles.filter((a) => {
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !filterCategory || a.categoryName === filterCategory;
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Мақолалар</h1>
            <p className="text-[#64748b] mt-1">Барча мақолаларни бошқариш</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <span>➕</span>
            Янги мақола
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-[#e5e7eb] flex gap-4 flex-wrap">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Қидириш..."
            className="px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] flex-1 min-w-[200px]"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
          >
            <option value="">Барча рукнлар</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
          >
            <option value="">Барча статуслар</option>
            <option value="published">Чоп этилган</option>
            <option value="draft">Қоралама</option>
          </select>
          <span className="text-sm text-[#64748b] self-center">Жами: {filteredArticles.length}</span>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 text-center">
            <p className="text-[#64748b]">Юкланмоқда...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f8fafc] border-b border-[#e5e7eb]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e293b]">Мақола номи</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e293b]">Муаллиф</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e293b]">Рукн</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e293b]">Сана</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e293b]">Кўринишлар</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e293b]">Статус</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1e293b]">Амаллар</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-[#e5e7eb] hover:bg-[#f8fafc]">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#1e293b]">{article.title}</p>
                        <p className="text-sm text-[#64748b]">{article.readTime} дақиқа ўқиш</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{article.authorName}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#1e3a8a]/10 text-[#1e3a8a] rounded-full text-sm font-medium">
                        {article.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#475569]">{article.date}</td>
                    <td className="px-6 py-4 text-[#475569]">{article.views || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {article.status === 'published' ? '✓ Чоп этилган' : '⏳ Қоралама'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Таҳрирлаш"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Ўчириш"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )} {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-[#e5e7eb] flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1e293b] font-serif">
                  {editingArticle ? 'Мақолани таҳрирлаш' : 'Янги мақола'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#64748b] hover:text-[#1e293b] text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {hasDraft && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-center text-sm text-amber-800">
                    <span>⚠️ Сақланмаган ўзгартиришлар мавжуд. Тиклашни хоҳлайсизми?</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={restoreDraft} className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors font-medium">Тиклаш</button>
                      <button type="button" onClick={discardDraft} className="px-3 py-1 bg-white border border-amber-300 rounded hover:bg-amber-100 transition-colors">Ўчириш</button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-2">Сарлавҳа *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                      placeholder="Мақола сарлавҳаси"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-2">Муаллиф *</label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                      placeholder="Муаллиф исми"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-2">Рукн *</label>
                    <select
                      value={formData.categoryName}
                      onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                      required
                    >
                      <option value="">Рукн танланг</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-2">Журнал сони</label>
                    <input
                      type="text"
                      value={formData.issueNumber}
                      onChange={(e) => setFormData({...formData, issueNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                      placeholder="Масалан: 01/2025"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-2">Ўқиш вақти (дақиқа)</label>
                    <input
                      type="number"
                      value={formData.readTime}
                      onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
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
                        className="w-full pl-8 px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                        placeholder="масалан: jmgp"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Мақола расми</label>
                  <div className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-4 hover:border-[#1e3a8a] transition-colors">
                    {articleImage ? (
                      <div className="relative">
                        <img 
                          src={articleImage} 
                          alt="Article preview" 
                          className="w-full h-48 object-contain rounded-lg"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-2">🔍 SEO Қидирув Таърифи (Meta Description)</label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] text-sm text-[#1e293b] h-20"
                      placeholder="Google/Yandex қидируви учун 150-160 белгилик қисқа таъриф..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-2">⏱ Кейинроқ чоп этиш (Scheduled Publish)</label>
                    <input
                      type="datetime-local"
                      value={formData.publishAt}
                      onChange={(e) => setFormData({...formData, publishAt: e.target.value})}
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] text-[#1e293b]"
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
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-[#e5e7eb]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f8fafc] transition-colors"
                  >
                    Бекор қилиш
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium"
                  >
                    {editingArticle ? 'Сақлаш' : 'Қўшиш'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
