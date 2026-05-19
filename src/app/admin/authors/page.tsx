'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin-api';
import { Author } from '@/data/authors';

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    bio: '',
  });

  // Load authors from API
  useEffect(() => {
    adminFetch('/api/authors')
      .then(res => res.json())
      .then(data => {
        setAuthors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load authors:', err);
        setLoading(false);
      });
  }, []);

  const handleAddNew = () => {
    setEditingAuthor(null);
    setFormData({ name: '', specialization: '', bio: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      specialization: author.specialization,
      bio: author.bio,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Ушбу муаллифни ўчиришни хохлайсизми?')) {
      try {
        await adminFetch(`/api/authors?id=${id}`, { method: 'DELETE' });
        setAuthors(authors.filter(a => a.id !== id));
      } catch (error) {
        console.error('Failed to delete author:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAuthor) {
        const response = await adminFetch('/api/authors', {
          method: 'PUT',
          body: JSON.stringify({ ...formData, id: editingAuthor.id }),
        });
        const updated = await response.json();
        setAuthors(authors.map(a => a.id === editingAuthor.id ? updated : a));
      } else {
        const response = await adminFetch('/api/authors', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const newAuthor = await response.json();
        setAuthors([...authors, newAuthor]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save author:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Муаллифлар</h1>
            <p className="text-[#64748b] mt-1">Журнал муаллифларини бошқариш</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <span>➕</span>
            Янги муаллиф
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 text-center">
            <p className="text-[#64748b]">Юкланмоқда...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <div key={author.id} className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1e293b] text-lg">{author.name}</h3>
                        <p className="text-sm text-[#1e3a8a] font-medium">{author.specialization}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[#64748b] text-sm line-clamp-3 mb-6">
                    {author.bio || "Маълумот киритилмаган"}
                  </p>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[#e5e7eb]">
                    <button
                      onClick={() => handleEdit(author)}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                    >
                      Таҳрирлаш
                    </button>
                    <button
                      onClick={() => handleDelete(author.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
                    >
                      Ўчириш
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="p-6 border-b border-[#e5e7eb] flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1e293b] font-serif">
                  {editingAuthor ? 'Муаллифни таҳрирлаш' : 'Янги муаллиф'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#64748b] hover:text-[#1e293b] text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Исм-фамилия *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                    placeholder="Абдулла Қодирий"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Мутахассислик *</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                    placeholder="Адабиётшунослик"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Қисқача маълумот (Био)</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] h-24"
                    placeholder="Муаллиф ҳақида қисқача маълумот..."
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 mt-6 border-t border-[#e5e7eb]">
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
                    {editingAuthor ? 'Сақлаш' : 'Қўшиш'}
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
