import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, Key, Bell, Shield } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface Settings {
  emailNotifications: boolean;
  securityAlerts: boolean;
  testUserAutoApproval: boolean;
  maxTestUsers: number;
  testPeriodDays: number;
}

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    securityAlerts: true,
    testUserAutoApproval: false,
    maxTestUsers: 100,
    testPeriodDays: 30
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/admin/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '設定の保存に失敗しました');
      }

      setSuccessMessage('設定を保存しました');
    } catch (error) {
      setError(error instanceof Error ? error.message : '設定の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="設定を保存しています..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-100">管理者設定</h2>
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          設定を保存
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 text-green-400">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 通知設定 */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-purple-300 mr-2" />
            <h3 className="text-lg font-semibold text-purple-100">通知設定</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  emailNotifications: e.target.checked
                }))}
                className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20"
              />
              <span className="text-purple-200">メール通知を有効にする</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.securityAlerts}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  securityAlerts: e.target.checked
                }))}
                className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20"
              />
              <span className="text-purple-200">セキュリティアラートを有効にする</span>
            </label>
          </div>
        </div>

        {/* テストユーザー設定 */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-purple-300 mr-2" />
            <h3 className="text-lg font-semibold text-purple-100">テストユーザー設定</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.testUserAutoApproval}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  testUserAutoApproval: e.target.checked
                }))}
                className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20"
              />
              <span className="text-purple-200">テストユーザーの自動承認を有効にする</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                最大テストユーザー数
              </label>
              <input
                type="number"
                value={settings.maxTestUsers}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  maxTestUsers: parseInt(e.target.value)
                }))}
                min="1"
                className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                テスト期間（日数）
              </label>
              <input
                type="number"
                value={settings.testPeriodDays}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  testPeriodDays: parseInt(e.target.value)
                }))}
                min="1"
                className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 