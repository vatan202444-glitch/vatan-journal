'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin-api';
import { Issue } from '@/data/issues';
import IssueCover from '@/components/ui/IssueCover';

export default function AdminIssues() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState('');
  const [formData, setFormData] = useState({
    year: '2024',
    issueNumber: '',
    title: '',
    description: '',
    coverImage: '',
    pdfUrl: '',
    articleCount: 0,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Load from API
  useEffect(() => {
    adminFetch('/api/issues')
      .then(res => res.json())
      .then(data => {
        setIssues(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load issues:', err);
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setFormData({
      year: '2024',
      issueNumber: '',
      title: '',
      description: '',
      coverImage: '',
      pdfUrl: '',
      articleCount: 0,
    });
    setPreviewImage(null);
    setExistingCoverUrl('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIssue(null);
    resetForm();
  };

  const handleAddNew = () => {
    setEditingIssue(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue);
    setFormData({
      year: issue.year,
      issueNumber: issue.issueNumber,
      title: issue.title,
      description: issue.description || '',
      coverImage: issue.coverImage || '',
      pdfUrl: issue.pdfUrl || '',
      articleCount: issue.articleCount || 0,
    });
    setExistingCoverUrl(issue.coverImage || '');
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ўчиришни тасдиқлайсизми?')) return;
    
    try {
      await adminFetch(`/api/issues?id=${id}`, { method: 'DELETE' });
      setIssues(issues.filter(i => i.id !== id));
      alert('Журнал сони ўчирилди');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Номаълум хато';
      if (message.includes('Кириш') || message.includes('Unauthorized')) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }
      alert(`Ўчиришда хато: ${message}`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageUpload called');
    const file = e.target.files?.[0];
    console.log('Selected file:', file);

    if (!file) {
      console.log('No file selected');
      return;
    }

    // Fayl hajmi tekshiruv (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Расм ҳажми 5MB дан ошмаслиги керак');
      return;
    }

    // Fayl turi tekshiruv
    if (!file.type.startsWith('image/')) {
      alert('Фақат расм файлларини юклаш мумкин');
      return;
    }

    console.log('Starting file read...');
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log('File read successfully');
      const result = event.target?.result as string;
      setPreviewImage(result);
      setFormData((prev) => ({ ...prev, coverImage: result }));
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      alert('Расмни юклашда хато юз берди');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.year || !formData.issueNumber || !formData.title) {
      alert('Илтимос, йил, сон рақами ва сарлавҳани киритинг');
      return;
    }

    const issueData = {
      ...formData,
      coverImage: previewImage || existingCoverUrl || '',
      date: `${formData.year}-${String(formData.issueNumber).padStart(2, '0')}-15`,
    };

    setSaving(true);
    try {
      if (editingIssue) {
        await adminFetch('/api/issues', {
          method: 'PUT',
          body: JSON.stringify({ ...issueData, id: editingIssue.id }),
        });
      } else {
        await adminFetch('/api/issues', {
          method: 'POST',
          body: JSON.stringify(issueData),
        });
      }
      const refreshed = await adminFetch('/api/issues').then((r) => r.json());
      setIssues(refreshed);
      closeModal();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Номаълум хато';
      if (message.includes('Кириш') || message.includes('Unauthorized')) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }
      alert(`Журнал сонини сақлашда хато: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b]">Журнал сонлари</h1>
            <p className="text-[#64748b]">Журнал сонларини бошқариш</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] font-medium disabled:opacity-50"
          >
            ➕ Янги сон қўшиш
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 text-center">
            <p className="text-[#64748b]">Юкланмоқда...</p>
          </div>
        ) : (
          /* Issues Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {issues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-lg shadow border overflow-hidden">
              {/* Cover Image */}
              <div className="aspect-[3/4] bg-gray-100 relative">
                <IssueCover
                  coverImage={issue.coverImage}
                  year={issue.year}
                  issueNumber={issue.issueNumber}
                  title={issue.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-[#1e293b]">{issue.title}</h3>
                    <p className="text-sm text-[#64748b]">{issue.year} йил, {issue.issueNumber}-сон</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(issue)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Таҳрирлаш"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(issue.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Ўчириш"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-[#e5e7eb]">
                  <span className="text-sm text-[#64748b]">{issue.articleCount} та мақола</span>
                  {issue.coverImage?.startsWith('/uploads/') ? (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <span>✅</span>
                      Расм бор
                    </span>
                  ) : (
                    <span className="text-sm text-[#94a3b8] flex items-center gap-1">
                      <span>❌</span>
                      Расм йўқ
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-[#1e3a8a] mb-2 flex items-center gap-2">
              <span>🖼️</span>
              Муқова расмлари
            </h3>
            <ul className="text-sm text-[#475569] space-y-1 list-disc list-inside">
              <li>Расм тавсия этилган ўлчами: 800x1000 пиксел (3:4 нисбат)</li>
              <li>Формат: JPG ёки PNG</li>
              <li>Максимал ҳажм: 5MB</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
              <span>📝</span>
              Мақолалар бириктириш
            </h3>
            <ul className="text-sm text-[#475569] space-y-1 list-disc list-inside">
              <li>Мақолалар қўшганда, уларни мос журнал сонига бириктириш мумкин</li>
              <li>Ҳар бир журнал сонда унга тегишли мақолалар сони кўрсатилади</li>
            </ul>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 overflow-y-auto"
              onClick={closeModal}
            >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[#e5e7eb] flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1e293b] font-serif">
                  {editingIssue ? 'Журнал сонини таҳрирлаш' : 'Янги журнал сони'}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-[#64748b] hover:text-[#1e293b] text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-2">Йил *</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                      placeholder="2024"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-2">Сон рақами *</label>
                    <input
                      type="text"
                      value={formData.issueNumber}
                      onChange={(e) => setFormData({ ...formData, issueNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                      placeholder="01, 02..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Сарлавҳа *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                    placeholder="Журнал сони сарлавҳаси"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Тавсиф</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] h-20"
                    placeholder="Сон ҳақида қисқа маълумот..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">📷 Муқова расми</label>
                  <div className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-4 hover:border-[#1e3a8a] transition-colors space-y-3">
                    {existingCoverUrl && !previewImage && (
                      <div>
                        <p className="text-xs text-[#64748b] mb-2">Ҳозирги муқова:</p>
                        <img
                          src={existingCoverUrl}
                          alt="Ҳозирги муқова"
                          className="w-full h-40 object-contain rounded-lg bg-[#f8fafc]"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Янги расм"
                          className="w-full h-48 object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : null}
                    <label className="flex flex-col items-center justify-center cursor-pointer py-6 border border-[#e5e7eb] rounded-lg hover:bg-[#f8fafc]">
                      <span className="text-3xl mb-2">🖼️</span>
                      <p className="text-[#64748b] mb-1 text-sm">
                        {existingCoverUrl || previewImage
                          ? 'Расмни алмаштириш'
                          : 'Расмни ташланг ёки танлаш учун босинг'}
                      </p>
                      <p className="text-xs text-[#94a3b8]">JPG, PNG. Макс: 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>



                <div className="flex justify-end gap-4 pt-4 border-t border-[#e5e7eb]">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="px-6 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f8fafc] transition-colors disabled:opacity-50"
                  >
                    Бекор қилиш
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium disabled:opacity-50"
                  >
                    {saving ? 'Сақланмоқда...' : editingIssue ? 'Сақлаш' : 'Қўшиш'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
            document.body
          )}
      </div>
    </AdminLayout>
  );
}
