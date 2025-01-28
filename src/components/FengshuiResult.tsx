import React from 'react';
import { useNavigate } from 'react-router-dom';
import FortuneChat from './FortuneChat';

export default function FengshuiResult() {
  const navigate = useNavigate();
  const result = JSON.parse(localStorage.getItem('fengshuiResult') || '{}');

  if (!result.reading) {
    navigate('/fortune/fengshui');
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-purple-300 text-center">
          風水占いの結果
        </h1>
        
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">方位の特徴</h2>
            <p className="text-white whitespace-pre-wrap">{result.direction}</p>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">五行のバランス</h2>
            <p className="text-white whitespace-pre-wrap">{result.elements}</p>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">運気の改善アドバイス</h2>
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
        fortuneType="fengshui"
        context={{
          reading: result.reading,
          additionalInfo: {
            direction: result.direction,
            elements: result.elements
          }
        }}
        initialMessage="風水の結果について、気になることを質問してください。"
        initialSuggestions={[
          { text: "方位の活用方法について詳しく知りたい", label: "方位の活用" },
          { text: "五行のバランスを整えるには？", label: "五行のバランス" },
          { text: "具体的な開運方法を教えて", label: "開運方法" }
        ]}
      />
    </div>
  );
} 