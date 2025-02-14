import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { 
  generateTarotReading, 
  generateTarotChatResponse,
  drawCards, 
  TAROT_CARDS, 
  getCardDetail,
  type TarotCard,
  type SpreadType,
  type CardPosition
} from '../utils/tarot';
import { classNames } from '../utils/styles';
import LoadingSpinner from './LoadingSpinner';
import FortuneChat from './FortuneChat';

// 型定義
interface TarotReaderProps {
  onFeedback?: (feedback: string) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SpreadPattern {
  name: string;
  description: string;
  positions: CardPosition[];
}

// スプレッドパターンの定義
const SPREAD_PATTERNS: Record<SpreadType, SpreadPattern> = {
  SINGLE: {
    name: 'シングルカード',
    description: '今日のメッセージや、単一の質問への答えを得るのに適しています。',
    positions: [{ meaning: '現在の状況や、質問への答え' }]
  },
  THREE_CARD: {
    name: '3枚スプレッド',
    description: '過去、現在、未来、または状況の展開を見るのに適しています。',
    positions: [
      { meaning: '過去の影響' },
      { meaning: '現在の状況' },
      { meaning: '未来の可能性' }
    ]
  },
  CELTIC_CROSS: {
    name: 'ケルティッククロス',
    description: '状況を深く詳細に分析するための伝統的なスプレッドです。',
    positions: [
      { meaning: '現在の状況' },
      { meaning: '直面する課題' },
      { meaning: '目標や理想' },
      { meaning: '過去の基礎' },
      { meaning: '可能性や希望' },
      { meaning: '未来の展開' },
      { meaning: '自分自身の態度' },
      { meaning: '周囲の影響' },
      { meaning: '希望と不安' },
      { meaning: '最終的な結果' }
    ]
  }
};

// カード画像のパス定義（修正済み：画像フォルダのパスを/tarot/に変更）
const CARD_IMAGES = {
  back: '/tarot/back.jpg',
  cards: {
    THE_FOOL: '/tarot/fool.jpg',
    THE_MAGICIAN: '/tarot/magician.jpg',
    THE_HIGH_PRIESTESS: '/tarot/high_priestess.jpg',
    THE_EMPRESS: '/tarot/empress.jpg',
    THE_EMPEROR: '/tarot/emperor.jpg',
    THE_HIEROPHANT: '/tarot/hierophant.jpg',
    THE_LOVERS: '/tarot/lovers.jpg',
    THE_CHARIOT: '/tarot/chariot.jpg',
    STRENGTH: '/tarot/strength.jpg',
    THE_HERMIT: '/tarot/hermit.jpg',
    WHEEL_OF_FORTUNE: '/tarot/wheel_of_fortune.jpg',
    JUSTICE: '/tarot/justice.jpg',
    THE_HANGED_MAN: '/tarot/hanged_man.jpg',
    DEATH: '/tarot/death.jpg',
    TEMPERANCE: '/tarot/temperance.jpg',
    THE_DEVIL: '/tarot/devil.jpg',
    THE_TOWER: '/tarot/tower.jpg',
    THE_STAR: '/tarot/star.jpg',
    THE_MOON: '/tarot/moon.jpg',
    THE_SUN: '/tarot/sun.jpg',
    JUDGEMENT: '/tarot/judgement.jpg',
    THE_WORLD: '/tarot/world.jpg'
  } as const
};

// スタイル定義
const styles = {
  container: {
    background: 'linear-gradient(135deg, rgba(18, 10, 32, 0.95) 0%, rgba(25, 15, 45, 0.95) 100%)',
    minHeight: '100vh',
    width: '100vw',
    overflow: 'hidden'
  },
  section: {
    background: 'rgba(30, 20, 50, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
  },
  cardBack: {
    background: `url('/tarot/back.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    boxShadow: `
      0 0 20px rgba(88, 40, 169, 0.2),
      inset 0 0 15px rgba(138, 43, 226, 0.1)
    `
  },
  decoration: {
    background: `
      repeating-linear-gradient(
        45deg,
        rgba(138, 43, 226, 0.05) 0%,
        rgba(138, 43, 226, 0.05) 2px,
        transparent 2px,
        transparent 8px
      ),
      repeating-linear-gradient(
        -45deg,
        rgba(138, 43, 226, 0.05) 0%,
        rgba(138, 43, 226, 0.05) 2px,
        transparent 2px,
        transparent 8px
      )
    `
  }
};

// アニメーション設定
const animations = {
  deck: {
    initial: {
      scale: 1,
      y: 0,
      rotateY: 0,
      transition: { duration: 0.5 }
    },
    drawing: (index: number) => ({
      scale: [1, 1.02, 1],
      y: [0, -5, 0],
      rotateY: [0, -2, 0],
      transition: {
        duration: 0.6,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }
    })
  },
  card: {
    initial: { 
      scale: 0.8,
      opacity: 0,
      y: 50
    },
    enter: (index: number) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  },
  chat: {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    modal: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { 
        scale: 1, 
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      },
      exit: { 
        scale: 0.9, 
        opacity: 0,
        transition: {
          duration: 0.2,
          ease: "easeIn"
        }
      }
    }
  }
};

// MysticSymbol コンポーネント
const MysticSymbol: React.FC = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full text-purple-300/40"
    style={{ filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.3))' }}
  >
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" />
    <path
      d="M50 5 L50 95 M5 50 L95 50 M15.5 15.5 L84.5 84.5 M15.5 84.5 L84.5 15.5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <circle cx="50" cy="50" r="8" fill="currentColor" />
  </svg>
);

const validateQuestionInput = (input: string) => {
  if (input.length > 500) {
    throw new TarotError('質問は500文字以内で入力してください', 'CONTENT_TOO_LONG');
  }
  if (/[<>]/.test(input)) {
    throw new TarotError('無効な文字が含まれています', 'INVALID_CONTENT');
  }
};

// TarotError クラスの定義
class TarotError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'TarotError';
  }
}

// LoadingOverlay コンポーネントの修正
const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => (
  <motion.div
    className="absolute inset-0 bg-black/50 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="text-center space-y-4">
      <LoadingSpinner />
      <p className="text-purple-200 animate-pulse">
        {message || 'カードの意味を読み解いています...'}
      </p>
    </div>
  </motion.div>
);

export default function TarotReader({ onFeedback }: TarotReaderProps) {
  const navigate = useNavigate();
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // State管理
  const [spreadType, setSpreadType] = useState<SpreadType>('SINGLE');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [cardDetails, setCardDetails] = useState<string[]>([]);
  const [reading, setReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeck, setShowDeck] = useState(true);
  const [drawingCard, setDrawingCard] = useState(false);
  const [drawingIndex, setDrawingIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [animationState, setAnimationState] = useState<'initial' | 'selecting' | 'flipping' | 'complete'>('initial');
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  // チャットメッセージが追加されたら自動スクロール
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // チャットが表示されたらinputにフォーカス
  useEffect(() => {
    if (showChat && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [showChat]);

  // スプレッド選択時の処理
  const handleSpreadChange = useCallback((value: SpreadType) => {
    setSpreadType(value);
    setSelectedCards([]);
    setCardDetails([]);
    setReading(null);
    setShowDeck(true);
    setError(null);
  }, []);

  // カードを引く処理
  const handleDrawCard = useCallback(async () => {
    setIsLoading(true);
    setAnimationState('selecting');

    // カードを選ぶアニメーション
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnimationState('flipping');

    try {
      const pattern = SPREAD_PATTERNS[spreadType];
      const drawnCards = drawCards(pattern.positions.length);
      setSelectedCards(drawnCards);

      // カードの詳細を取得
      const details = drawnCards.map(card => getCardDetail(card));
      setCardDetails(details);

      // リーディングを生成
      const readingResult = await generateTarotReading(spreadType, "今日の運勢を教えてください", drawnCards);
      setReading(readingResult);

      // カードが裏返っている状態でAIの処理を待つ
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 結果を表示
      setAnimationState('complete');
      setShowDeck(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '占いの生成中にエラーが発生しました');
      console.error('Tarot reading error:', err);
      setAnimationState('initial');
    } finally {
      setIsLoading(false);
    }
  }, [spreadType]);

  // チャットメッセージを送信
  const handleSendMessage = async (message: string) => {
    try {
      validateQuestionInput(message);
      setIsChatLoading(true);
      setChatMessages(prev => [...prev, { role: 'user', content: message }]);
      setChatInput('');

      const response = await generateTarotChatResponse(spreadType, message, selectedCards);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);

      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    } catch (error) {
      if (error instanceof TarotError) {
        setError(error.message);
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleStartReading = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // カード選択のバリデーション
      if (selectedCards.length !== SPREAD_PATTERNS[spreadType].positions.length) {
        throw new TarotError('必要な枚数のカードを選択してください', 'INVALID_CARD');
      }

      const reading = await generateTarotReading(
        spreadType,
        "今日の運勢を教えてください",
        selectedCards
      );
      
      setReading(reading);
      setAnimationState('complete');
    } catch (error) {
      if (error instanceof TarotError) {
        setError(error.message);
      } else {
        setError('リーディングの生成中に予期せぬエラーが発生しました');
        console.error('Reading error:', error);
      }
      setAnimationState('initial');
    } finally {
      setIsLoading(false);
    }
  };

  // エラー表示用コンポーネント
  const ErrorMessage = ({ message }: { message: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-red-900/30 rounded-lg"
    >
      <div className="flex items-center gap-2 text-red-300">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{message}</span>
      </div>
      <button
        onClick={() => setError(null)}
        className="mt-2 text-sm text-red-200 hover:text-red-100"
      >
        再試行する
      </button>
    </motion.div>
  );

  if (isLoading) {
    return <LoadingSpinner message="タロットカードからのメッセージを受け取っています..." />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 p-8">
      {/* ローディング画面 */}
      {isLoading && <LoadingOverlay message="タロットカードからのメッセージを受け取っています..." />}

      <div className="max-w-[1920px] mx-auto px-4 py-6">
        {/* ヘッダー */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            タロットカードリーディング
          </h1>
          <button
            onClick={() => navigate('/fortune')}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-colors"
          >
            占術メニューに戻る
          </button>
        </header>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* 左カラム：スプレッド選択、デッキ */}
          <div className="lg:sticky lg:top-6 lg:self-start space-y-6">
            <div className="p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg">
              <div className="space-y-4">
                <label className="block text-lg font-medium text-purple-200">
                  スプレッドを選択
                </label>
                <select
                  value={spreadType}
                  onChange={(e) => handleSpreadChange(e.target.value as SpreadType)}
                  className="w-full p-3 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100"
                  disabled={isLoading || !!reading}
                >
                  {Object.entries(SPREAD_PATTERNS).map(([key, { name }]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* デッキ */}
              {!reading && (
                <div className="relative h-[400px] flex items-center justify-center mt-6">
                  <AnimatePresence mode="wait">
                    {animationState === 'initial' && (
                      <motion.div
                        key="initial"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <button
                          onClick={handleDrawCard}
                          disabled={isLoading}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          カードを引く
                        </button>
                      </motion.div>
                    )}

                    {animationState === 'selecting' && (
                      <motion.div
                        key="selecting"
                        className="absolute"
                        animate={{
                          x: [-200, 200, -200],
                          y: [-100, 100, -100],
                        }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                      >
                        <img
                          src={CARD_IMAGES.back}
                          alt="タロットカード"
                          className="w-48 h-auto"
                        />
                      </motion.div>
                    )}

                    {animationState === 'flipping' && (
                      <motion.div
                        key="flipping"
                        className="absolute"
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <img
                          src={CARD_IMAGES.back}
                          alt="タロットカード"
                          className="w-48 h-auto"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* 選ばれたカード */}
            {reading && selectedCards.length > 0 && (
              <div className="p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">引いたカード</h2>
                <div className="grid grid-cols-1 gap-4">
                  {selectedCards.map((card, index) => (
                    <motion.div
                      key={card}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="relative aspect-[2/3] rounded-xl overflow-hidden"
                    >
                      <img
                        src={CARD_IMAGES.cards[card as keyof typeof CARD_IMAGES.cards]}
                        alt={card}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white">{card}</h3>
                        <p className="text-sm text-white/80">{cardDetails[index]}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右カラム：リーディング結果とチャット */}
          {reading && (
            <div className="space-y-6">
              <div className="p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">タロットからのメッセージ</h2>
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{reading}</div>
                </div>
              </div>

              <div className="p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                <FortuneChat
                  fortuneType="tarot"
                  context={{
                    type: "tarot",
                    reading: reading,
                    additionalInfo: {
                      cards: selectedCards,
                      details: cardDetails
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

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setReading(null);
                    setSelectedCards([]);
                    setCardDetails([]);
                    setAnimationState('initial');
                    setShowDeck(true);
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  もう一度占う
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}