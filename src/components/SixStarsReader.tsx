import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FortuneChat from './FortuneChat';
import { motion } from 'framer-motion';
import OpenAI from 'openai';

const stars = [
  { 
    name: '一白水星', 
    element: '水', 
    nature: '積極性',
    description: '知性と創造性に優れ、先見の明があります。新しいことへの挑戦を好み、革新的なアイデアを生み出す力を持っています。',
    yearFortune: '新しいプロジェクトや挑戦に適した年です。特に学習や研究、新規事業の立ち上げに好影響があります。',
    monthFortune: '月ごとの変化が大きく、特に水に関連する事柄（コミュニケーション、取引、旅行）で良い結果が期待できます。',
    relationships: '二黒土星、八白土星との相性が特に良く、安定した関係を築けます。三碧木星とは刺激的な関係が期待できます。',
    career: '研究職、教育者、コンサルタント、起業家として力を発揮できます。独創的なアイデアを活かせる職場で真価を発揮します。'
  },
  { 
    name: '二黒土星', 
    element: '土', 
    nature: '受容性',
    description: '誠実で信頼性が高く、着実に物事を進める力があります。地道な努力を惜しまず、確実な成果を上げることができます。',
    yearFortune: '基礎固めと実績作りに適した年です。特に不動産や資産運用に関する判断が冴えます。',
    monthFortune: '安定した運気の流れが続き、特に土地や建物に関する事柄で良い機会に恵まれます。',
    relationships: '一白水星、五黄土星との相性が良く、互いに補完し合える関係を築けます。',
    career: '不動産業、金融関係、管理職として手腕を発揮できます。安定性を重視する職場で実力を発揮します。'
  },
  { 
    name: '三碧木星', 
    element: '木', 
    nature: '調和性',
    description: '柔軟性と適応力に優れ、周囲との調和を大切にします。芸術的センスと創造性を持ち合わせています。',
    yearFortune: '人間関係の拡大と芸術的活動に恵まれた年です。新しい出会いが人生の転機となります。',
    monthFortune: '特に春と秋に運気が上昇し、創造的な活動や人との交流が活発になります。',
    relationships: '九紫火星、一白水星との相性が良く、互いの個性を活かした関係を築けます。',
    career: 'アーティスト、デザイナー、カウンセラーとして才能を発揮できます。創造性を活かせる職場が理想的です。'
  },
  { 
    name: '四緑木星', 
    element: '木', 
    nature: '安定性',
    description: '思慮深く、計画的に物事を進める能力があります。確実性を重視し、長期的な視点で判断できます。',
    yearFortune: '長期的なプロジェクトの開始に適した年です。特に教育や自己啓発に関する活動が実を結びます。',
    monthFortune: '着実な成長が期待できる時期です。特に資格取得や学習に関する事柄で進展が見られます。',
    relationships: '八白土星、九紫火星との相性が良く、互いに高め合える関係を築けます。',
    career: '教育者、プランナー、アナリストとして能力を発揮できます。専門性を活かせる職場で活躍できます。'
  },
  { 
    name: '五黄土星', 
    element: '土', 
    nature: '中心性',
    description: 'リーダーシップと統率力に優れ、周囲から信頼される存在です。バランス感覚が優れており、公平な判断ができます。',
    yearFortune: '責任ある立場での活躍が期待できる年です。特にリーダーシップを発揮する機会が増えます。',
    monthFortune: '中心的な役割を担う機会が多く、重要な決定に関わることになります。',
    relationships: '二黒土星、八白土星との相性が特に良く、信頼関係に基づいた絆を築けます。',
    career: '経営者、管理職、プロジェクトリーダーとして力を発揮できます。組織の中核として活躍できます。'
  },
  { 
    name: '六白金星', 
    element: '金', 
    nature: '先見性',
    description: '直感力と決断力に優れ、先を見通す力があります。高い理想を持ち、それに向かって邁進する力があります。',
    yearFortune: '新たな目標設定と挑戦に適した年です。特に投資や新規事業で良い機会に恵まれます。',
    monthFortune: '金運の上昇が期待できる時期です。特に投資や資産運用に関する判断が的確になります。',
    relationships: '七赤金星、一白水星との相性が良く、互いの目標に向かって協力し合える関係を築けます。',
    career: '投資家、起業家、コンサルタントとして才能を発揮できます。先進的な分野で活躍できます。'
  }
];

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default function SixStarsReader() {
  const navigate = useNavigate();
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const calculateSixStar = (year: number, month: number, day: number) => {
    // 九星の計算（実際の計算ロジックはより複雑になります）
    const starNumber = ((year + month + day) % 6) || 6;
    return stars[starNumber - 1];
  };

  const generateSixStarsReading = async (star: any, birthData: { year: number, month: number, day: number }) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `あなたは六星占術の専門家です。東洋の陰陽五行思想に基づいて、詳細な運勢を解説してください。
以下の形式でJSONを生成してください：
{
  "description": "その人の基本的な性質と特徴の詳細な解説",
  "yearFortune": "年運の詳細な解説",
  "monthFortune": "月運の詳細な解説",
  "relationships": "相性や人間関係についての詳細なアドバイス",
  "career": "キャリアと仕事運についての具体的なアドバイス"
}`
          },
          {
            role: "user",
            content: `本命星: ${star.name}（${star.element}性、${star.nature}）
生年月日: ${birthData.year}年${birthData.month}月${birthData.day}日
この情報を元に、六星占術による詳細な運勢と性格、相性などを解説してください。`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('APIからの応答が空です');

      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('運勢の解析に失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const year = parseInt(birthYear);
      const month = parseInt(birthMonth);
      const day = parseInt(birthDay);

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        alert('正しい生年月日を入力してください');
        return;
      }

      const star = calculateSixStar(year, month, day);
      const reading = await generateSixStarsReading(star, { year, month, day });
      
      // 結果オブジェクトの作成
      const sixStarsResult = {
        star: star.name,
        element: star.element,
        nature: star.nature,
        description: reading.description,
        reading: `あなたの本命星は${star.name}です。${star.element}の性質を持ち、${star.nature}が特徴です。${reading.description}`,
        yearFortune: reading.yearFortune,
        monthFortune: reading.monthFortune,
        relationships: reading.relationships,
        career: reading.career
      };

      // 結果をローカルストレージに保存
      localStorage.setItem('sixStarsResult', JSON.stringify(sixStarsResult));
      setResult(sixStarsResult);
    } catch (error) {
      alert('鑑定中にエラーが発生しました。もう一度お試しください。');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatStart = () => {
    setShowChat(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!result ? (
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <h1 className="text-3xl font-bold text-purple-300 text-center">
            六星占術
          </h1>
          
          <div className="text-gray-200 text-center">
            <p>生年月日から、あなたの本命星を鑑定します。</p>
            <p>六星占術は、東洋の陰陽五行思想に基づく精密な占術です。</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">生まれた年</label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="1990"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">月</label>
                <input
                  type="number"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  placeholder="1-12"
                  min="1"
                  max="12"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">日</label>
                <input
                  type="number"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  placeholder="1-31"
                  min="1"
                  max="31"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? '鑑定中...' : '鑑定する'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/fortune')}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition-colors"
                disabled={isLoading}
              >
                戻る
              </button>
            </div>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-purple-200 mb-4">六星占術について</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stars.map((star) => (
                <motion.div
                  key={star.name}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-700 p-4 rounded-lg text-center"
                >
                  <h3 className="text-lg font-semibold text-purple-300">{star.name}</h3>
                  <p className="text-gray-300">元素: {star.element}</p>
                  <p className="text-gray-300">性質: {star.nature}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : !showChat ? (
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <h1 className="text-3xl font-bold text-purple-300 text-center">
            六星占術の結果
          </h1>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-purple-200 mb-2">本命星</h2>
              <p className="text-xl text-white">{result.star}</p>
              <div className="mt-2 flex justify-center space-x-4">
                <span className="text-purple-300">元素: {result.element}</span>
                <span className="text-purple-300">性質: {result.nature}</span>
              </div>
              <p className="mt-4 text-gray-200">{result.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">年運</h3>
                <p className="text-gray-200">{result.yearFortune}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">月運</h3>
                <p className="text-gray-200">{result.monthFortune}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">相性・人間関係</h3>
                <p className="text-gray-200">{result.relationships}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">キャリア・仕事運</h3>
                <p className="text-gray-200">{result.career}</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleChatStart}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors"
              >
                SENRIに質問する
              </button>
              <button
                onClick={() => navigate('/fortune')}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition-colors"
              >
                占い選択に戻る
              </button>
            </div>
          </div>
        </div>
      ) : (
        <FortuneChat
          fortuneType="sixstars"
          context={{
            reading: result.reading,
            additionalInfo: {
              star: result.star,
              element: result.element,
              nature: result.nature,
              yearFortune: result.yearFortune,
              monthFortune: result.monthFortune,
              relationships: result.relationships,
              career: result.career
            }
          }}
          initialMessage="六星占術の結果について、気になることを質問してください。"
          initialSuggestions={[
            { text: "年運について詳しく教えて？", label: "年運" },
            { text: "相性の良い星は？", label: "相性" },
            { text: "金運や仕事運はどうですか？", label: "仕事運" }
          ]}
        />
      )}
    </div>
  );
} 