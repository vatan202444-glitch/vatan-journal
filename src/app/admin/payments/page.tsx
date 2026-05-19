'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/admin-api';

interface PaymentSettings {
  cardNumber: string;
  cardOwner: string;
  bankName: string;
}

export default function AdminPayments() {
  const [settings, setSettings] = useState<PaymentSettings>({
    cardNumber: '',
    cardOwner: '',
    bankName: '',
  });
  const [savedMsg, setSavedMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payment-settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/payment-settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSavedMsg('✓ Тўлов маълумотлари сақланди!');
        setTimeout(() => setSavedMsg(''), 3000);
      }
    } catch {
      alert('Сақлашда хатолик юз берди');
    }
  };

  const handleCardFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    setSettings({ ...settings, cardNumber: formatted.slice(0, 19) });
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] font-serif">Тўлов тизимлари</h1>
            <p className="text-[#64748b] mt-1">Обуначилар тўлов қилиши учун пластик карта маълумотлари</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6 relative overflow-hidden">
          {/* Card Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1e3a8a]/5 to-[#3b82f6]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />

          {loading ? (
            <div className="py-8 text-center text-[#64748b]">Юкланмоқда...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6 relative z-10">
              {/* Virtual Card Preview */}
              <div className="mb-8 w-full max-w-sm mx-auto h-48 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-2xl shadow-xl p-6 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-8 -mb-8" />
                
                <div className="flex justify-between items-start">
                  <div className="w-12 h-8 bg-yellow-400/80 rounded flex items-center justify-center border border-yellow-300/50">
                    <div className="w-8 h-5 border border-yellow-600/30 rounded-sm" />
                  </div>
                  <span className="font-bold italic opacity-80">{settings.bankName || 'Банк номи'}</span>
                </div>
                
                <div>
                  <p className="font-mono text-xl tracking-[0.15em] mb-2 text-white/90">
                    {settings.cardNumber || '#### #### #### ####'}
                  </p>
                  <p className="text-sm font-semibold tracking-widest uppercase opacity-80">
                    {settings.cardOwner || 'Исм Шарифов'}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Пластик карта рақами</label>
                  <input
                    type="text"
                    required
                    value={settings.cardNumber}
                    onChange={handleCardFormat}
                    placeholder="8600 1234 5678 9012"
                    className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] font-mono text-lg tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Карта эгасининг исми-шарифи</label>
                  <input
                    type="text"
                    required
                    value={settings.cardOwner}
                    onChange={e => setSettings({ ...settings, cardOwner: e.target.value.toUpperCase() })}
                    placeholder="ALISHER NAVOIY"
                    className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1e293b] mb-2">Банк ёки тўлов тизими номи</label>
                  <input
                    type="text"
                    required
                    value={settings.bankName}
                    onChange={e => setSettings({ ...settings, bankName: e.target.value })}
                    placeholder="Uzcard / Humo / TBC"
                    className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#e5e7eb]">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium shadow-md"
                >
                  💾 Сақлаш
                </button>
                {savedMsg && <span className="text-green-600 font-medium">{savedMsg}</span>}
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
