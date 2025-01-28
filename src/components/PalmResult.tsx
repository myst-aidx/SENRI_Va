import React from 'react';
import { useNavigate } from 'react-router-dom';
import FortuneChat from './FortuneChat';

export default function PalmResult() {
  const navigate = useNavigate();
  const result = JSON.parse(localStorage.getItem('palmResult') || '{}');

  if (!result.reading) {
    navigate('/fortune/palm');
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-purple-300 text-center">
          手相占いの結果
        </h1>
        
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">運命線の特徴</h2>
            <p className="text-white whitespace-pre-wrap">{result.fateLine}</p>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">感情線の特徴</h2>
            <p className="text-white whitespace-pre-wrap">{result.heartLine}</p>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">総合的な解釈</h2>
            <p className="text-white whitespace-pre-wrap">{result.reading}</p>
          </div>
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

      <FortuneChat
        fortuneType="palm"
        context={{
          reading: result.reading,
          additionalInfo: {
            fateLine: result.fateLine,
            heartLine: result.heartLine
          }
        }}
        initialMessage="手相占いの結果について、気になることを質問してください。"
        initialSuggestions={[
          { text: "運命線が示す将来の可能性は？", label: "将来の可能性" },
          { text: "感情線から見る人間関係の傾向は？", label: "人間関係の傾向" },
          { text: "全体的な運勢について詳しく知りたい", label: "全体的な運勢" }
        ]}
      />
    </div>
  );
} 