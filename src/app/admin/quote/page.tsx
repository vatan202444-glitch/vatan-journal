'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin-api';

interface QuoteSettings {
  text: string;
  author: string;
}

export default function AdminQuote() {
  const [quote, setQuote] = useState<QuoteSettings>({ text: '', author: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/quote')
      .then(res => res.json())
      .then(data => {
        setQuote(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load quote:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminFetch('/api/quote', {
        method: 'PUT',
        body: JSON.stringify(quote),
      });
      if (res.ok) {
        const updated = await res.json();
        setQuote(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save quote:', err);
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Иқтибос бошқаруви</h1>
          <p className="text-[#64748b] mt-1">Сайт ҳедеридаги иқтибосни таҳрирлаш</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 text-center">
            <p className="text-[#64748b]">Юкланмоқда...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6 space-y-6">
            {/* Preview */}
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-3">Кўриниши (Олдиндан кўриш)</label>
              <div className="bg-[#f8fafc] border border-[#e5e7eb] rounded-lg py-3 px-4 text-center">
                <p className="text-sm text-[#64748b] italic font-serif max-w-4xl mx-auto">
                  &ldquo;{quote.text}&rdquo;
                  <span className="text-[#1e3a8a] not-italic font-medium ml-2">— {quote.author}</span>
                </p>
              </div>
            </div>

            {/* Quote Text */}
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Иқтибос матни</label>
              <textarea
                value={quote.text}
                onChange={(e) => setQuote({ ...quote, text: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] resize-none text-[#1e293b]"
                placeholder="Иқтибос матнини киритинг..."
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-2">Муаллиф</label>
              <input
                type="text"
                value={quote.author}
                onChange={(e) => setQuote({ ...quote, author: e.target.value })}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] text-[#1e293b]"
                placeholder="Иқтибос муаллифи"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#e5e7eb]">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium disabled:opacity-50"
              >
                {saving ? 'Сақланмоқда...' : '💾 Сақлаш'}
              </button>
              {saved && (
                <span className="text-green-600 font-medium animate-pulse">✓ Муваффақиятли сақланди!</span>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Маълумот:</strong> Иқтибос сайтнинг юқори қисмида (ҳедердаги нарса ранг панелда) кўринади. 
            Ўзгартиришлар сақлангандан сўнг сайтни янгилаганда кўринади.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
