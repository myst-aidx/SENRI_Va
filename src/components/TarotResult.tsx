import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Repeat } from 'lucide-react';
import FortuneChat from './FortuneChat';
import { TAROT_CARDS, CARD_IMAGES } from '../utils/tarot';

interface TarotResultData {
  cards: string[];
  details: string[];
  reading: string;
}

export default function TarotResult() {
  const navigate = useNavigate();
  const [resultData, setResultData] = useState<TarotResultData | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedResult = localStorage.getItem('tarotResult');
    if (!savedResult) {
      navigate('/fortune/tarot');
      return;
    }
    try {
      const parsedResult = JSON.parse(savedResult);
      setResultData(parsedResult);
      
      // 画像のプリロード
      parsedResult.cards.forEach((card: string) => {
        const img = new Image();
        img.src = CARD_IMAGES.cards[card as keyof typeof CARD_IMAGES.cards];
        img.onload = () => {
          setLoadedImages(prev => ({ ...prev, [card]: true }));
        };
        img.onerror = () => {
          console.error(`Failed to load image for card: ${card}`);
          setLoadedImages(prev => ({ ...prev, [card]: false }));
        };
      });
    } catch (error) {
      console.error('Error parsing tarot result:', error);
      navigate('/fortune/tarot');
    }
  }, [navigate]);

  if (!resultData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-purple-100">
      <nav className="p-4 bg-purple-900/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/fortune')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <Home size={24} />
            <span>占術メニュー</span>
          </button>
          <button
            onClick={() => navigate('/fortune/tarot')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <Repeat size={24} />
            <span>新しいタロット占い</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-4">タロットからのメッセージ</h1>
          </div>

          {/* カードの表示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-700/50">
                <h2 className="text-xl font-semibold mb-4">引いたカード</h2>
                <div className="grid grid-cols-1 gap-8">
                  {resultData.cards.map((card, index) => (
                    <motion.div
                      key={card}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: loadedImages[card] ? 1 : 0, y: loadedImages[card] ? 0 : 20 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex flex-col items-center space-y-4"
                    >
                      <div className="text-center w-full bg-purple-900/30 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-white">{TAROT_CARDS[card].name}</h3>
                        <p className="text-sm text-white/80 mt-2">{resultData.details[index]}</p>
                      </div>
                      <div className="w-full max-w-[300px] aspect-[2/3] rounded-xl overflow-hidden">
                        <img
                          src={CARD_IMAGES.cards[card as keyof typeof CARD_IMAGES.cards]}
                          alt={TAROT_CARDS[card].name}
                          className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
                            loadedImages[card] ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => setLoadedImages(prev => ({ ...prev, [card]: true }))}
                          onError={() => setLoadedImages(prev => ({ ...prev, [card]: false }))}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-700/50">
                <h2 className="text-xl font-semibold mb-4">解釈</h2>
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{resultData.reading}</div>
                </div>
              </div>

              <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-700/50">
                <FortuneChat
                  fortuneType="tarot"
                  context={{
                    type: "tarot",
                    reading: resultData.reading,
                    additionalInfo: {
                      cards: resultData.cards,
                      details: resultData.details
                    }
                  }}
                  initialMessage="タロットカードについて、気になることを質問してください。"
                  initialSuggestions={[
                    { text: "このカードの意味をもっと詳しく教えて", label: "意味" },
                    { text: "恋愛についての示唆は？", label: "恋愛" },
                    { text: "仕事への影響は？", label: "仕事" },
                    { text: "今後の展開について", label: "未来" }
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => navigate('/fortune/tarot')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Repeat size={20} />
              <span>新しいタロット占い</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 