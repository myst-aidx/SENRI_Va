import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, FileText, Star, Send, Bot } from 'lucide-react';
import type { SeimeiResult } from '../utils/seimei';
import { getGeminiResponse } from '../utils/ai';
import ChatLoading from './ChatLoading';

interface SeimeiResultState {
  name: {
    familyName: string;
    givenName: string;
    familyNameKana: string;
    givenNameKana: string;
  };
  result: SeimeiResult;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function SeimeiResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SeimeiResultState;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!state?.name || !state?.result) {
    navigate('/fortune/seimei');
    return null;
  }

  const { name, result } = state;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const prompt = `
以下の姓名判断の結果に基づいて、ユーザーの質問に答えてください：

名前: ${name.familyName}${name.givenName}
天格: ${result.tenkaku.value} - ${result.tenkaku.meaning}
人格: ${result.jinkaku.value} - ${result.jinkaku.meaning}
地格: ${result.chikaku.value} - ${result.chikaku.meaning}
外格: ${result.gaikaku.value} - ${result.gaikaku.meaning}
総格: ${result.soukaku.value} - ${result.soukaku.meaning}

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
              <FileText className="w-12 h-12 text-purple-300" />
              <h1 className="text-3xl font-bold">姓名判断結果</h1>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6 mb-8">
              <div className="text-center mb-8">
                <div className="text-lg text-purple-300 mb-2">あなたの名前</div>
                <div className="text-4xl font-bold text-purple-100">
                  {name.familyName} {name.givenName}
                </div>
                <div className="mt-2 text-purple-300">
                  {name.familyNameKana} {name.givenNameKana}
                </div>
              </div>

              {/* 各文字のエネルギー */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">文字のエネルギー</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2">姓</h3>
                    <div className="space-y-2">
                      {result.nameEnergy.family.map((char: { kanji: string; strokes: number; energy: string }, index: number) => (
                        <div key={index} className="text-purple-300">
                          {char.energy}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2">名</h3>
                    <div className="space-y-2">
                      {result.nameEnergy.given.map((char: { kanji: string; strokes: number; energy: string }, index: number) => (
                        <div key={index} className="text-purple-300">
                          {char.energy}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 五格の解説 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">五格の解説</h2>
                <div className="grid gap-4">
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2">天格（{result.tenkaku.value}画）</h3>
                    <p className="text-purple-300 mb-2">{result.tenkaku.meaning}</p>
                    <p className="text-purple-300">{result.tenkaku.fortune}</p>
                    <div className="mt-4">
                      <div className="font-medium mb-2">性格の特徴</div>
                      <div className="flex flex-wrap gap-2">
                        {result.tenkaku.personality.map((trait: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-purple-800/30 rounded-full text-sm">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2">人格（{result.jinkaku.value}画）</h3>
                    <p className="text-purple-300 mb-2">{result.jinkaku.meaning}</p>
                    <p className="text-purple-300">{result.jinkaku.fortune}</p>
                    <div className="mt-4">
                      <div className="font-medium mb-2">対人関係の特徴</div>
                      <div className="flex flex-wrap gap-2">
                        {result.jinkaku.relationships.map((trait: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-purple-800/30 rounded-full text-sm">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2">地格（{result.chikaku.value}画）</h3>
                    <p className="text-purple-300 mb-2">{result.chikaku.meaning}</p>
                    <p className="text-purple-300">{result.chikaku.fortune}</p>
                    <div className="mt-4">
                      <div className="font-medium mb-2">適性のある職業</div>
                      <div className="flex flex-wrap gap-2">
                        {result.chikaku.career.map((career: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-purple-800/30 rounded-full text-sm">
                            {career}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2">外格（{result.gaikaku.value}画）</h3>
                    <p className="text-purple-300 mb-2">{result.gaikaku.meaning}</p>
                    <p className="text-purple-300">{result.gaikaku.fortune}</p>
                    <div className="mt-4">
                      <div className="font-medium mb-2">アドバイス</div>
                      <div className="space-y-2">
                        {result.gaikaku.advice.map((advice, index) => (
                          <div key={index} className="text-purple-300">
                            • {advice}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2">総格（{result.soukaku.value}画）</h3>
                    <p className="text-purple-300 mb-2">{result.soukaku.meaning}</p>
                    <p className="text-purple-300">{result.soukaku.fortune}</p>
                  </div>
                </div>
              </div>

              {/* 相性 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">相性</h2>
                <div className="grid gap-4">
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2">ビジネス</h3>
                    <p className="text-purple-300">{result.compatibility.business}</p>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2">恋愛</h3>
                    <p className="text-purple-300">{result.compatibility.romance}</p>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-medium mb-2">友情</h3>
                    <p className="text-purple-300">{result.compatibility.friendship}</p>
                  </div>
                </div>
              </div>

              {/* 運命の方向性 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">運命の方向性</h2>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <p className="text-purple-300">{result.lifeDestiny}</p>
                </div>
              </div>

              {/* AIによる総合分析 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">AIによる総合分析</h2>
                <div className="bg-purple-900/30 rounded-lg p-4 whitespace-pre-wrap">
                  {result.aiAnalysis}
                </div>
              </div>
            </div>

            {/* SENRIチャット部分 */}
            <div className="bg-purple-800/20 rounded-lg p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <div className="relative mr-3">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md"></div>
                  <div className="relative bg-purple-900/50 p-2 rounded-full">
                    <Star className="w-6 h-6 text-purple-300" />
                  </div>
                </div>
                SENRIに質問する
              </h2>
              <p className="text-purple-300 mb-4">
                あなたの姓名判断の結果について、より詳しく知りたいことを質問してください。
                SENRIが姓名判断の観点から具体的なアドバイスを提供します。
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
                  placeholder="姓名判断について質問してください..."
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
                onClick={() => navigate('/fortune/seimei')}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span>もう一度占う</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 
