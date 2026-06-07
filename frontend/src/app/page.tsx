'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiUrl } from '@/lib/api';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import SearchBar from '@/components/SearchBar';
import CategorySection from '@/components/CategorySection';
import AdminPanel from '@/components/AdminPanel';
import LoginModal from '@/components/LoginModal';
import AccountModal from '@/components/AccountModal';

interface Bookmark {
  id: number;
  category_id: number;
  title: string;
  url: string;
  description: string;
  icon: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  sort_order: number;
  bookmarks: Bookmark[];
}

function HomePage() {
  const { user, logout, isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [needAdmin, setNeedAdmin] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/categories'));
      const json = await res.json();
      if (json.code === 0) setCategories(json.data);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 需求1：从管理页回到首页自动刷新
  useEffect(() => {
    if (!showAdmin) fetchCategories();
  }, [showAdmin]);

  // 需求1：页面可见时刷新
  useEffect(() => {
    const handler = () => { if (!document.hidden) fetchCategories(); };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [fetchCategories]);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    bookmarks: cat.bookmarks.filter(b =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.bookmarks.length > 0 || cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (needAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow text-center space-y-4">
          <p className="text-lg font-medium">需要管理员权限</p>
          <p className="text-gray-500">请先登录管理员账号</p>
          <button onClick={() => setShowLogin(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            去登录
          </button>
          <button onClick={() => setNeedAdmin(false)} className="block mx-auto text-gray-400 hover:text-gray-600">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-800">🧭 个人导航站</h1>
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.username}</span>
                {isAdmin && (
                  <button onClick={() => setShowAdmin(true)} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                    管理
                  </button>
                )}
                <button onClick={() => setShowAccount(true)} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
                  账号
                </button>
                <button onClick={logout} className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded">
                  退出
                </button>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                登录
              </button>
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">加载中...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {searchQuery ? '没有找到匹配的结果' : '暂无数据'}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map(cat => (
              <CategorySection key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </main>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}
