'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  phone: string;
  name: string;
  premiumUntil: string | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (u: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isPremium: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/user/auth');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (u: User) => setUser(u);
  
  const logout = async () => {
    await fetch('/api/user/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    });
    setUser(null);
  };

  const isPremium = user?.premiumUntil ? new Date(user.premiumUntil) > new Date() : false;

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refreshUser, isPremium }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
