import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Calendar, Video, Mail, MessageCircle } from 'lucide-react';

export function IntegrationSettings() {
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
          <h1 className="text-3xl font-bold mb-8">外部連携設定</h1>
          
          <div className="space-y-6">
            <div className="bg-purple-800/20 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Google Calendar</h2>
                  <p className="text-purple-300">予約をGoogleカレンダーと同期します。</p>
                </div>
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Calendar size={20} />
                  <span>連携する</span>
                </button>
              </div>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Zoom</h2>
                  <p className="text-purple-300">オンライン占い用のビデオ会議を自動で作成します。</p>
                </div>
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Video size={20} />
                  <span>連携する</span>
                </button>
              </div>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">メール配信サービス</h2>
                  <p className="text-purple-300">予約確認やリマインダーメールを自動で送信します。</p>
                </div>
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Mail size={20} />
                  <span>連携する</span>
                </button>
              </div>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">LINE公式アカウント</h2>
                  <p className="text-purple-300">LINEでの予約受付や通知送信を有効にします。</p>
                </div>
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <MessageCircle size={20} />
                  <span>連携する</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Save size={20} />
                <span>設定を保存</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 