'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { apiUrl } from '@/lib/api';

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = isRegister ? apiUrl('/api/auth/register') : apiUrl('/api/auth/login');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const json = await res.json();
      if (json.code === 0) {
        if (isRegister) {
          setIsRegister(false);
          setError('注册成功，请登录');
        } else {
          login(json.data.token, json.data.user);
          onClose();
        }
      } else {
        setError(json.message);
      }
    } catch {
      setError('请求失败，请检查网络');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold">{isRegister ? '注册' : '登录'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border rounded px-3 py-2" placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} required />
          <input className="w-full border rounded px-3 py-2" placeholder="密码" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50">
            {loading ? '处理中...' : (isRegister ? '注册' : '登录')}
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center">
          {isRegister ? '已有账号？' : '没有账号？'}
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-blue-500 ml-1">
            {isRegister ? '去登录' : '去注册'}
          </button>
        </p>
      </div>
    </div>
  );
}
