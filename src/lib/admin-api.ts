'use client';

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('adminToken') || '';
}

export function adminHeaders(hasBody = true): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = {
    'x-admin-token': token,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function adminFetch(url: string, options: RequestInit = {}) {
  const hasBody = !!options.body;
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
    credentials: 'include',
    headers: {
      ...adminHeaders(hasBody),
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    let message = `Сўров бажарилмади (${response.status})`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    if (response.status === 401) {
      message = 'Кириш муддати тугади. Қайта киринг.';
    }
    throw new Error(message);
  }

  return response;
}
