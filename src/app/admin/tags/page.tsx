'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin-api';

interface Tag {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
  color: string;
}

const tagColors = ['#1e3a8a', '#b45309', '#16a34a', '#dc2626', '#7c3aed', '#0891b2', '#be185d', '#ea580c'];

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#1e3a8a' });

  useEffect(() => {
    adminFetch('/api/tags')
      .then(r => r.json())
      .then(setTags)
      .catch(() => setTags([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingTag ? 'PUT' : 'POST';
    const body = editingTag ? { ...formData, id: editingTag.id } : formData;
    
    try {
      const res = await adminFetch('/api/tags', { method, body: JSON.stringify(body) });
      if (res.ok) {
        const updated = await adminFetch('/api/tags').then(r => r.json());
        setTags(updated);
        closeModal();
      }
    } catch { alert('Хатолик юз берди'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ушбу тегни ўчиришни хоҳлайсизми?')) return;
    try {
      await adminFetch(`/api/tags?id=${id}`, { method: 'DELETE' });
      setTags(tags.filter(t => t.id !== id));
    } catch { alert('Ўчиришда хатолик'); }
  };

  const closeModal = () => { setIsModalOpen(false); setEditingTag(null); setFormData({ name: '', color: '#1e3a8a' }); };
  const openEdit = (tag: Tag) => { setEditingTag(tag); setFormData({ name: tag.name, color: tag.color }); setIsModalOpen(true); };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Теглар</h1>
            <p className="text-[#64748b] mt-1">Мақолаларга тег бириктириш</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium">
            + Янги тег
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
          {loading ? (
            <p className="text-center py-8 text-[#64748b]">Юкланмоқда...</p>
          ) : tags.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🏷️</p>
              <p className="text-[#64748b]">Теглар ҳали қўшилмаган</p>
              <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm">
                Биринчи тегни қўшиш
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {tags.map(tag => (
                <div key={tag.id} className="group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:shadow-md" style={{ borderColor: tag.color + '40', background: tag.color + '10' }}>
                  <span className="w-3 h-3 rounded-full" style={{ background: tag.color }} />
                  <span className="font-medium text-sm" style={{ color: tag.color }}>{tag.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/80" style={{ color: tag.color }}>{tag.articleCount}</span>
                  <div className="hidden group-hover:flex items-center gap-1 ml-2">
                    <button onClick={() => openEdit(tag)} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">✏️</button>
                    <button onClick={() => handleDelete(tag.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-[#1e293b] font-serif mb-4">{editingTag ? 'Тегни таҳрирлаш' : 'Янги тег'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Тег номи *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" placeholder="#тарих" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Ранг</label>
                  <div className="flex gap-2 flex-wrap">
                    {tagColors.map(color => (
                      <button key={color} type="button" onClick={() => setFormData({...formData, color})} className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ background: color }} />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Бекор қилиш</button>
                  <button type="submit" className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af]">{editingTag ? 'Сақлаш' : 'Қўшиш'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
