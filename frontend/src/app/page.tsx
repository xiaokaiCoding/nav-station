'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import CategorySection from '@/components/CategorySection';
import AdminPanel from '@/components/AdminPanel';

interface Bookmark {
  id: number;
  category_id: number;
  title: string;
  url: string;
  description: string;
  icon: string;
  sort_order: number;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  sort_order: number;
  bookmarks: Bookmark[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const json = await res.json();
      if (json.code === 0) {
        setCategories(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    bookmarks: cat.bookmarks.filter(b =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.bookmarks.length > 0 || cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">🧭 个人导航站</h1>
          <button
            onClick={() => setShowAdmin(true)}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            管理
          </button>
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
            {searchQuery ? '没有找到匹配的结果' : '暂无数据，请先添加分类和书签'}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map(cat => (
              <CategorySection key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
