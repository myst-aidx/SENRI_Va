import React from 'react';
import { useNavigate } from 'react-router-dom';
import FortuneChat from './FortuneChat';

export default function AnimalResult() {
  const navigate = useNavigate();
  const result = JSON.parse(localStorage.getItem('animalResult') || '{}');

  if (!result.animal) {
    navigate('/fortune/animal');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-purple-300 text-center">
          動物占いの結果
        </h1>

        {/* 本命の動物とカラー */}
        <div className="text-center space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-purple-200 mb-2">あなたの動物</h2>
            <p className="text-xl text-white">{result.animal}</p>
            <p className="text-gray-300 mt-2">{result.baseTraits}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-purple-200 mb-2">カラー</h2>
            <p className="text-xl text-white">
              {result.color}（{result.element}）
            </p>
            <p className="text-gray-300 mt-2">{result.colorTraits}</p>
          </div>
        </div>

        {/* 性格分析 */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-purple-200 mb-3">性格分析</h2>
          <p className="text-gray-200 whitespace-pre-wrap">{result.personalityAnalysis}</p>
        </div>

        {/* 長所と短所 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-purple-200 mb-3">長所</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              {result.strengths.map((strength: string, index: number) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-purple-200 mb-3">短所</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              {result.weaknesses.map((weakness: string, index: number) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 可能性と才能 */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-purple-200 mb-3">可能性と才能</h2>
          <p className="text-gray-200 whitespace-pre-wrap">{result.potentials}</p>
        </div>

        {/* 対人関係 */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-purple-200 mb-3">対人関係</h2>
          <p className="text-gray-200 whitespace-pre-wrap">{result.relationships}</p>
        </div>

        {/* キャリア */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-purple-200 mb-3">キャリア</h2>
          <p className="text-gray-200 whitespace-pre-wrap">{result.career}</p>
        </div>

        {/* アドバイス */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-purple-200 mb-3">アドバイス</h2>
          <ul className="list-disc list-inside text-gray-200 space-y-2">
            {result.advice.map((advice: string, index: number) => (
              <li key={index}>{advice}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/fortune')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors"
          >
            占い選択に戻る
          </button>
        </div>
      </div>

      {/* チャットボット */}
      <FortuneChat
        fortuneType="animal"
        context={{
          reading: `${result.animal}（${result.color}）の${result.personalityAnalysis}`,
          additionalInfo: {
            animal: result.animal,
            color: result.color,
            element: result.element,
            traits: result.baseTraits,
            colorTraits: result.colorTraits,
            strengths: result.strengths,
            weaknesses: result.weaknesses
          }
        }}
        initialMessage="動物占いの結果について、気になることを質問してください。"
        initialSuggestions={[
          { text: "この動物の特徴について詳しく知りたい", label: "動物の特徴" },
          { text: "相性の良い動物は？", label: "相性" },
          { text: "今後の運勢について詳しく教えて", label: "運勢" }
        ]}
      />
    </div>
  );
} 