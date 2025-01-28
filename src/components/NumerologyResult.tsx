import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNumerologyResult } from '../utils/numerologyStorage';
import FortuneChat from './FortuneChat';
import { useEffect } from 'react';

export default function NumerologyResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = getNumerologyResult();

  useEffect(() => {
    // 直接URLアクセスで結果がない場合は診断画面にリダイレクト
    if (!result && location.pathname === '/fortune/numerology/result') {
      navigate('/fortune/numerology');
    }
  }, [result, location.pathname, navigate]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">診断結果が見つかりません</h1>
          <p className="mb-6">診断を最初からやり直してください</p>
          <button
            onClick={() => navigate('/fortune/numerology')}
            className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            診断をやり直す
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                あなたの運命数は{result.destinyNumber}
              </h2>
              {result.nameNumber && (
                <h2 className="text-2xl font-bold text-purple-300">
                  表現数は{result.nameNumber}
                </h2>
              )}
            </div>
            <p className="text-lg text-gray-300">
              {result.description}
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">数秘術の解説</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {result.detailedDescription}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">ポジティブな特徴</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {result.positiveTraits.map((trait: string, index: number) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">課題と成長</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {result.challenges.map((challenge: string, index: number) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">相性の良い数字</h3>
              <div className="flex flex-wrap gap-2">
                {result.compatibleNumbers.map((number: number, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-700 rounded-full text-gray-200"
                  >
                    {number}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">ラッキーアイテム</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {result.luckyItems.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-800 rounded-xl">
            <FortuneChat
              fortuneType="numerology"
              context={{
                type: result.destinyNumber.toString(),
                reading: {
                  destinyNumber: result.destinyNumber,
                  description: result.description,
                  detailedDescription: result.detailedDescription,
                  positiveTraits: result.positiveTraits,
                  challenges: result.challenges,
                  compatibleNumbers: result.compatibleNumbers,
                  luckyItems: result.luckyItems
                }
              }}
              initialMessage="こんにちは！運命数に関する詳しい解説や、具体的なアドバイスについて質問してください。"
              initialSuggestions={[
                {
                  text: 'この運命数の特徴について詳しく教えてください',
                  label: '特徴について'
                },
                {
                  text: '運命数が示す人生の課題について詳しく教えてください',
                  label: '課題について'
                },
                {
                  text: 'この運命数を活かした理想的な生き方を教えてください',
                  label: '活かし方'
                }
              ]}
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/fortune/numerology')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              もう一度診断する
            </button>
            <button
              onClick={() => navigate('/fortune')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              占い選択に戻る
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
