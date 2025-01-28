import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  Home,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  Star,
  MessageCircle,
  Download,
  Upload,
  FileText,
  Tag,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  firstVisit: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  averageSpent: number;
  favoriteService: string;
  tags: string[];
  notes: string;
  status: 'active' | 'inactive' | 'vip';
  consultationHistory: Array<{
    date: string;
    service: string;
    duration: number;
    cost: number;
    notes: string;
  }>;
  nextAppointment?: string;
  zodiacSign?: string;
  bloodType?: string;
}

// モックデータ
const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "山田 花子",
    email: "hanako.yamada@example.com",
    phone: "090-1234-5678",
    birthDate: "1985-06-15",
    gender: "女性",
    firstVisit: "2023-01-10",
    lastVisit: "2024-01-20",
    totalVisits: 12,
    totalSpent: 102000,
    averageSpent: 8500,
    favoriteService: "タロット占い",
    tags: ["VIP", "リピーター", "誕生日6月"],
    notes: "人生相談を好む。特に仕事関連の相談が多い。",
    status: "vip",
    consultationHistory: [
      {
        date: "2024-01-20",
        service: "タロット占い",
        duration: 60,
        cost: 8500,
        notes: "キャリアの方向性について相談。前向きな結果。"
      },
      {
        date: "2023-12-15",
        service: "四柱推命",
        duration: 90,
        cost: 12000,
        notes: "2024年の運勢について詳しく解説。"
      }
    ],
    nextAppointment: "2024-02-15",
    zodiacSign: "蟹座",
    bloodType: "A型"
  },
  {
    id: "C002",
    name: "鈴木 一郎",
    email: "ichiro.suzuki@example.com",
    phone: "090-8765-4321",
    birthDate: "1990-11-23",
    gender: "男性",
    firstVisit: "2023-03-05",
    lastVisit: "2024-01-15",
    totalVisits: 8,
    totalSpent: 76000,
    averageSpent: 9500,
    favoriteService: "四柱推命",
    tags: ["リピーター", "夜間予約"],
    notes: "仕事と恋愛の相談が中心。",
    status: "active",
    consultationHistory: [
      {
        date: "2024-01-15",
        service: "四柱推命",
        duration: 60,
        cost: 9500,
        notes: "転職のタイミングについて相談。"
      }
    ],
    nextAppointment: "2024-02-10",
    zodiacSign: "牡羊座",
    bloodType: "O型"
  },
  {
    id: "C003",
    name: "佐藤美咲",
    email: "misaki.sato@example.com",
    phone: "090-2345-6789",
    birthDate: "1995-12-04",
    gender: "女性",
    firstVisit: "2024-01-10",
    lastVisit: "2024-01-15",
    totalVisits: 3,
    totalSpent: 35000,
    averageSpent: 11666.67,
    favoriteService: "手相占い",
    tags: ["恋愛相談"],
    notes: "恋愛に関する相談が多い。",
    status: "inactive",
    consultationHistory: [],
    nextAppointment: "2024-02-15",
    zodiacSign: "射手座",
    bloodType: "B型"
  }
];

interface FilterOptions {
  status: string[];
  dateRange: {
    start: string;
    end: string;
  };
  spentRange: {
    min: number;
    max: number;
  };
  services: string[];
  tags: string[];
}

export default function CustomerManagement() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: [],
    dateRange: { start: '', end: '' },
    spentRange: { min: 0, max: 0 },
    services: [],
    tags: []
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer;
    direction: 'asc' | 'desc';
  }>({ key: 'lastVisit', direction: 'desc' });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // TODO: 実際のAPIコールに置き換える
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCustomers(mockCustomers);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // TODO: 検索ロジックの実装
  };

  const handleFilter = (options: FilterOptions) => {
    setFilterOptions(options);
    // TODO: フィルタリングロジックの実装
  };

  const handleAddCustomer = () => {
    navigate('/business/customers/new');
  };

  const handleEditCustomer = (customer: Customer) => {
    navigate(`/business/customer/${customer.id}/edit`);
  };

  const handleCustomerClick = (customer: Customer) => {
    navigate(`/business/customer/${customer.id}`);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    // TODO: 削除処理の実装
  };

  const handleExportData = () => {
    // TODO: エクスポート機能の実装
  };

  const handleImportData = () => {
    // TODO: インポート機能の実装
  };

  const handleSort = (key: keyof Customer) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const filteredCustomers = sortedCustomers.filter(customer => {
    const searchRegex = new RegExp(searchTerm, 'i');
    return (
      searchRegex.test(customer.name) ||
      searchRegex.test(customer.email) ||
      searchRegex.test(customer.phone) ||
      customer.tags.some(tag => searchRegex.test(tag))
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'active':
        return 'bg-green-500/20 text-green-300';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-300';
      default:
        return 'bg-purple-500/20 text-purple-300';
    }
  };

  if (loading) {
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
            <h1 className="text-3xl font-bold">顧客管理</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddCustomer}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                <span>新規顧客</span>
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
                  placeholder="顧客を検索..."
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
              {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ステータス</label>
                  <div className="space-y-2">
                    {['vip', 'active', 'inactive'].map(status => (
                      <label key={status} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filterOptions.status.includes(status)}
                          onChange={(e) => {
                            setFilterOptions(prev => ({
                              ...prev,
                              status: e.target.checked
                                ? [...prev.status, status]
                                : prev.status.filter(s => s !== status)
                            }));
                          }}
                          className="form-checkbox text-purple-600"
                        />
                        <span>{status === 'vip' ? 'VIP' : status === 'active' ? 'アクティブ' : '非アクティブ'}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">来店期間</label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={filterOptions.dateRange.start}
                      onChange={(e) => {
                        setFilterOptions(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }));
                      }}
                      className="w-full px-3 py-2 bg-purple-900/30 rounded"
                    />
                    <input
                      type="date"
                      value={filterOptions.dateRange.end}
                      onChange={(e) => {
                        setFilterOptions(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }));
                      }}
                      className="w-full px-3 py-2 bg-purple-900/30 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">利用金額</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="最小金額"
                      value={filterOptions.spentRange.min}
                      onChange={(e) => {
                        setFilterOptions(prev => ({
                          ...prev,
                          spentRange: { ...prev.spentRange, min: Number(e.target.value) }
                        }));
                      }}
                      className="w-full px-3 py-2 bg-purple-900/30 rounded"
                    />
                    <input
                      type="number"
                      placeholder="最大金額"
                      value={filterOptions.spentRange.max}
                      onChange={(e) => {
                        setFilterOptions(prev => ({
                          ...prev,
                          spentRange: { ...prev.spentRange, max: Number(e.target.value) }
                        }));
                      }}
                      className="w-full px-3 py-2 bg-purple-900/30 rounded"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 顧客リスト */}
          <div className="bg-purple-800/20 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-900/50">
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center space-x-1"
                      >
                        <span>顧客名</span>
                        {sortConfig.key === 'name' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">ステータス</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      <button
                        onClick={() => handleSort('lastVisit')}
                        className="flex items-center space-x-1"
                      >
                        <span>最終来店</span>
                        {sortConfig.key === 'lastVisit' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      <button
                        onClick={() => handleSort('totalVisits')}
                        className="flex items-center space-x-1"
                      >
                        <span>来店回数</span>
                        {sortConfig.key === 'totalVisits' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      <button
                        onClick={() => handleSort('totalSpent')}
                        className="flex items-center space-x-1"
                      >
                        <span>累計売上</span>
                        {sortConfig.key === 'totalSpent' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">お気に入り</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">次回予約</th>
                    <th className="px-6 py-3 text-right text-sm font-medium">アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-700/30">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-purple-700/20 cursor-pointer transition-colors"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-purple-300">{customer.email}</div>
                          <div className="text-sm text-purple-300">{customer.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(customer.status)}`}>
                          {customer.status === 'vip' ? 'VIP' : customer.status === 'active' ? 'アクティブ' : '非アクティブ'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{customer.lastVisit}</td>
                      <td className="px-6 py-4">{customer.totalVisits}回</td>
                      <td className="px-6 py-4">¥{customer.totalSpent.toLocaleString()}</td>
                      <td className="px-6 py-4">{customer.favoriteService}</td>
                      <td className="px-6 py-4">{customer.nextAppointment || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCustomer(customer);
                          }}
                          className="text-purple-300 hover:text-purple-100"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomer(customer);
                          }}
                          className="text-purple-300 hover:text-red-400"
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
    </div>
  );
} 