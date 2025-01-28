import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Key, Shield } from 'lucide-react';

export function AccountSettings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
      <nav className="p-4 bg-purple-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <ChevronLeft size={24} />
            <span>戻る</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">アカウント設定</h1>
          
          <div className="space-y-6">
            <div className="bg-purple-800/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">パスワード変更</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">現在のパスワード</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">新しいパスワード</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">新しいパスワード（確認）</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Key size={20} />
                    <span>パスワードを変更</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">セキュリティ設定</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-purple-600" />
                    <span>二段階認証を有効にする</span>
                  </label>
                  <p className="mt-1 text-sm text-purple-300">
                    ログイン時に追加の認証コードを要求し、アカウントのセキュリティを強化します。
                  </p>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-purple-600" />
                    <span>ログイン通知を有効にする</span>
                  </label>
                  <p className="mt-1 text-sm text-purple-300">
                    新しいデバイスからのログインがあった場合にメールで通知します。
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Shield size={20} />
                    <span>セキュリティ設定を保存</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-red-900/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-300">アカウントの削除</h2>
              <p className="text-red-300 mb-4">
                アカウントを削除すると、すべてのデータが完全に削除され、復元することはできません。
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30"
                >
                  アカウントを削除
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 