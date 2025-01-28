import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';

export function ProfileSettings() {
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
          <h1 className="text-3xl font-bold mb-8">プロフィール設定</h1>
          
          <div className="space-y-6">
            <div className="bg-purple-800/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">基本情報</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">表示名</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">メールアドレス</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">自己紹介</label>
                  <textarea
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">占い師プロフィール</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">専門分野</label>
                  <div className="space-y-2">
                    {['タロット', '四柱推命', '手相', '占星術'].map(field => (
                      <label key={field} className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox text-purple-600" />
                        <span>{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">経験年数</label>
                  <select className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">選択してください</option>
                    <option value="1-3">1-3年</option>
                    <option value="4-6">4-6年</option>
                    <option value="7-10">7-10年</option>
                    <option value="10+">10年以上</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">資格・認定</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="例：タロットマスター認定"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Save size={20} />
                <span>保存</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 