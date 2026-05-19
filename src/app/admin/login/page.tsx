'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Логин ёки пароль нотўғри!');
        return;
      }
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', username);
      router.push('/admin/dashboard');
    } catch {
      setError('Серверга уланиб бўлмади');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#1e3a8a] font-serif tracking-wider">
            VATAN
          </h1>
          <p className="text-[#64748b] mt-2 text-sm">Администратор панели</p>
          <div className="w-16 h-1 bg-[#b45309] mx-auto mt-4"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#1e293b] mb-2">
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] transition-colors"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1e293b] mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Кириш...' : 'Кириш'}
          </button>
        </form>


        {/* Back to site */}
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-[#64748b] hover:text-[#1e3a8a] transition-colors">
            ← Сайтга қайтиш
          </a>
        </div>
      </div>
    </div>
  );
}
