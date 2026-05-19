'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { refreshUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/user/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          phone,
          password,
          name: !isLogin ? name : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshUser();
        router.push('/profile');
      } else {
        setError(data.error || 'Хатолик юз берди');
      }
    } catch {
      setError('Тармоқда хатолик');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-[#e5e7eb]">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#1e3a8a] font-serif tracking-widest block mb-2">VATAN</Link>
          <h1 className="text-2xl font-bold text-[#1e293b]">{isLogin ? 'Тизимга кириш' : 'Рўйхатдан ўтиш'}</h1>
          <p className="text-[#64748b] mt-2">
            {isLogin ? 'Шахсий кабинетга кириш учун маълумотларни киритинг' : 'Журналга обуна бўлиш учун рўйхатдан ўтинг'}
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 font-medium text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-[#1e293b] mb-1">Исм-шарифингиз</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" placeholder="Алишер Навоий" />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-[#1e293b] mb-1">Телефон рақам</label>
            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" placeholder="+998 90 123 45 67" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1e293b] mb-1">Пароль</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a]" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-70">
            {loading ? 'Кутинг...' : (isLogin ? 'Кириш' : 'Рўйхатдан ўтиш')}
          </button>
        </form>

        <p className="text-center mt-6 text-[#64748b] text-sm">
          {isLogin ? 'Аккаунтингиз йўқми?' : 'Аллақачон рўйхатдан ўтганмисиз?'}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="ml-1 text-[#1e3a8a] font-semibold hover:underline">
            {isLogin ? 'Рўйхатдан ўтиш' : 'Кириш'}
          </button>
        </p>
      </div>
    </div>
  );
}
