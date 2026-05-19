'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin-api';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    adminFetch('/api/subscribers')
      .then(r => r.json())
      .then(setSubscribers)
      .catch(() => setSubscribers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/subscribers', {
        method: 'POST',
        body: JSON.stringify({ email: newEmail, name: newName }),
      });
      if (res.ok) {
        const sub = await res.json();
        setSubscribers([sub, ...subscribers]);
        setNewEmail('');
        setNewName('');
        setShowAdd(false);
      }
    } catch { alert('Хатолик'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ушбу обуначини ўчиришни хоҳлайсизми?')) return;
    await adminFetch(`/api/subscribers?id=${id}`, { method: 'DELETE' });
    setSubscribers(subscribers.filter(s => s.id !== id));
  };

  const handleToggleStatus = async (sub: Subscriber) => {
    const newStatus = sub.status === 'active' ? 'unsubscribed' : 'active';
    await adminFetch('/api/subscribers', {
      method: 'PUT',
      body: JSON.stringify({ id: sub.id, status: newStatus }),
    });
    setSubscribers(subscribers.map(s => s.id === sub.id ? { ...s, status: newStatus } : s));
  };

  const exportCsv = () => {
    const csv = 'Email,Исм,Ҳолат,Обуна санаси\n' +
      subscribers.map(s => `${s.email},${s.name || ''},${s.status},${s.subscribedAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'subscribers.csv';
    link.click();
  };

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = subscribers.filter(s => s.status === 'active').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Обуначилар</h1>
            <p className="text-[#64748b] mt-1">Электрон почта обуначиларини бошқариш</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCsv} className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f8fafc] text-sm font-medium text-[#1e293b]">
              📥 CSV экспорт
            </button>
            <button onClick={() => setShowAdd(!showAdd)} className="px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium">
              + Қўшиш
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-5">
            <p className="text-sm text-[#64748b]">Жами обуначилар</p>
            <p className="text-3xl font-bold text-[#1e293b] mt-1">{subscribers.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-5">
            <p className="text-sm text-[#64748b]">Фаол обуначилар</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-5">
            <p className="text-sm text-[#64748b]">Обунадан чиққан</p>
            <p className="text-3xl font-bold text-red-500 mt-1">{subscribers.length - activeCount}</p>
          </div>
        </div>

        {/* Add subscriber */}
        {showAdd && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
            <form onSubmit={handleAdd} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Email *</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" required placeholder="email@example.com" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-[#1e293b] mb-2">Исм</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" placeholder="Исми (ихтиёрий)" />
              </div>
              <button type="submit" className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg">Қўшиш</button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
              placeholder="🔍 Email ёки исм бўйича қидириш..."
            />
          </div>

          {loading ? (
            <p className="text-center py-8 text-[#64748b]">Юкланмоқда...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">📧</p>
              <p className="text-[#64748b]">Обуначилар топилмади</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 text-sm text-[#64748b]">Email</th>
                  <th className="text-left py-3 text-sm text-[#64748b]">Исм</th>
                  <th className="text-left py-3 text-sm text-[#64748b]">Ҳолат</th>
                  <th className="text-left py-3 text-sm text-[#64748b]">Сана</th>
                  <th className="text-right py-3 text-sm text-[#64748b]">Амаллар</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => (
                  <tr key={sub.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                    <td className="py-3 text-sm text-[#1e293b] font-medium">{sub.email}</td>
                    <td className="py-3 text-sm text-[#64748b]">{sub.name || '—'}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {sub.status === 'active' ? '✅ Фаол' : '❌ Обунадан чиққан'}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-[#64748b]">{new Date(sub.subscribedAt).toLocaleDateString('uz-UZ')}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleToggleStatus(sub)} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-700 mr-2">
                        {sub.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-700">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
