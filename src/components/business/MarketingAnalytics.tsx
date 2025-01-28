import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
  Activity,
  DollarSign,
  UserPlus,
  Home,
  ChevronLeft,
  BarChart2,
  PieChart
} from 'lucide-react';

interface AnalyticsData {
  totalCustomers: number;
  newCustomers: number;
  customerGrowth: number;
  averageSessionValue: number;
  repeatRate: number;
  topServices: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  customerDemographics: Array<{
    age: string;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    customers: number;
    revenue: number;
  }>;
}

// モックデータ
const mockAnalyticsData: AnalyticsData = {
  totalCustomers: 1250,
  newCustomers: 85,
  customerGrowth: 12.5,
  averageSessionValue: 8500,
  repeatRate: 65,
  topServices: [
    { name: "タロット占い", count: 450, revenue: 3825000 },
    { name: "四柱推命", count: 320, revenue: 2880000 },
    { name: "九星気学", count: 280, revenue: 2380000 },
    { name: "手相占い", count: 200, revenue: 1600000 }
  ],
  customerDemographics: [
    { age: "20代以下", percentage: 15 },
    { age: "30代", percentage: 35 },
    { age: "40代", percentage: 30 },
    { age: "50代以上", percentage: 20 }
  ],
  monthlyTrends: [
    { month: "1月", customers: 980, revenue: 8330000 },
    { month: "2月", customers: 1050, revenue: 8925000 },
    { month: "3月", customers: 1150, revenue: 9775000 },
    { month: "4月", customers: 1250, revenue: 10625000 }
  ]
};

export default function MarketingAnalytics() {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 実際のAPIコールをシミュレート
    const fetchData = async () => {
      try {
        // TODO: 実際のAPIエンドポイントに置き換える
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockAnalyticsData);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-200"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

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
        <h1 className="text-3xl font-bold text-center mb-12">マーケティング分析</h1>

        {/* 主要指標 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-purple-800/20 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-300" />
              <div className="flex items-center text-green-400">
                <ArrowUp size={16} />
                <span className="ml-1">{data.customerGrowth}%</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-purple-200">総顧客数</h3>
            <p className="text-2xl font-bold text-purple-100">{data.totalCustomers.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-purple-800/20 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <UserPlus className="w-8 h-8 text-purple-300" />
              <div className="flex items-center text-green-400">
                <span className="ml-1">今月</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-purple-200">新規顧客数</h3>
            <p className="text-2xl font-bold text-purple-100">{data.newCustomers.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-purple-800/20 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-purple-300" />
            </div>
            <h3 className="text-lg font-medium text-purple-200">平均セッション単価</h3>
            <p className="text-2xl font-bold text-purple-100">¥{data.averageSessionValue.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-purple-800/20 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-purple-300" />
            </div>
            <h3 className="text-lg font-medium text-purple-200">リピート率</h3>
            <p className="text-2xl font-bold text-purple-100">{data.repeatRate}%</p>
          </motion.div>
        </div>

        {/* サービス分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-purple-800/20 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-purple-200">人気サービス分析</h3>
              <BarChart2 className="w-6 h-6 text-purple-300" />
            </div>
            <div className="space-y-4">
              {data.topServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-purple-200">{service.name}</p>
                    <div className="w-full bg-purple-900/50 rounded-full h-2 mt-1">
                      <div
                        className="bg-purple-400 rounded-full h-2"
                        style={{
                          width: `${(service.count / data.topServices[0].count) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-purple-200">{service.count}件</p>
                    <p className="text-sm text-purple-300">¥{service.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 顧客年齢層分析 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-purple-800/20 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-purple-200">顧客年齢層分析</h3>
              <PieChart className="w-6 h-6 text-purple-300" />
            </div>
            <div className="space-y-4">
              {data.customerDemographics.map((demographic) => (
                <div key={demographic.age} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-purple-200">{demographic.age}</p>
                    <div className="w-full bg-purple-900/50 rounded-full h-2 mt-1">
                      <div
                        className="bg-purple-400 rounded-full h-2"
                        style={{ width: `${demographic.percentage}%` }}
                      />
                    </div>
                  </div>
                  <p className="ml-4 text-purple-200">{demographic.percentage}%</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 月次トレンド */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-purple-800/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-purple-200">月次トレンド</h3>
            <TrendingUp className="w-6 h-6 text-purple-300" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="pb-3 text-purple-200">月</th>
                  <th className="pb-3 text-purple-200">顧客数</th>
                  <th className="pb-3 text-purple-200">売上</th>
                  <th className="pb-3 text-purple-200">前月比</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyTrends.map((trend, index) => {
                  const prevMonth = index > 0 ? data.monthlyTrends[index - 1].revenue : trend.revenue;
                  const growth = ((trend.revenue - prevMonth) / prevMonth) * 100;
                  
                  return (
                    <tr key={trend.month} className="border-b border-purple-700/30">
                      <td className="py-3 text-purple-200">{trend.month}</td>
                      <td className="py-3 text-purple-200">{trend.customers.toLocaleString()}</td>
                      <td className="py-3 text-purple-200">¥{trend.revenue.toLocaleString()}</td>
                      <td className="py-3">
                        <div className={`flex items-center ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {growth >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                          <span className="ml-1">{Math.abs(growth).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 