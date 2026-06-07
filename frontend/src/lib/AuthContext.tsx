'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, login: () => {}, logout: () => {}, isAdmin: false
});

// 简单解码 JWT payload 检查过期时间
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('nav_token');
    const u = localStorage.getItem('nav_user');
    if (t && u && !isTokenExpired(t)) {
      setToken(t);
      setUser(JSON.parse(u));
    } else {
      localStorage.removeItem('nav_token');
      localStorage.removeItem('nav_user');
    }
  }, []);

  const login = (t: string, u: User) => {
    setToken(t); setUser(u);
    localStorage.setItem('nav_token', t);
    localStorage.setItem('nav_user', JSON.stringify(u));
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem('nav_token');
    localStorage.removeItem('nav_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
