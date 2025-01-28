import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Bell, Mail, Phone, Calendar } from 'lucide-react';

export function NotificationSettings() {
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
          <h1 className="text-3xl font-bold mb-8">通知設定</h1>
          
          <div className="space-y-6">
            <div className="bg-purple-800/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">メール通知</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-purple-600" />
                    <span>予約の確認メール</span>
                  </label>
                  <p className="mt-1 text-sm text-purple-300">
                    新しい予約が入った時に確認メールを送信します。
                  </p>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-purple-600" />
                    <span>予約のリマインダーメール</span>
                  </label>
                  <p className="mt-1 text-sm text-purple-300">
                    予約の24時間前にリマインダーメールを送信します。
                  </p>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-purple-600" />
                    <span>マーケティングメール</span>
                  </label>
                  <p className="mt-1 text-sm text-purple-300">
                    新機能や特別なお知らせなどのマーケティングメールを受け取ります。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">SMS通知</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-purple-600" />
                    <span>予約のリマインダーSMS</span>
                  </label>
                  <p className="mt-1 text-sm text-purple-300">
                    予約の2時間前にSMSでリマインダーを送信します。
                  </p>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-purple-600" />
                    <span>キャンセル通知</span>
                  </label>
                  <p className="mt-1 text-sm text-purple-300">
                    予約がキャンセルされた時にSMSで通知します。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">アプリ内通知</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-purple-600" />
                    <span>新規予約通知</span>
                  </label>
                  <p className="mt-1 text-sm text-purple-300">
                    新しい予約が入った時にアプリ内で通知します。
                  </p>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-purple-600" />
                    <span>予約変更通知</span>
                  </label>
                  <p className="mt-1 text-sm text-purple-300">
                    予約の変更やキャンセルがあった時にアプリ内で通知します。
                  </p>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-purple-600" />
                    <span>システム通知</span>
                  </label>
                  <p className="mt-1 text-sm text-purple-300">
                    メンテナンスや重要なお知らせをアプリ内で通知します。
                  </p>
                </div>
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