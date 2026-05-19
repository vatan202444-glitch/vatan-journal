'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin-api';
import { categories as initialCategories, Category } from '@/data/categories';

const availableIcons = ['💰', '📜', '👥', '🎭', '📷', '🎬', '📚', '🌍', '💡', '🔬', '🏛️', '🎨', '📊', '⚖️'];

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '💰',
  });

  // Load categories from API
  useEffect(() => {
    adminFetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
        setLoading(false);
      });
  }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[ъь]/g, '')
      .replace(/[ў]/g, 'o')
      .replace(/[ғ]/g, 'g')
      .replace(/[қ]/g, 'q')
      .replace(/[ҳ]/g, 'h')
      .replace(/[ё]/g, 'yo')
      .replace(/[ю]/g, 'yu')
      .replace(/[я]/g, 'ya')
      .replace(/[а]/g, 'a')
      .replace(/[б]/g, 'b')
      .replace(/[в]/g, 'v')
      .replace(/[г]/g, 'g')
      .replace(/[д]/g, 'd')
      .replace(/[е]/g, 'e')
      .replace(/[ж]/g, 'j')
      .replace(/[з]/g, 'z')
      .replace(/[и]/g, 'i')
      .replace(/[й]/g, 'y')
      .replace(/[к]/g, 'k')
      .replace(/[л]/g, 'l')
      .replace(/[м]/g, 'm')
      .replace(/[н]/g, 'n')
      .replace(/[о]/g, 'o')
      .replace(/[п]/g, 'p')
      .replace(/[р]/g, 'r')
      .replace(/[с]/g, 's')
      .replace(/[т]/g, 't')
      .replace(/[у]/g, 'u')
      .replace(/[ф]/g, 'f')
      .replace(/[х]/g, 'x')
      .replace(/[ц]/g, 'ts')
      .replace(/[ч]/g, 'ch')
      .replace(/[ш]/g, 'sh')
      .replace(/[щ]/g, 'shch')
      .replace(/[э]/g, 'e')
      .replace(/[ы]/g, 'y')
      .replace(/[ә]/g, 'a')
      .replace(/[ө]/g, 'o')
      .replace(/[ү]/g, 'u')
      .replace(/[ң]/g, 'ng');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', icon: '💰' });
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Ушбу рукнни ўчиришни хохлайсизми?')) {
      try {
        await adminFetch(`/api/categories?id=${id}`, { method: 'DELETE' });
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        const response = await adminFetch('/api/categories', {
          method: 'PUT',
          body: JSON.stringify({ ...formData, id: editingCategory.id }),
        });
        const updated = await response.json();
        setCategories(categories.map(c => c.id === editingCategory.id ? updated : c));
      } else {
        const response = await adminFetch('/api/categories', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Рукнлар</h1>
            <p className="text-[#64748b] mt-1">Мақола рукнларини бошқариш</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <span>➕</span>
            Янги рукн
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 text-center">
            <p className="text-[#64748b]">Юкланмоқда...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{category.icon}</span>
                    <div>
                      <h3 className="font-bold text-[#1e293b] text-lg">{category.name}</h3>
                      <p className="text-sm text-[#64748b]">/{category.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Таҳрирлаш"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Ўчириш"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#e5e7eb]">
                  <span className="text-sm text-[#64748b]">
                    {category.articleCount} та мақола
                  </span>
                  <a 
                    href={`/categories/${category.slug}`}
                    target="_blank"
                    className="text-sm text-[#1e3a8a] hover:underline"
                  >
                    Кўриш →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )} {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-[#1e3a8a] mb-2 flex items-center gap-2">
            <span>💡</span>
            Рукнлар ҳақида
          </h3>
          <ul className="text-sm text-[#475569] space-y-1 list-disc list-inside">
            <li>Рукн - бу мақолаларни гуруҳлаш категорияси</li>
            <li>Хар бир рукн ўзига хос URL манзилга эга бўлади (масалан: /categories/tarix)</li>
            <li>Рукнни ўчирганда, ундаги мақолалар бошқа рукнга кўчирилиши керак</li>
          </ul>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-[#e5e7eb] flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#1e293b] font-serif">
                  {editingCategory ? 'Рукнни таҳрирлаш' : 'Янги рукн'}
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
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Иконка</label>
                  <div className="grid grid-cols-6 gap-2">
                    {availableIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({...formData, icon})}
                        className={`p-3 text-2xl rounded-lg border-2 transition-colors ${
                          formData.icon === icon 
                            ? 'border-[#1e3a8a] bg-[#1e3a8a]/10' 
                            : 'border-[#e5e7eb] hover:border-[#1e3a8a]/50'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Рукн номи *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                    placeholder="Масалан: Иқтисодиёт"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">
                    URL слаг (автоматик)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] bg-[#f8fafc]"
                    placeholder="iqtisodiyot"
                    required
                  />
                  <p className="text-xs text-[#64748b] mt-1">
                    Бу URL манзилда фойдаланилади: /categories/{formData.slug}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Тавсиф</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] h-24"
                    placeholder="Рукн ҳақида қисқа маълумот..."
                  />
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
                    {editingCategory ? 'Сақлаш' : 'Қўшиш'}
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
