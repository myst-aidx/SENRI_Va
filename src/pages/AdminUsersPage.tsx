import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, UserPlus, Mail, Check, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isTestUser: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'test'>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/admin/users`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // 開発環境用のモックデータ
      if (import.meta.env.DEV) {
        setUsers([
          {
            id: '1',
            name: '管理者',
            email: 'admin@example.com',
            isAdmin: true,
            isTestUser: false,
            createdAt: '2024-01-01T00:00:00Z',
            lastLoginAt: '2024-01-02T00:00:00Z'
          },
          {
            id: '2',
            name: 'テストユーザー1',
            email: 'test1@example.com',
            isAdmin: false,
            isTestUser: true,
            createdAt: '2024-01-01T00:00:00Z',
            lastLoginAt: null
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async () => {
    try {
      setError(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/admin/users/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send invitation');
      }

      setShowInviteModal(false);
      setInviteEmail('');
      // 成功メッセージを表示するなどの処理を追加
    } catch (error) {
      setError(error instanceof Error ? error.message : '招待の送信に失敗しました');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      filterRole === 'all' ||
      (filterRole === 'admin' && user.isAdmin) ||
      (filterRole === 'test' && user.isTestUser);
    
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return <LoadingSpinner message="ユーザー情報を読み込んでいます..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-100">ユーザー管理</h2>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          テストユーザーを招待
        </button>
      </div>

      <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ユーザーを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 placeholder-purple-400"
              />
            </div>
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'test')}
            className="px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
          >
            <option value="all">全てのユーザー</option>
            <option value="admin">管理者</option>
            <option value="test">テストユーザー</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="px-4 py-2 text-left text-purple-200">名前</th>
                <th className="px-4 py-2 text-left text-purple-200">メール</th>
                <th className="px-4 py-2 text-left text-purple-200">権限</th>
                <th className="px-4 py-2 text-left text-purple-200">登録日</th>
                <th className="px-4 py-2 text-left text-purple-200">最終ログイン</th>
                <th className="px-4 py-2 text-left text-purple-200">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-purple-700/30 hover:bg-purple-800/20"
                >
                  <td className="px-4 py-2 text-purple-200">{user.name}</td>
                  <td className="px-4 py-2 text-purple-200">{user.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.isAdmin
                          ? 'bg-amber-500/20 text-amber-300'
                          : user.isTestUser
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {user.isAdmin ? '管理者' : user.isTestUser ? 'テストユーザー' : '一般'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-purple-200">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-purple-200">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.lastLoginAt
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {user.lastLoginAt ? 'アクティブ' : '未ログイン'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-purple-300">
            該当するユーザーが見つかりません
          </div>
        )}
      </div>

      {/* 招待モーダル */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-900 border border-purple-700 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-purple-100 mb-4">
              テストユーザーを招待
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-400 bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex items-center px-4 py-2 border border-purple-700/50 rounded-lg text-purple-200 hover:bg-purple-800/30"
                >
                  <X className="w-4 h-4 mr-2" />
                  キャンセル
                </button>
                <button
                  onClick={handleInvite}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
                >
                  <Check className="w-4 h-4 mr-2" />
                  招待を送信
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 