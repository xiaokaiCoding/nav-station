'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

interface Props {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'categories' | 'bookmarks'>('categories');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const res = await fetch(`${API_URL}/api/categories`);
    const json = await res.json();
    if (json.code === 0) setCategories(json.data);
  };

  // Category CRUD
  const saveCategory = async (data: Partial<Category>) => {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `${API_URL}/api/categories/${data.id}` : `${API_URL}/api/categories`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setShowCategoryForm(false);
    setEditingCategory(null);
    fetchData();
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('确定删除此分类及其所有书签？')) return;
    await fetch(`${API_URL}/api/categories/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Bookmark CRUD
  const saveBookmark = async (data: Partial<Bookmark>) => {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `${API_URL}/api/bookmarks/${data.id}` : `${API_URL}/api/bookmarks`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setShowBookmarkForm(false);
    setEditingBookmark(null);
    fetchData();
  };

  const deleteBookmark = async (id: number) => {
    if (!confirm('确定删除此书签？')) return;
    await fetch(`${API_URL}/api/bookmarks/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">⚙️ 管理后台</h1>
          <button onClick={onBack} className="px-4 py-2 text-sm border rounded hover:bg-gray-50">
            返回首页
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {(['categories', 'bookmarks'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 font-medium transition ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab === 'categories' ? '分类管理' : '书签管理'}
            </button>
          ))}
        </div>

        {/* Category Management */}
        {activeTab === 'categories' && (
          <div>
            <button
              onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + 新增分类
            </button>
            <div className="bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">图标</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">书签数</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">排序</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 text-xl">{cat.icon}</td>
                      <td className="px-4 py-3 font-medium">{cat.name}</td>
                      <td className="px-4 py-3 text-gray-500">{cat.bookmarks?.length || 0}</td>
                      <td className="px-4 py-3 text-gray-500">{cat.sort_order}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => { setEditingCategory(cat); setShowCategoryForm(true); }} className="text-blue-500 hover:underline">编辑</button>
                        <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:underline">删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookmark Management */}
        {activeTab === 'bookmarks' && (
          <div>
            {/* Category filter */}
            <div className="flex gap-2 mb-4 flex-wrap items-center">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-3 py-1 rounded-full text-sm ${selectedCategoryId === null ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                全部
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategoryId === cat.id ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
              <button
                onClick={() => { setEditingBookmark(null); setShowBookmarkForm(true); }}
                className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + 新增书签
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">链接</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">分类</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {categories
                    .filter(cat => selectedCategoryId === null || cat.id === selectedCategoryId)
                    .flatMap(cat => cat.bookmarks?.map(bm => ({ ...bm, category_name: cat.name })) || [])
                    .map(bm => (
                      <tr key={bm.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{bm.title}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm truncate max-w-xs">{bm.url}</td>
                        <td className="px-4 py-3 text-gray-500">{(bm as any).category_name}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button onClick={() => { setEditingBookmark(bm); setShowBookmarkForm(true); }} className="text-blue-500 hover:underline">编辑</button>
                          <button onClick={() => deleteBookmark(bm.id)} className="text-red-500 hover:underline">删除</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Category Form Modal */}
        {showCategoryForm && (
          <CategoryFormModal
            category={editingCategory}
            onSave={saveCategory}
            onCancel={() => { setShowCategoryForm(false); setEditingCategory(null); }}
          />
        )}

        {/* Bookmark Form Modal */}
        {showBookmarkForm && (
          <BookmarkFormModal
            bookmark={editingBookmark}
            categories={categories}
            onSave={saveBookmark}
            onCancel={() => { setShowBookmarkForm(false); setEditingBookmark(null); }}
          />
        )}
      </div>
    </div>
  );
}

// Category Form
function CategoryFormModal({ category, onSave, onCancel }: {
  category: Category | null;
  onSave: (data: Partial<Category>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || '');
  const [sort_order, setSortOrder] = useState(category?.sort_order || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ id: category?.id, name: name.trim(), icon: icon.trim(), sort_order });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">{category ? '编辑分类' : '新增分类'}</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">图标 (emoji)</label>
          <input value={icon} onChange={e => setIcon(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="🔍" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
          <input type="number" value={sort_order} onChange={e => setSortOrder(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">取消</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">保存</button>
        </div>
      </form>
    </div>
  );
}

// Bookmark Form
function BookmarkFormModal({ bookmark, categories, onSave, onCancel }: {
  bookmark: Bookmark | null;
  categories: Category[];
  onSave: (data: Partial<Bookmark>) => void;
  onCancel: () => void;
}) {
  const [category_id, setCategoryId] = useState(bookmark?.category_id || categories[0]?.id || 0);
  const [title, setTitle] = useState(bookmark?.title || '');
  const [url, setUrl] = useState(bookmark?.url || '');
  const [description, setDescription] = useState(bookmark?.description || '');
  const [icon, setIcon] = useState(bookmark?.icon || '');
  const [sort_order, setSortOrder] = useState(bookmark?.sort_order || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onSave({ id: bookmark?.id, category_id, title: title.trim(), url: url.trim(), description: description.trim(), icon: icon.trim(), sort_order });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">{bookmark ? '编辑书签' : '新增书签'}</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select value={category_id} onChange={e => setCategoryId(Number(e.target.value))} className="w-full border rounded px-3 py-2">
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">链接</label>
          <input value={url} onChange={e => setUrl(e.target.value)} className="w-full border rounded px-3 py-2" type="url" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <input value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">图标 URL</label>
          <input value={icon} onChange={e => setIcon(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
          <input type="number" value={sort_order} onChange={e => setSortOrder(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">取消</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">保存</button>
        </div>
      </form>
    </div>
  );
}
