import React from 'react';
import { useNavigate } from 'react-router-dom';
import FortuneChat from './FortuneChat';

export default function FourPillarsResult() {
  const navigate = useNavigate();
  const result = JSON.parse(localStorage.getItem('fourPillarsResult') || '{}');

  if (!result.reading) {
    navigate('/fortune/fourpillars');
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-purple-300 text-center">
          四柱推命の結果
        </h1>
        
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">四柱</h2>
            <div className="grid grid-cols-4 gap-4 mt-2">
              <div>
                <h3 className="text-purple-200">年柱</h3>
                <p className="text-white">{result.yearPillar}</p>
              </div>
              <div>
                <h3 className="text-purple-200">月柱</h3>
                <p className="text-white">{result.monthPillar}</p>
              </div>
              <div>
                <h3 className="text-purple-200">日柱</h3>
                <p className="text-white">{result.dayPillar}</p>
              </div>
              <div>
                <h3 className="text-purple-200">時柱</h3>
                <p className="text-white">{result.hourPillar}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">基本性格</h2>
            <p className="text-white whitespace-pre-wrap">{result.personality}</p>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-purple-200">運勢の解釈</h2>
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
        fortuneType="fourpillars"
        context={{
          reading: result.reading,
          additionalInfo: {
            yearPillar: result.yearPillar,
            monthPillar: result.monthPillar,
            dayPillar: result.dayPillar,
            hourPillar: result.hourPillar,
            personality: result.personality
          }
        }}
        initialMessage="四柱推命の結果について、気になることを質問してください。"
        initialSuggestions={[
          { text: "各柱の相互作用について詳しく知りたい", label: "柱の相互作用" },
          { text: "今後の運勢の流れは？", label: "運勢の流れ" },
          { text: "相性の良い属性は？", label: "相性" }
        ]}
      />
    </div>
  );
} 