import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, Calendar, Clock, Compass } from 'lucide-react';
import { calculateKyuseiStar, calculateMonthlyFortune, calculateDailyFortune } from '../utils/kyusei';
import LoadingSpinner from './LoadingSpinner';

export default function KyuseiReader() {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // 生年月日から九星を計算
      const result = await calculateKyuseiStar(birthDate);
      
      // 月運と日運も計算
      const monthlyFortune = calculateMonthlyFortune(birthDate);
      const dailyFortune = calculateDailyFortune(birthDate);
      
      // 結果を文字列化してからナビゲート
      const state = {
        birthDate,
        birthTime,
        result: JSON.parse(JSON.stringify(result)),
        monthlyFortune,
        dailyFortune
      };
      
      // 結果ページに遷移
      navigate('/fortune/kyusei/result', { state });
    } catch (err) {
      setError('鑑定中にエラーが発生しました。もう一度お試しください。');
      console.error('Error in kyusei calculation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
      <nav className="p-4 bg-purple-900/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/fortune')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <ChevronLeft size={24} />
            <span>戻る</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Star className="w-12 h-12 text-purple-300" />
              <h1 className="text-3xl font-bold">九星気学</h1>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6 mb-8">
              <p className="text-center text-lg mb-4">
                生年月日と生まれた時間を入力して、あなたの九星と運勢を占います。
              </p>
              <p className="text-center text-purple-300 mb-8">
                九星気学は、生年月日から導き出される九つの星の気を読み解き、
                その人の本質や運命の流れを占う東洋占術です。
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Calendar className="inline-block w-4 h-4 mr-2" />
                      生年月日
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Clock className="inline-block w-4 h-4 mr-2" />
                      生まれた時間（任意）
                    </label>
                    <input
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <LoadingSpinner size={20} message="九星気学で運命を読み解いています..." />
                        <span className="ml-2">鑑定中...</span>
                      </div>
                    ) : (
                      <>
                        <Star className="w-5 h-5" />
                        <span>鑑定する</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Compass className="w-6 h-6 mr-2" />
                九星の基本
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                  <div className="font-medium mb-2">一白水星</div>
                  <div className="text-sm text-purple-300">知性と創造性</div>
                </div>
                <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                  <div className="font-medium mb-2">二黒土星</div>
                  <div className="text-sm text-purple-300">包容力と安定</div>
                </div>
                <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                  <div className="font-medium mb-2">三碧木星</div>
                  <div className="text-sm text-purple-300">成長と発展</div>
                </div>
                <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                  <div className="font-medium mb-2">四緑木星</div>
                  <div className="text-sm text-purple-300">調和と実行力</div>
                </div>
                <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                  <div className="font-medium mb-2">五黄土星</div>
                  <div className="text-sm text-purple-300">中心と統率力</div>
                </div>
                <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                  <div className="font-medium mb-2">六白金星</div>
                  <div className="text-sm text-purple-300">正義と決断力</div>
                </div>
                <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                  <div className="font-medium mb-2">七赤金星</div>
                  <div className="text-sm text-purple-300">独創性と表現力</div>
                </div>
                <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                  <div className="font-medium mb-2">八白土星</div>
                  <div className="text-sm text-purple-300">誠実と堅実さ</div>
                </div>
                <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                  <div className="font-medium mb-2">九紫火星</div>
                  <div className="text-sm text-purple-300">情熱と活動力</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 
