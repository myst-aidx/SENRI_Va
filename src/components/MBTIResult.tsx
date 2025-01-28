import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMBTIResult } from '../utils/mbtiStorage';
import FortuneChat from './FortuneChat';

export default function MBTIResult() {
  const navigate = useNavigate();
  const result = getMBTIResult();

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">診断結果が見つかりません</h1>
          <p className="mb-6">診断を最初からやり直してください</p>
          <button
            onClick={() => navigate('/fortune/mbti')}
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
            <h2 className="text-3xl font-bold">
              あなたは{result.name}タイプ ({result.type})
            </h2>
            <p className="text-lg text-gray-300">
              {result.description}
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">タイプの詳細</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {result.detailedDescription}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">強み</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {result.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">改善点</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {result.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">相性の良いタイプ</h3>
              <div className="flex flex-wrap gap-2">
                {result.compatibleTypes.map((type, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-700 rounded-full text-gray-200"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">向いている職業</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {result.careers.map((career, index) => (
                  <li key={index}>{career}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-purple-300 text-center">
              SENRIに質問する
            </h3>
            <p className="text-gray-300 text-center mb-6">
              あなたのMBTIタイプについて、より詳しく知りたいことを質問してください
            </p>
            <FortuneChat
              fortuneType="mbti"
              context={{
                type: result.type,
                reading: {
                  name: result.name,
                  description: result.description,
                  detailedDescription: result.detailedDescription,
                  strengths: result.strengths,
                  weaknesses: result.weaknesses,
                  compatibleTypes: result.compatibleTypes,
                  careers: result.careers
                }
              }}
              initialMessage={`こんにちは！SENRIです。あなたの${result.type}タイプについて、もっと詳しく知りたいことはありますか？`}
              initialSuggestions={[
                {
                  text: 'このタイプの強みについて詳しく教えてください',
                  label: '強みについて'
                },
                {
                  text: 'このタイプの改善点や課題について詳しく教えてください',
                  label: '改善点について'
                },
                {
                  text: 'このタイプと相性の良いMBTIタイプについて、その理由も含めて教えてください',
                  label: '相性について'
                }
              ]}
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/fortune/mbti')}
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