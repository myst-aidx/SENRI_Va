import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Home,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  BarChart2,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  Clock,
  Star,
  Wallet,
  CreditCard,
  Target,
  X
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Chart.jsの設定
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 売上予測データ
interface SalesForecast {
  period: string;
  predictedRevenue: number;
  predictedOrders: number;
  confidence: number;
  factors: {
    factor: string;
    impact: number;
  }[];
}

// 売上目標データ
interface SalesTarget {
  period: string;
  target: number;
  current: number;
  progress: number;
  status: 'ahead' | 'on_track' | 'behind';
}

// 顧客セグメントデータ
interface CustomerSegment {
  segment: string;
  revenue: number;
  customers: number;
  averageOrderValue: number;
  retentionRate: number;
  growth: number;
}

// 売上データの型定義
interface SalesData {
  id: string;
  date: string;
  service: string;
  amount: number;
  paymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'electronic_payment';
  customerId: string;
  customerName: string;
  category: string;
  isOnline: boolean;
  duration: number;
  status: 'completed' | 'cancelled' | 'refunded';
}

// 売上分析の型定義
interface SalesAnalyticsData {
  totalRevenue: number;
  comparisonPeriod: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  averageOrderValue: number;
  totalOrders: number;
  revenueByService: Record<string, number>;
  revenueByCategory: Record<string, number>;
  monthlyRevenue: {
    month: string;
    revenue: number;
    orders: number;
  }[];
  customerRetention: {
    newCustomers: number;
    returningCustomers: number;
    retentionRate: number;
  };
  paymentMethods: Record<string, number>;
  topServices: {
    service: string;
    revenue: number;
    orders: number;
  }[];
  onlineVsOffline: {
    online: number;
    offline: number;
  };
  hourlyRevenue: Record<string, number>;
  cancellationRate: number;
}

// モックデータの拡張
const mockForecast: SalesForecast[] = [
  {
    period: '2024-03',
    predictedRevenue: 520000,
    predictedOrders: 52,
    confidence: 85,
    factors: [
      { factor: '季節性', impact: 15 },
      { factor: 'マーケティングキャンペーン', impact: 25 },
      { factor: '市場トレンド', impact: 10 }
    ]
  }
];

const mockTargets: SalesTarget[] = [
  {
    period: '2024-Q1',
    target: 1500000,
    current: 1250000,
    progress: 83.3,
    status: 'on_track'
  }
];

const mockSegments: CustomerSegment[] = [
  {
    segment: 'プレミアム会員',
    revenue: 580000,
    customers: 45,
    averageOrderValue: 12889,
    retentionRate: 85,
    growth: 12.5
  },
  {
    segment: '一般会員',
    revenue: 450000,
    customers: 65,
    averageOrderValue: 6923,
    retentionRate: 60,
    growth: 8.3
  },
  {
    segment: '新規顧客',
    revenue: 220000,
    customers: 22,
    averageOrderValue: 10000,
    retentionRate: 0,
    growth: 0
  }
];

// 型定義
interface DateRange {
  start: string;
  end: string;
}

// デモデータ
const demoAnalytics: SalesAnalyticsData = {
  totalRevenue: 2500000,
  comparisonPeriod: {
    current: 850000,
    previous: 750000,
    percentageChange: 13.3
  },
  averageOrderValue: 9800,
  totalOrders: 255,
  revenueByService: {
    'タロット占い': 850000,
    '四柱推命': 650000,
    '手相占い': 450000,
    '占星術': 350000,
    '夢占い': 200000
  },
  revenueByCategory: {
    '対面鑑定': 1500000,
    'オンライン鑑定': 1000000
  },
  monthlyRevenue: [
    { month: '2024-01', revenue: 750000, orders: 78 },
    { month: '2024-02', revenue: 850000, orders: 89 },
    { month: '2024-03', revenue: 900000, orders: 88 },
  ],
  customerRetention: {
    newCustomers: 85,
    returningCustomers: 170,
    retentionRate: 66.7
  },
  paymentMethods: {
    credit_card: 45,
    electronic_payment: 30,
    bank_transfer: 15,
    cash: 10
  },
  topServices: [
    { service: 'タロット占い', revenue: 850000, orders: 89 },
    { service: '四柱推命', revenue: 650000, orders: 67 },
    { service: '手相占い', revenue: 450000, orders: 48 }
  ],
  onlineVsOffline: {
    online: 40,
    offline: 60
  },
  hourlyRevenue: {
    '10:00': 180000,
    '11:00': 220000,
    '12:00': 150000,
    '13:00': 120000,
    '14:00': 280000,
    '15:00': 320000,
    '16:00': 250000,
    '17:00': 200000,
    '18:00': 350000,
    '19:00': 280000,
    '20:00': 150000
  },
  cancellationRate: 3.2
};

// コンポーネントの拡張
export default function SalesAnalytics() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [analytics, setAnalytics] = useState<SalesAnalyticsData | null>(null);
  const [forecast, setForecast] = useState<SalesForecast[]>(mockForecast);
  const [targets, setTargets] = useState<SalesTarget[]>(mockTargets);
  const [segments, setSegments] = useState<CustomerSegment[]>(mockSegments);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [showDemo, setShowDemo] = useState(false);

  // CSVエクスポート機能
  const exportToCSV = () => {
    const headers = [
      '日付',
      'サービス',
      '金額',
      '支払方法',
      '顧客名',
      'カテゴリー',
      'オンライン/オフライン',
      'ステータス'
    ];

    const rows = salesData.map(sale => [
      sale.date,
      sale.service,
      sale.amount,
      sale.paymentMethod === 'credit_card' ? 'クレジットカード' :
      sale.paymentMethod === 'electronic_payment' ? '電子決済' :
      sale.paymentMethod === 'bank_transfer' ? '銀行振込' : '現金',
      sale.customerName,
      sale.category,
      sale.isOnline ? 'オンライン' : 'オフライン',
      sale.status === 'completed' ? '完了' :
      sale.status === 'cancelled' ? 'キャンセル' : '返金'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${dateRange.start}_${dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 予測分析の取得
  useEffect(() => {
    const fetchForecast = async () => {
      try {
        // TODO: API連携
        await new Promise(resolve => setTimeout(resolve, 1000));
        setForecast(mockForecast);
      } catch (error) {
        console.error('Failed to fetch forecast:', error);
      }
    };

    fetchForecast();
  }, [dateRange]);

  // 目標の進捗状況の取得
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        // TODO: API連携
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTargets(mockTargets);
      } catch (error) {
        console.error('Failed to fetch targets:', error);
      }
    };

    fetchTargets();
  }, [dateRange]);

  // 顧客セグメント分析の取得
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        // TODO: API連携
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSegments(mockSegments);
      } catch (error) {
        console.error('Failed to fetch segments:', error);
      }
    };

    fetchSegments();
  }, [dateRange]);

  // 予測分析モーダル
  const renderForecastModal = () => {
    if (!showForecastModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-900 rounded-lg shadow-xl max-w-4xl w-full"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">売上予測分析</h2>
              <button
                onClick={() => setShowForecastModal(false)}
                className="text-purple-300 hover:text-purple-100"
              >
                <X size={24} />
              </button>
            </div>

            {forecast.map(f => (
              <div key={f.period} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h3 className="text-sm text-purple-300 mb-1">予測売上</h3>
                    <p className="text-2xl font-bold">¥{f.predictedRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h3 className="text-sm text-purple-300 mb-1">予測注文数</h3>
                    <p className="text-2xl font-bold">{f.predictedOrders}件</p>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h3 className="text-sm text-purple-300 mb-1">予測信頼度</h3>
                    <p className="text-2xl font-bold">{f.confidence}%</p>
                  </div>
                </div>

                <div className="bg-purple-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">影響要因分析</h3>
                  <div className="space-y-4">
                    {f.factors.map(factor => (
                      <div key={factor.factor}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{factor.factor}</span>
                          <span>{factor.impact}%</span>
                        </div>
                        <div className="w-full bg-purple-900/50 rounded-full h-2">
                          <div
                            className="bg-purple-500 rounded-full h-2"
                            style={{ width: `${factor.impact}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  // 目標管理モーダル
  const renderTargetModal = () => {
    if (!showTargetModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-900 rounded-lg shadow-xl max-w-4xl w-full"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">売上目標管理</h2>
              <button
                onClick={() => setShowTargetModal(false)}
                className="text-purple-300 hover:text-purple-100"
              >
                <X size={24} />
              </button>
            </div>

            {targets.map(target => (
              <div key={target.period} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h3 className="text-sm text-purple-300 mb-1">目標金額</h3>
                    <p className="text-2xl font-bold">¥{target.target.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h3 className="text-sm text-purple-300 mb-1">現在の売上</h3>
                    <p className="text-2xl font-bold">¥{target.current.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4">
                    <h3 className="text-sm text-purple-300 mb-1">進捗状況</h3>
                    <p className={`text-2xl font-bold ${
                      target.status === 'ahead' ? 'text-green-400' :
                      target.status === 'behind' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {target.progress}%
                    </p>
                  </div>
                </div>

                <div className="bg-purple-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">目標達成予測</h3>
                  <div className="w-full bg-purple-900/50 rounded-full h-4">
                    <div
                      className={`rounded-full h-4 transition-all duration-500 ${
                        target.status === 'ahead' ? 'bg-green-500' :
                        target.status === 'behind' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${target.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  // 顧客セグメント分析モーダル
  const renderSegmentModal = () => {
    if (!showSegmentModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-900 rounded-lg shadow-xl max-w-4xl w-full"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">顧客セグメント分析</h2>
              <button
                onClick={() => setShowSegmentModal(false)}
                className="text-purple-300 hover:text-purple-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {segments.map(segment => (
                <div key={segment.segment} className="bg-purple-800/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{segment.segment}</h3>
                      <p className="text-sm text-purple-300">
                        顧客数: {segment.customers}人
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ¥{segment.revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-purple-300">
                        平均単価: ¥{segment.averageOrderValue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-purple-300 mb-1">継続率</p>
                      <div className="w-full bg-purple-900/50 rounded-full h-2">
                        <div
                          className="bg-purple-500 rounded-full h-2"
                          style={{ width: `${segment.retentionRate}%` }}
                        />
                      </div>
                      <p className="text-right text-sm mt-1">{segment.retentionRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300 mb-1">成長率</p>
                      <div className="w-full bg-purple-900/50 rounded-full h-2">
                        <div
                          className="bg-green-500 rounded-full h-2"
                          style={{ width: `${segment.growth}%` }}
                        />
                      </div>
                      <p className="text-right text-sm mt-1">{segment.growth}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // グラフ用のデータ生成関数
  const generateChartData = (analytics: SalesAnalyticsData | null) => {
    if (!analytics) return null;

    const monthlyRevenueData = {
      labels: analytics.monthlyRevenue.map(m => m.month),
      datasets: [
        {
          label: '売上',
          data: analytics.monthlyRevenue.map(m => m.revenue),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: '注文数',
          data: analytics.monthlyRevenue.map(m => m.orders),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'orders'
        }
      ]
    };

    const serviceRevenueData = {
      labels: Object.keys(analytics.revenueByService),
      datasets: [
        {
          data: Object.values(analytics.revenueByService),
          backgroundColor: [
            'rgba(147, 51, 234, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(34, 197, 94, 0.8)'
          ]
        }
      ]
    };

    const hourlyRevenueData = {
      labels: Object.keys(analytics.hourlyRevenue),
      datasets: [
        {
          label: '時間帯別売上',
          data: Object.values(analytics.hourlyRevenue),
          backgroundColor: 'rgba(147, 51, 234, 0.8)'
        }
      ]
    };

    const paymentMethodData = {
      labels: Object.keys(analytics.paymentMethods).map(method => 
        method === 'credit_card' ? 'クレジットカード' :
        method === 'electronic_payment' ? '電子決済' :
        method === 'bank_transfer' ? '銀行振込' : '現金'
      ),
      datasets: [
        {
          data: Object.values(analytics.paymentMethods),
          backgroundColor: [
            'rgba(147, 51, 234, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(34, 197, 94, 0.8)'
          ]
        }
      ]
    };

    return {
      monthlyRevenueData,
      serviceRevenueData,
      hourlyRevenueData,
      paymentMethodData
    };
  };

  // グラフのオプション設定
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(226, 232, 240)'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(226, 232, 240, 0.1)'
        },
        ticks: {
          color: 'rgb(226, 232, 240)'
        }
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.1)'
        },
        ticks: {
          color: 'rgb(226, 232, 240)'
        }
      }
    }
  };

  // グラフデータの生成
  const chartData = generateChartData(analytics);

  // デモデータを表示
  const handleShowDemo = () => {
    setShowDemo(true);
    setAnalytics(demoAnalytics);
  };

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
            <h1 className="text-3xl font-bold">売上分析</h1>
            <div className="flex space-x-4">
              <button
                onClick={handleShowDemo}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-800/30 rounded-lg hover:bg-purple-700/30"
              >
                <BarChart2 size={20} />
                <span>デモデータを表示</span>
              </button>
              <button
                onClick={() => setShowForecastModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-800/30 rounded-lg hover:bg-purple-700/30"
              >
                <TrendingUp size={20} />
                <span>予測分析</span>
              </button>
              <button
                onClick={() => setShowTargetModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-800/30 rounded-lg hover:bg-purple-700/30"
              >
                <Target size={20} />
                <span>目標管理</span>
              </button>
              <button
                onClick={() => setShowSegmentModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-800/30 rounded-lg hover:bg-purple-700/30"
              >
                <Users size={20} />
                <span>セグメント分析</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-800/30 rounded-lg hover:bg-purple-700/30"
              >
                <Filter size={20} />
                <span>フィルター</span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Download size={20} />
                <span>エクスポート</span>
              </button>
            </div>
          </div>

          {/* 主要指標 */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-purple-800/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-purple-300">総売上</h3>
                  <DollarSign className="text-purple-400" size={20} />
                </div>
                <p className="text-2xl font-bold">¥{analytics.totalRevenue.toLocaleString()}</p>
                <div className={`flex items-center mt-2 ${
                  analytics.comparisonPeriod.percentageChange >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {analytics.comparisonPeriod.percentageChange >= 0
                    ? <ArrowUp size={16} />
                    : <ArrowDown size={16} />}
                  <span className="ml-1">{Math.abs(analytics.comparisonPeriod.percentageChange)}%</span>
                  <span className="text-sm text-purple-300 ml-2">前月比</span>
                </div>
              </div>

              <div className="bg-purple-800/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-purple-300">平均単価</h3>
                  <Wallet className="text-purple-400" size={20} />
                </div>
                <p className="text-2xl font-bold">¥{analytics.averageOrderValue.toLocaleString()}</p>
                <p className="text-sm text-purple-300 mt-2">
                  総注文数: {analytics.totalOrders}件
                </p>
              </div>

              <div className="bg-purple-800/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-purple-300">顧客維持率</h3>
                  <Users className="text-purple-400" size={20} />
                </div>
                <p className="text-2xl font-bold">{analytics.customerRetention.retentionRate}%</p>
                <div className="flex justify-between text-sm text-purple-300 mt-2">
                  <span>新規: {analytics.customerRetention.newCustomers}</span>
                  <span>リピーター: {analytics.customerRetention.returningCustomers}</span>
                </div>
              </div>

              <div className="bg-purple-800/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-purple-300">キャンセル率</h3>
                  <Target className="text-purple-400" size={20} />
                </div>
                <p className="text-2xl font-bold">{analytics.cancellationRate}%</p>
                <p className="text-sm text-purple-300 mt-2">
                  目標: 5%以下
                </p>
              </div>
            </div>
          )}

          {/* グラフセクション */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-purple-800/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">月間売上推移</h3>
              <div className="h-80">
                {chartData && (
                  <Line
                    data={chartData.monthlyRevenueData}
                    options={{
                      ...chartOptions,
                      scales: {
                        ...chartOptions.scales,
                        orders: {
                          position: 'right',
                          grid: {
                            color: 'rgba(226, 232, 240, 0.1)'
                          },
                          ticks: {
                            color: 'rgb(226, 232, 240)'
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">サービス別売上</h3>
              <div className="h-80">
                {chartData && (
                  <Doughnut
                    data={chartData.serviceRevenueData}
                    options={chartOptions}
                  />
                )}
              </div>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">時間帯別売上</h3>
              <div className="h-80">
                {chartData && (
                  <Bar
                    data={chartData.hourlyRevenueData}
                    options={chartOptions}
                  />
                )}
              </div>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">決済方法の分布</h3>
              <div className="h-80">
                {chartData && (
                  <Pie
                    data={chartData.paymentMethodData}
                    options={chartOptions}
                  />
                )}
              </div>
            </div>
          </div>

          {renderForecastModal()}
          {renderTargetModal()}
          {renderSegmentModal()}
        </div>
      </main>
    </div>
  );
} 
