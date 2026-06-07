'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { apiUrl } from '@/lib/api';

interface Props { onClose: () => void; }

interface User { id: number; username: string; role: string; created_at: string; updated_at: string; }

export default function AccountModal({ onClose }: Props) {
  const { user, token, logout } = useAuth();
  const [tab, setTab] = useState<'password' | 'users'>('password');
  const [users, setUsers] = useState<User[]>([]);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'ok' | 'err'>('ok');

  const apiBase = apiUrl('/api');

  useEffect(() => { if (user?.role === 'admin') fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await fetch(`${apiBase}/auth/users`, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    if (json.code === 0) setUsers(json.data);
  };

  const changePassword = async () => {
    setMsg('');
    if (newPwd !== confirmPwd) { setMsg('两次密码不一致'); setMsgType('err'); return; }
    if (newPwd.length < 6) { setMsg('新密码至少6位'); setMsgType('err'); return; }
    const res = await fetch(`${apiBase}/auth/change-password`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId: user?.id, oldPassword: oldPwd, newPassword: newPwd })
    });
    const json = await res.json();
    if (json.code === 0) { setMsg('密码修改成功'); setMsgType('ok'); setOldPwd(''); setNewPwd(''); setConfirmPwd(''); }
    else { setMsg(json.message); setMsgType('err'); }
  };

  const updateUserRole = async (id: number, role: string) => {
    await fetch(`${apiBase}/auth/users/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role })
    });
    fetchUsers();
  };

  const deleteUser = async (id: number) => {
    if (!confirm('确定删除此用户？')) return;
    await fetch(`${apiBase}/auth/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">账号管理</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="flex gap-4 border-b">
          <button onClick={() => setTab('password')} className={`pb-2 font-medium ${tab === 'password' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}>修改密码</button>
          {user?.role === 'admin' && (
            <button onClick={() => setTab('users')} className={`pb-2 font-medium ${tab === 'users' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}>用户管理</button>
          )}
        </div>
        {tab === 'password' && (
          <div className="space-y-3">
            <input className="w-full border rounded px-3 py-2" type="password" placeholder="旧密码" value={oldPwd} onChange={e => setOldPwd(e.target.value)} />
            <input className="w-full border rounded px-3 py-2" type="password" placeholder="新密码" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
            <input className="w-full border rounded px-3 py-2" type="password" placeholder="确认新密码" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
            {msg && <p className={`text-sm ${msgType === 'ok' ? 'text-green-500' : 'text-red-500'}`}>{msg}</p>}
            <button onClick={changePassword} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">确认修改</button>
          </div>
        )}
        {tab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left">用户名</th><th className="px-3 py-2 text-left">角色</th><th className="px-3 py-2 text-left">注册时间</th><th className="px-3 py-2 text-right">操作</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{u.username}</td>
                    <td className="px-3 py-2">{u.role === 'admin' ? '管理员' : '普通用户'}</td>
                    <td className="px-3 py-2 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-2 text-right space-x-1">
                      {u.role === 'admin' ? (
                        <button onClick={() => updateUserRole(u.id, 'user')} className="text-orange-500 hover:underline text-xs">降级</button>
                      ) : (
                        <button onClick={() => updateUserRole(u.id, 'admin')} className="text-blue-500 hover:underline text-xs">升级</button>
                      )}
                      {u.id !== user?.id && (
                        <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:underline text-xs">删除</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
