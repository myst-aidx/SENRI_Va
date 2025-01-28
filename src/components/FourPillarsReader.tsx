import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, History } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { generateAIInterpretation } from '../utils/fourPillarsAI';
import FortuneChat from './FortuneChat';

// 十干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
// 十二支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
// 五行
const FIVE_ELEMENTS = ['木', '火', '土', '金', '水'] as const;
// 十二運
const TWELVE_STAGES = ['長生', '沐浴', '冠帶', '臨官', '帝旺', '衰', '病', '死', '墓', '絕', '胎', '養'] as const;

interface FourPillars {
  year: {
    stem: typeof HEAVENLY_STEMS[number];
    branch: typeof EARTHLY_BRANCHES[number];
  };
  month: {
    stem: typeof HEAVENLY_STEMS[number];
    branch: typeof EARTHLY_BRANCHES[number];
  };
  day: {
    stem: typeof HEAVENLY_STEMS[number];
    branch: typeof EARTHLY_BRANCHES[number];
  };
  hour: {
    stem: typeof HEAVENLY_STEMS[number];
    branch: typeof EARTHLY_BRANCHES[number];
  };
}

interface Reading {
  fourPillars: FourPillars;
  mainElement: typeof FIVE_ELEMENTS[number];
  lifeStage: typeof TWELVE_STAGES[number];
  interpretation: string;
}

// 時刻を時と分に分割する型
interface Time {
  hour: number;
  minute: number;
}

// 時刻文字列をTime型に変換
const parseTime = (timeStr: string): Time => {
  const [hour, minute] = timeStr.split(':').map(Number);
  return { hour, minute };
};

// 四柱推命の計算ロジック
const calculateFourPillars = (birthDate: Date, time: Time): FourPillars => {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  // 時刻を小数点に変換（例: 13:30 → 13.5）
  const hourDecimal = time.hour + time.minute / 60;

  // 年柱の計算
  const yearStemIndex = (year - 4) % 10;
  const yearBranchIndex = (year - 4) % 12;

  // 月柱の計算（簡略化）
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  const monthBranchIndex = (month + 2) % 12;

  // 日柱の計算（簡略化）
  const dayStemIndex = (year * 5 + Math.floor(year / 4) + day - 7) % 10;
  const dayBranchIndex = (day * 12) % 12;

  // 時柱の計算（小数点を考慮）
  const hourStemIndex = (dayStemIndex * 2 + Math.floor(hourDecimal / 2)) % 10;
  const hourBranchIndex = Math.floor(hourDecimal / 2) % 12;

  return {
    year: {
      stem: HEAVENLY_STEMS[yearStemIndex],
      branch: EARTHLY_BRANCHES[yearBranchIndex],
    },
    month: {
      stem: HEAVENLY_STEMS[monthStemIndex],
      branch: EARTHLY_BRANCHES[monthBranchIndex],
    },
    day: {
      stem: HEAVENLY_STEMS[dayStemIndex],
      branch: EARTHLY_BRANCHES[dayBranchIndex],
    },
    hour: {
      stem: HEAVENLY_STEMS[hourStemIndex],
      branch: EARTHLY_BRANCHES[hourBranchIndex],
    },
  };
};

// 五行の相性を判定
const getMainElement = (fourPillars: FourPillars): typeof FIVE_ELEMENTS[number] => {
  const stemIndex = HEAVENLY_STEMS.indexOf(fourPillars.day.stem);
  return FIVE_ELEMENTS[Math.floor(stemIndex / 2)];
};

// 運勢の段階を判定
const getLifeStage = (fourPillars: FourPillars): typeof TWELVE_STAGES[number] => {
  const randomIndex = Math.floor(Math.random() * TWELVE_STAGES.length);
  return TWELVE_STAGES[randomIndex];
};

// 時刻オプションを生成（5分単位）
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeStr);
    }
  }
  return options;
};

export default function FourPillarsReader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');
  const [reading, setReading] = useState<Reading | null>(null);
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
      return;
    }

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      setError('正しい時刻を入力してください');
      return;
    }

    try {
      const date = new Date(year, month - 1, day, hour, minute);
      const time = parseTime(`${hour}:${minute}`);

      const fourPillars = calculateFourPillars(date, time);
      const mainElement = getMainElement(fourPillars);
      const lifeStage = getLifeStage(fourPillars);

      // AI解釈を生成
      const aiInterpretation = await generateAIInterpretation({
        ...fourPillars,
        mainElement,
        lifeStage,
      });

      setReading({
        fourPillars,
        mainElement,
        lifeStage,
        interpretation: aiInterpretation,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, [birthYear, birthMonth, birthDay, birthHour, birthMinute]);

  const timeOptions = generateTimeOptions();

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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 text-center flex-grow">四柱推命</h1>
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
            <LoadingSpinner message="四柱推命で運命を読み解いています..." />
          )}

          {reading && !isLoading && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">四柱</h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <h3 className="font-medium mb-2">年柱</h3>
                    <p className="text-2xl">{reading.fourPillars.year.stem}{reading.fourPillars.year.branch}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">月柱</h3>
                    <p className="text-2xl">{reading.fourPillars.month.stem}{reading.fourPillars.month.branch}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">日柱</h3>
                    <p className="text-2xl">{reading.fourPillars.day.stem}{reading.fourPillars.day.branch}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">時柱</h3>
                    <p className="text-2xl">{reading.fourPillars.hour.stem}{reading.fourPillars.hour.branch}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <h3 className="font-medium mb-2">主たる五行</h3>
                    <p className="text-2xl">{reading.mainElement}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium mb-2">現在の運勢段階</h3>
                    <p className="text-2xl">{reading.lifeStage}</p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">AI占い師による詳細な解釈</h2>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-purple-100">{reading.interpretation}</pre>
                </div>

                <div className="mt-8">
                  <FortuneChat
                    fortuneType="fourpillars"
                    context={{
                      type: "fourpillars",
                      reading: reading.interpretation,
                      additionalInfo: {
                        fourPillars: reading.fourPillars,
                        mainElement: reading.mainElement,
                        lifeStage: reading.lifeStage
                      }
                    }}
                    initialMessage="四柱推命の結果について、気になることを質問してください。"
                    initialSuggestions={[
                      { text: "五行の相性について詳しく教えて", label: "五行" },
                      { text: "今年の運勢はどうですか？", label: "運勢" },
                      { text: "相性の良い職業は？", label: "職業" },
                      { text: "恋愛運について教えて", label: "恋愛" },
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