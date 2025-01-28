import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ChevronLeft,
  Home,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  User,
  DollarSign,
  Tag,
  MessageSquare,
  FileText,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  CalendarDays,
  Clock4
} from 'lucide-react';

interface Consultation {
  id: string;
  customerId: string;
  customerName: string;
  service: string;
  date: string;
  startTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  cost: number;
  notes: string;
  tags: string[];
  result: string;
  followUpRequired: boolean;
  nextAppointment?: string;
}

// モックデータ
const mockConsultations: Consultation[] = [
  {
    id: "CS001",
    customerId: "C001",
    customerName: "山田 花子",
    service: "タロット占い",
    date: "2024-02-15",
    startTime: "14:00",
    duration: 60,
    status: "completed",
    cost: 8500,
    notes: "仕事の転機について相談。カードは概ね前向きな結果。",
    tags: ["キャリア", "重要", "フォローアップ必要"],
    result: "3ヶ月以内に良い転機が訪れる可能性が高い。特に4月が重要な時期。",
    followUpRequired: true,
    nextAppointment: "2024-03-15"
  },
  {
    id: "CS002",
    customerId: "C002",
    customerName: "鈴木 一郎",
    service: "四柱推命",
    date: "2024-02-16",
    startTime: "15:30",
    duration: 90,
    status: "scheduled",
    cost: 12000,
    notes: "結婚運について詳しく見てほしいとの要望。",
    tags: ["恋愛", "結婚"],
    result: "",
    followUpRequired: false
  }
];

interface FilterOptions {
  status: string;
  service: string;
  dateRange: string;
  tags: string[];
}

export default function ConsultationManagement() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: 'all',
    service: 'all',
    dateRange: 'all',
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        // TODO: 実際のAPIコールに置き換える
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConsultations(mockConsultations);
      } catch (error) {
        console.error('Failed to fetch consultations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // TODO: 検索ロジックの実装
  };

  const handleFilter = (options: FilterOptions) => {
    setFilterOptions(options);
    // TODO: フィルタリングロジックの実装
  };

  const handleAddConsultation = () => {
    setShowAddModal(true);
  };

  const handleEditConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowEditModal(true);
  };

  const handleDeleteConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowDeleteConfirm(true);
  };

  const handleExportData = () => {
    // TODO: エクスポート機能の実装
  };

  const handleImportData = () => {
    // TODO: インポート機能の実装
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
      <nav className="p-4 bg-purple-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/business')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <ChevronLeft size={24} />
            <span>戻る</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <Home size={24} />
            <span>ホーム</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">占い相談管理</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddConsultation}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                <span>新規相談</span>
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportData}
                  className="p-2 text-purple-200 hover:text-purple-100"
                  title="エクスポート"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={handleImportData}
                  className="p-2 text-purple-200 hover:text-purple-100"
                  title="インポート"
                >
                  <Upload size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* 検索とフィルター */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="相談を検索..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-800/30 rounded-lg hover:bg-purple-700/40 transition-colors"
            >
              <Filter size={20} />
              <span>フィルター</span>
            </button>
          </div>

          {/* フィルターパネル */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-purple-800/20 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ステータス</label>
                  <select
                    value={filterOptions.status}
                    onChange={(e) => handleFilter({ ...filterOptions, status: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                  >
                    <option value="all">すべて</option>
                    <option value="scheduled">予約済み</option>
                    <option value="completed">完了</option>
                    <option value="cancelled">キャンセル</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">サービス</label>
                  <select
                    value={filterOptions.service}
                    onChange={(e) => handleFilter({ ...filterOptions, service: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                  >
                    <option value="all">すべて</option>
                    <option value="tarot">タロット占い</option>
                    <option value="fourpillars">四柱推命</option>
                    <option value="palm">手相占い</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">期間</label>
                  <select
                    value={filterOptions.dateRange}
                    onChange={(e) => handleFilter({ ...filterOptions, dateRange: e.target.value })}
                    className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                  >
                    <option value="all">すべて</option>
                    <option value="today">今日</option>
                    <option value="tomorrow">明日</option>
                    <option value="week">今週</option>
                    <option value="month">今月</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">タグ</label>
                  <div className="flex flex-wrap gap-2">
                    {['キャリア', '恋愛', '健康', '金運', 'フォローアップ必要'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          const newTags = filterOptions.tags.includes(tag)
                            ? filterOptions.tags.filter(t => t !== tag)
                            : [...filterOptions.tags, tag];
                          handleFilter({ ...filterOptions, tags: newTags });
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filterOptions.tags.includes(tag)
                            ? 'bg-purple-500 text-white'
                            : 'bg-purple-900/20 text-purple-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 相談リスト */}
          <div className="bg-purple-800/20 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-900/50">
                    <th className="px-6 py-3 text-left text-sm font-medium">日時</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">顧客名</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">サービス</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">ステータス</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">料金</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">タグ</th>
                    <th className="px-6 py-3 text-right text-sm font-medium">アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-700/30">
                  {consultations.map((consultation) => (
                    <tr
                      key={consultation.id}
                      className="hover:bg-purple-700/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{consultation.date}</div>
                          <div className="text-sm text-purple-300">{consultation.startTime} ({consultation.duration}分)</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{consultation.customerName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{consultation.service}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          consultation.status === 'completed'
                            ? 'bg-green-500/20 text-green-300'
                            : consultation.status === 'scheduled'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {consultation.status === 'completed' ? '完了' : consultation.status === 'scheduled' ? '予約済み' : 'キャンセル'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">¥{consultation.cost.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {consultation.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-800/30 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {consultation.tags.length > 2 && (
                            <span className="px-2 py-1 bg-purple-800/30 rounded-full text-xs">
                              +{consultation.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditConsultation(consultation)}
                          className="text-purple-300 hover:text-purple-100"
                          title="編集"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteConsultation(consultation)}
                          className="text-purple-300 hover:text-red-400"
                          title="削除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* 相談詳細モーダル */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-purple-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">相談詳細</h2>
                  <div className="flex items-center space-x-4 text-purple-300">
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      {selectedConsultation.customerName}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      {selectedConsultation.date}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      {selectedConsultation.startTime} ({selectedConsultation.duration}分)
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="text-purple-300 hover:text-purple-100"
                >
                  <AlertCircle size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">基本情報</h3>
                    <div className="bg-purple-800/20 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300">サービス</span>
                        <span>{selectedConsultation.service}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300">ステータス</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedConsultation.status === 'completed'
                            ? 'bg-green-500/20 text-green-300'
                            : selectedConsultation.status === 'scheduled'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {selectedConsultation.status === 'completed' ? '完了' : selectedConsultation.status === 'scheduled' ? '予約済み' : 'キャンセル'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300">料金</span>
                        <span>¥{selectedConsultation.cost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedConsultation.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-purple-800/30 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">メモ</h3>
                    <div className="bg-purple-800/20 rounded-lg p-4">
                      <p className="text-purple-200">{selectedConsultation.notes}</p>
                    </div>
                  </div>

                  {selectedConsultation.status === 'completed' && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">鑑定結果</h3>
                      <div className="bg-purple-800/20 rounded-lg p-4">
                        <p className="text-purple-200">{selectedConsultation.result}</p>
                      </div>
                    </div>
                  )}

                  {selectedConsultation.followUpRequired && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">フォローアップ</h3>
                      <div className="bg-purple-800/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-purple-300">次回予約</span>
                          <span>{selectedConsultation.nextAppointment}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 新規相談追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-purple-900 rounded-lg shadow-xl max-w-2xl w-full"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">新規相談予約</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">顧客名</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                      placeholder="顧客を選択または検索"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">サービス</label>
                    <select
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                    >
                      <option value="">サービスを選択</option>
                      <option value="tarot">タロット占い</option>
                      <option value="fourpillars">四柱推命</option>
                      <option value="palm">手相占い</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">日付</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">時間</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">所要時間（分）</label>
                    <select
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                    >
                      <option value="30">30分</option>
                      <option value="60">60分</option>
                      <option value="90">90分</option>
                      <option value="120">120分</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">料金</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                      placeholder="¥"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">メモ</label>
                  <textarea
                    className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 h-32"
                    placeholder="相談内容や特記事項があれば入力してください"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-purple-300 hover:text-purple-100"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    予約
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {showDeleteConfirm && selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-purple-900 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">相談予約の削除</h2>
              <p className="mb-6">
                {selectedConsultation.customerName}さんの{selectedConsultation.date} {selectedConsultation.startTime}の予約を削除しますか？
                この操作は取り消せません。
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-purple-300 hover:text-purple-100"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    // TODO: 削除処理の実装
                    setShowDeleteConfirm(false);
                    setSelectedConsultation(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  削除
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 