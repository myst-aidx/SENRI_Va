import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, Repeat, Calendar, Clock, Compass, Heart, Briefcase, Brain, Activity, Send, Bot, Sparkles } from 'lucide-react';
import type { KyuseiStar } from '../utils/kyusei';
import { getGeminiResponse } from '../utils/ai';
import ChatLoading from './ChatLoading';

interface KyuseiResultState {
  birthDate: string;
  birthTime: string;
  result: KyuseiStar & { aiAnalysis: string };
  monthlyFortune: string;
  dailyFortune: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function KyuseiResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as KyuseiResultState;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!state?.birthDate || !state?.result) {
    navigate('/fortune/kyusei');
    return null;
  }

  const { result, monthlyFortune, dailyFortune } = state;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const prompt = `
以下の九星気学の鑑定結果に基づいて、ユーザーの質問に答えてください：

九星: ${result.name}
五行: ${result.element}
方位: ${result.direction}
基本的な性質:
${result.characteristics.join('\n')}

ユーザーの質問:
${userMessage}

できるだけ具体的で実践的なアドバイスを提供してください。
`;

      const response = await getGeminiResponse(prompt);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'すみません、エラーが発生しました。もう一度お試しください。' }]);
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
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Star className="w-12 h-12 text-purple-300" />
              <h1 className="text-3xl font-bold">九星気学鑑定結果</h1>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6 mb-8">
              <div className="text-center mb-8">
                <div className="text-lg text-purple-300 mb-2">あなたの九星</div>
                <div className="text-4xl font-bold text-purple-100">{result.name}</div>
                <div className="mt-2 text-purple-300">五行: {result.element} / 方位: {result.direction}</div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Brain className="w-6 h-6 mr-2" />
                  基本的な性質
                </h2>
                <ul className="space-y-2">
                  {result.characteristics.map((trait, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-purple-300">•</span>
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">性格と適性</h2>
                <div className="grid gap-4">
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2">長所</div>
                    <div className="flex flex-wrap gap-2">
                      {result.personality.strengths.map((strength, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-800/30 rounded-full text-sm">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2">注意点</div>
                    <div className="flex flex-wrap gap-2">
                      {result.personality.weaknesses.map((weakness, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-800/30 rounded-full text-sm">
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2">適性のある職業</div>
                    <div className="flex flex-wrap gap-2">
                      {result.personality.careers.map((career, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-800/30 rounded-full text-sm">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  運勢
                </h2>
                <div className="grid gap-4">
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2">今日の運勢</div>
                    <div className="text-purple-300">{dailyFortune}</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2">今月の運勢</div>
                    <div className="text-purple-300">{monthlyFortune}</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">今年の運勢</h2>
                <div className="grid gap-4">
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      仕事・キャリア
                    </div>
                    <div className="text-purple-300">{result.yearlyFortune.career}</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2 flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      人間関係
                    </div>
                    <div className="text-purple-300">{result.yearlyFortune.relationships}</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2 flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      健康
                    </div>
                    <div className="text-purple-300">{result.yearlyFortune.health}</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2">学び・成長</div>
                    <div className="text-purple-300">{result.yearlyFortune.study}</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2">金運</div>
                    <div className="text-purple-300">{result.yearlyFortune.wealth}</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">月運の詳細</h2>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <p className="mb-4">{result.monthlyFortune.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium mb-2">吉日</div>
                      <div className="text-purple-300">
                        {result.monthlyFortune.goodDays.join('日, ')}日
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-2">要注意日</div>
                      <div className="text-purple-300">
                        {result.monthlyFortune.badDays.join('日, ')}日
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-2">ラッキーカラー</div>
                      <div className="text-purple-300">
                        {result.monthlyFortune.luckyColors.join(', ')}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-2">開運方位</div>
                      <div className="text-purple-300">
                        {result.monthlyFortune.luckyDirections.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">相性</h2>
                <div className="grid gap-4">
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2 text-green-400">相性の良い星</div>
                    <div className="text-purple-300">{result.compatibility.good.join('、')}</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2 text-yellow-400">普通の相性</div>
                    <div className="text-purple-300">{result.compatibility.neutral.join('、')}</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2 text-red-400">要注意の相性</div>
                    <div className="text-purple-300">{result.compatibility.challenging.join('、')}</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2">ビジネスの相性</div>
                    <div className="text-purple-300">{result.compatibility.business.join('、')}</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="font-medium mb-2">恋愛の相性</div>
                    <div className="text-purple-300">{result.compatibility.romance.join('、')}</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">AIによる個別アドバイス</h2>
                <div className="bg-purple-900/30 rounded-lg p-4 whitespace-pre-wrap">
                  {result.aiAnalysis}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">人生の目標</h2>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <p className="text-purple-300">{result.personality.lifeGoal}</p>
                </div>
              </div>
            </div>

            {/* SENRIチャット部分 */}
            <div className="bg-purple-800/20 rounded-lg p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <div className="relative mr-3">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md"></div>
                  <div className="relative bg-purple-900/50 p-2 rounded-full">
                    <Sparkles className="w-6 h-6 text-purple-300" />
                  </div>
                </div>
                SENRIに質問する
              </h2>
              <p className="text-purple-300 mb-4">
                あなたの九星気学の結果について、より詳しく知りたいことを質問してください。
                SENRIが九星気学の観点から具体的なアドバイスを提供します。
              </p>

              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-purple-600/50'
                          : 'bg-purple-900/50'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && <ChatLoading />}
              </div>

              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="九星気学について質問してください..."
                  className="flex-1 px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-400"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => navigate('/fortune/kyusei')}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Repeat size={20} />
                <span>もう一度占う</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 
