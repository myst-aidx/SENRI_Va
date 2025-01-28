import React from 'react';
import { useNavigate } from 'react-router-dom';
import FortuneChat from './FortuneChat';

export default function DreamResult() {
  const navigate = useNavigate();
  const result = JSON.parse(localStorage.getItem('dreamResult') || '{}');

  if (!result.reading) {
    navigate('/fortune/dream');
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-purple-300 text-center">
          夢占いの結果
        </h1>
        
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">夢のテーマ</h2>
            <p className="text-white whitespace-pre-wrap">{result.dreamTheme}</p>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">象徴的な意味</h2>
            <p className="text-white whitespace-pre-wrap">{result.symbolism}</p>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">メッセージ</h2>
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
        fortuneType="dream"
        context={{
          reading: result.reading,
          additionalInfo: {
            dreamTheme: result.dreamTheme,
            symbolism: result.symbolism
          }
        }}
        initialMessage="夢占いの結果について、気になることを質問してください。"
        initialSuggestions={[
          { text: "この夢が示す潜在意識とは？", label: "潜在意識" },
          { text: "現実生活での注意点は？", label: "注意点" },
          { text: "この夢からのメッセージをより詳しく知りたい", label: "詳細なメッセージ" }
        ]}
      />
    </div>
  );
} 