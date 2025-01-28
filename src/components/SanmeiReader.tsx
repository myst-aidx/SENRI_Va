import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, History } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import LoadingSpinner from './LoadingSpinner';
import FortuneChat from './FortuneChat';
import { generateSanmeiReading } from '../utils/sanmei';

// 十干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
// 十二支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
// 五行
const FIVE_ELEMENTS = ['木', '火', '土', '金', '水'] as const;
// 十二運
const TWELVE_STAGES = ['長生', '沐浴', '冠帶', '臨官', '帝旺', '衰', '病', '死', '墓', '絕', '胎', '養'] as const;

interface SanmeiResult {
  dayMaster: typeof HEAVENLY_STEMS[number];
  yearPillar: {
    stem: typeof HEAVENLY_STEMS[number];
    branch: typeof EARTHLY_BRANCHES[number];
  };
  monthPillar: {
    stem: typeof HEAVENLY_STEMS[number];
    branch: typeof EARTHLY_BRANCHES[number];
  };
  dayPillar: {
    stem: typeof HEAVENLY_STEMS[number];
    branch: typeof EARTHLY_BRANCHES[number];
  };
  hourPillar: {
    stem: typeof HEAVENLY_STEMS[number];
    branch: typeof EARTHLY_BRANCHES[number];
  };
  mainElement: typeof FIVE_ELEMENTS[number];
  elementBalance: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  interpretation: string;
}

export default function SanmeiReader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');
  const [reading, setReading] = useState<SanmeiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 年の選択肢を生成（1900年から現在まで）
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  }, []);

  // 月の選択肢を生成
  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, []);

  // 日の選択肢を生成
  const dayOptions = useMemo(() => {
    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    if (isNaN(year) || isNaN(month)) return Array.from({ length: 31 }, (_, i) => i + 1);

    const lastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  }, [birthYear, birthMonth]);

  // 時の選択肢を生成
  const hourOptions = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i);
  }, []);

  // 分の選択肢を生成
  const minuteOptions = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => i);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    const day = parseInt(birthDay);
    const hour = parseInt(birthHour);
    const minute = parseInt(birthMinute);

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
      setError('正しい生年月日時を入力してください');
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateSanmeiReading({
        year,
        month,
        day,
        hour,
        minute
      });
      setReading(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, [birthYear, birthMonth, birthDay, birthHour, birthMinute]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-purple-100">
      <nav className="p-4 bg-purple-900/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/fortune')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <Home size={24} />
            <span>ホーム</span>
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <History size={24} />
            <span>履歴</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 text-center flex-grow">算命学</h1>
            <button
              onClick={() => navigate('/fortune')}
              className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              占い選択に戻る
            </button>
          </div>

          {!reading && (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-purple-200 mb-2">年</label>
                      <select
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        className="w-full px-4 py-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100"
                        required
                        disabled={isLoading}
                      >
                        <option value="">選択</option>
                        {yearOptions.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-purple-200 mb-2">月</label>
                      <select
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                        className="w-full px-4 py-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100"
                        required
                        disabled={isLoading}
                      >
                        <option value="">選択</option>
                        {monthOptions.map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-purple-200 mb-2">日</label>
                      <select
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        className="w-full px-4 py-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100"
                        required
                        disabled={isLoading}
                      >
                        <option value="">選択</option>
                        {dayOptions.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-purple-200 mb-2">時</label>
                      <select
                        value={birthHour}
                        onChange={(e) => setBirthHour(e.target.value)}
                        className="w-full px-4 py-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100"
                        required
                        disabled={isLoading}
                      >
                        <option value="">選択</option>
                        {hourOptions.map(hour => (
                          <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-purple-200 mb-2">分</label>
                      <select
                        value={birthMinute}
                        onChange={(e) => setBirthMinute(e.target.value)}
                        className="w-full px-4 py-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100"
                        required
                        disabled={isLoading}
                      >
                        <option value="">選択</option>
                        {minuteOptions.map(minute => (
                          <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-purple-300 mb-4">
                  <p>※時刻が不明な場合は、正午（12時00分）を選択してください。</p>
                  <p>※より正確な鑑定のために、できるだけ正確な時刻を入力してください。</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  鑑定する
                </button>
              </div>
            </motion.form>
          )}

          {isLoading && (
            <LoadingSpinner message="算命学で運命を読み解いています..." />
          )}

          {reading && !isLoading && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">命式</h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <h3 className="font-medium mb-2">年柱</h3>
                    <p className="text-2xl">{reading.yearPillar.stem}{reading.yearPillar.branch}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">月柱</h3>
                    <p className="text-2xl">{reading.monthPillar.stem}{reading.monthPillar.branch}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">日柱</h3>
                    <p className="text-2xl">{reading.dayPillar.stem}{reading.dayPillar.branch}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">時柱</h3>
                    <p className="text-2xl">{reading.hourPillar.stem}{reading.hourPillar.branch}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">日主（あなたの本質）</h3>
                  <p className="text-2xl text-center">{reading.dayMaster}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">五行バランス</h3>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="text-center">
                      <p className="font-medium">木</p>
                      <p className="text-xl">{reading.elementBalance.wood}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">火</p>
                      <p className="text-xl">{reading.elementBalance.fire}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">土</p>
                      <p className="text-xl">{reading.elementBalance.earth}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">金</p>
                      <p className="text-xl">{reading.elementBalance.metal}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">水</p>
                      <p className="text-xl">{reading.elementBalance.water}</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">AI占い師による詳細な解釈</h2>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-purple-100">{reading.interpretation}</pre>
                </div>

                <div className="mt-8">
                  <FortuneChat
                    fortuneType="sanmei"
                    context={{
                      type: "sanmei",
                      reading: reading.interpretation,
                      additionalInfo: {
                        dayMaster: reading.dayMaster,
                        elementBalance: reading.elementBalance,
                        yearPillar: reading.yearPillar,
                        monthPillar: reading.monthPillar,
                        dayPillar: reading.dayPillar,
                        hourPillar: reading.hourPillar
                      }
                    }}
                    initialMessage="算命学の結果について、気になることを質問してください。"
                    initialSuggestions={[
                      { text: "日主の性格について詳しく教えて", label: "性格" },
                      { text: "今年の運勢はどうですか？", label: "運勢" },
                      { text: "相性の良い職業は？", label: "職業" },
                      { text: "五行バランスの意味を教えて", label: "五行" },
                      { text: "金運を上げるにはどうしたら良い？", label: "金運" }
                    ]}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
} 