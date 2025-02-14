import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Filter, Search } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface SurveyResponse {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  experience: string;
  activityType: string[];
  fortuneTypes: string[];
  challenges: string[];
  deviceUsage: string;
  marketingChannels: string[];
  expectedFeatures: string[];
  importantFactors: string[];
  feedback?: string;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExperience, setFilterExperience] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchSurveyResponses();
  }, []);

  const fetchSurveyResponses = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/admin/survey-responses`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch survey responses');
      }

      const data = await response.json();
      setSurveyResponses(data);
    } catch (error) {
      console.error('Error fetching survey responses:', error);
      // 開発環境用のモックデータ
      if (import.meta.env.DEV) {
        setSurveyResponses([
          {
            id: '1',
            submittedAt: '2024-01-01T00:00:00Z',
            name: '山田太郎',
            email: 'test@example.com',
            experience: '既に占い師として活動している',
            activityType: ['個人で占い師として活動している'],
            fortuneTypes: ['タロット', '四柱推命'],
            challenges: ['集客が難しい', '価格設定が難しい'],
            deviceUsage: 'スマートフォンが中心',
            marketingChannels: ['SNSを活用した集客'],
            expectedFeatures: ['AIによる占い結果作成支援'],
            importantFactors: ['売上向上への貢献'],
            feedback: 'とても期待しています'
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      '提出日時',
      '名前',
      'メールアドレス',
      '経験',
      '活動タイプ',
      '占術の種類',
      '課題',
      'デバイス使用状況',
      'マーケティング',
      '期待する機能',
      '重要視する点',
      'フィードバック'
    ];

    const csvData = surveyResponses.map(response => [
      new Date(response.submittedAt).toLocaleString(),
      response.name,
      response.email,
      response.experience,
      response.activityType.join(', '),
      response.fortuneTypes.join(', '),
      response.challenges.join(', '),
      response.deviceUsage,
      response.marketingChannels.join(', '),
      response.expectedFeatures.join(', '),
      response.importantFactors.join(', '),
      response.feedback || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `survey_responses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredResponses = surveyResponses
    .filter(response => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        response.name.toLowerCase().includes(searchLower) ||
        response.email.toLowerCase().includes(searchLower) ||
        response.feedback?.toLowerCase().includes(searchLower);
      
      const matchesExperience = filterExperience === 'all' || response.experience === filterExperience;
      
      return matchesSearch && matchesExperience;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
          : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });

  if (isLoading) {
    return <LoadingSpinner message="アンケート結果を読み込んでいます..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-200 hover:text-purple-100"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            戻る
          </button>
          <h1 className="text-2xl font-bold text-purple-100">アンケート結果管理</h1>
          <button
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            CSVエクスポート
          </button>
        </div>

        <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 placeholder-purple-400"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
              >
                <option value="all">全ての経験レベル</option>
                <option value="既に占い師として活動している">既に活動中</option>
                <option value="これから占い師として活動を始めたい">これから開始</option>
                <option value="占いを学んでいる途中">学習中</option>
                <option value="占いに興味がある">興味あり</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as ['date' | 'name', 'asc' | 'desc'];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
              >
                <option value="date-desc">新しい順</option>
                <option value="date-asc">古い順</option>
                <option value="name-asc">名前（昇順）</option>
                <option value="name-desc">名前（降順）</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="px-4 py-2 text-left text-purple-200">提出日時</th>
                  <th className="px-4 py-2 text-left text-purple-200">名前</th>
                  <th className="px-4 py-2 text-left text-purple-200">メール</th>
                  <th className="px-4 py-2 text-left text-purple-200">経験</th>
                  <th className="px-4 py-2 text-left text-purple-200">占術</th>
                  <th className="px-4 py-2 text-left text-purple-200">課題</th>
                </tr>
              </thead>
              <tbody>
                {filteredResponses.map((response) => (
                  <tr
                    key={response.id}
                    className="border-b border-purple-700/30 hover:bg-purple-800/20"
                  >
                    <td className="px-4 py-2 text-purple-200">
                      {new Date(response.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-purple-200">{response.name}</td>
                    <td className="px-4 py-2 text-purple-200">{response.email}</td>
                    <td className="px-4 py-2 text-purple-200">{response.experience}</td>
                    <td className="px-4 py-2 text-purple-200">
                      <div className="flex flex-wrap gap-1">
                        {response.fortuneTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-block px-2 py-1 text-xs bg-purple-700/30 rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-purple-200">
                      <div className="flex flex-wrap gap-1">
                        {response.challenges.map((challenge) => (
                          <span
                            key={challenge}
                            className="inline-block px-2 py-1 text-xs bg-purple-700/30 rounded-full"
                          >
                            {challenge}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredResponses.length === 0 && (
            <div className="text-center py-8 text-purple-300">
              該当するアンケート結果が見つかりません
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 