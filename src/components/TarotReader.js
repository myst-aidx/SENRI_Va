import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { generateTarotReading, generateTarotChatResponse, drawCards, TAROT_CARDS, getCardDetail } from '../utils/tarot';
import { classNames } from '../utils/styles';
import LoadingSpinner from './LoadingSpinner';
// スプレッドパターンの定義
const SPREAD_PATTERNS = {
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
// カード画像のパス定義
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
    }
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
        drawing: (index) => ({
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
        enter: (index) => ({
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
const MysticSymbol = () => (_jsxs("svg", { viewBox: "0 0 100 100", className: "w-full h-full text-purple-300/40", style: { filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.3))' }, children: [_jsx("circle", { cx: "50", cy: "50", r: "45", fill: "none", stroke: "currentColor", strokeWidth: "2" }), _jsx("circle", { cx: "50", cy: "50", r: "38", fill: "none", stroke: "currentColor", strokeWidth: "1" }), _jsx("path", { d: "M50 5 L50 95 M5 50 L95 50 M15.5 15.5 L84.5 84.5 M15.5 84.5 L84.5 15.5", stroke: "currentColor", strokeWidth: "1", fill: "none" }), _jsx("circle", { cx: "50", cy: "50", r: "8", fill: "currentColor" })] }));
export default function TarotReader({ onFeedback }) {
    const navigate = useNavigate();
    const chatInputRef = useRef(null);
    const chatMessagesRef = useRef(null);
    // State管理
    const [spreadType, setSpreadType] = useState('SINGLE');
    const [selectedCards, setSelectedCards] = useState([]);
    const [cardDetails, setCardDetails] = useState([]);
    const [reading, setReading] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDeck, setShowDeck] = useState(true);
    const [drawingCard, setDrawingCard] = useState(false);
    const [drawingIndex, setDrawingIndex] = useState(0);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
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
    const handleSpreadChange = useCallback((value) => {
        setSpreadType(value);
        setSelectedCards([]);
        setCardDetails([]);
        setReading(null);
        setShowDeck(true);
        setError(null);
    }, []);
    // カードを引く処理
    const handleDrawCard = useCallback(async () => {
        try {
            setError(null);
            setDrawingCard(true);
            setIsLoading(true);
            const pattern = SPREAD_PATTERNS[spreadType];
            const drawnCards = drawCards(pattern.positions.length);
            setSelectedCards(drawnCards);
            // カードの詳細を取得
            const details = drawnCards.map(card => getCardDetail(card));
            setCardDetails(details);
            // リーディングを生成
            const readingResult = await generateTarotReading(spreadType, "今日の運勢を教えてください", drawnCards);
            setReading(readingResult);
            setShowDeck(false);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '占いの生成中にエラーが発生しました');
            console.error('Tarot reading error:', err);
        }
        finally {
            setDrawingCard(false);
            setIsLoading(false);
        }
    }, [spreadType]);
    // チャットメッセージを送信
    const handleSendMessage = async (message) => {
        if (!message.trim())
            return;
        try {
            setIsChatLoading(true);
            setChatMessages(prev => [...prev, { role: 'user', content: message }]);
            setChatInput('');
            const response = await generateTarotChatResponse(spreadType, message, selectedCards);
            setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
            if (chatMessagesRef.current) {
                chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'チャットの生成中にエラーが発生しました');
            console.error('Chat error:', err);
        }
        finally {
            setIsChatLoading(false);
        }
    };
    return (_jsxs("div", { className: "relative min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 p-8", children: [_jsx(AnimatePresence, { children: (isLoading || drawingCard) && (_jsx(LoadingSpinner, { message: drawingCard ? 'カードを選んでいます...' :
                        isLoading ? 'カードを読み解いています...' :
                            '占い中...' })) }), _jsxs("div", { className: "max-w-[1920px] mx-auto px-4 py-6", children: [_jsxs("header", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200", children: "\u30BF\u30ED\u30C3\u30C8\u30AB\u30FC\u30C9\u30EA\u30FC\u30C7\u30A3\u30F3\u30B0" }), _jsx("button", { onClick: () => navigate('/fortune'), className: "px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-colors", children: "\u5360\u3044\u9078\u629E\u306B\u623B\u308B" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6", children: [_jsxs("div", { className: "lg:sticky lg:top-6 lg:self-start space-y-6", children: [_jsxs("div", { style: styles.section, className: "p-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "block text-lg font-medium text-purple-200", children: "\u30B9\u30D7\u30EC\u30C3\u30C9\u3092\u9078\u629E" }), _jsx("select", { value: spreadType, onChange: (e) => handleSpreadChange(e.target.value), className: "w-full p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent", children: Object.entries(SPREAD_PATTERNS).map(([key, { name }]) => (_jsx("option", { value: key, children: name }, key))) })] }), showDeck && (_jsx("div", { className: "relative w-[150px] h-[225px] mx-auto my-6", children: _jsx(motion.div, { style: styles.cardBack, className: "absolute w-full h-full rounded-xl overflow-hidden", variants: animations.deck, initial: "initial", animate: drawingCard ? "drawing" : "initial", custom: drawingIndex }) })), _jsx("button", { onClick: handleDrawCard, disabled: isLoading, className: classNames("w-full py-3 rounded-lg font-medium transition-all duration-300", "bg-gradient-to-r from-purple-500 to-pink-500", "hover:from-purple-600 hover:to-pink-600", "focus:outline-none focus:ring-2 focus:ring-purple-400", "disabled:opacity-50 disabled:cursor-not-allowed", "text-white shadow-lg"), children: isLoading ? 'カードを選んでいます...' : 'カードを引く' })] }), selectedCards.length > 0 && (_jsx("div", { style: styles.section, className: "p-6", children: _jsx("div", { className: classNames('grid', spreadType === 'SINGLE' && 'grid-cols-1 place-items-center', spreadType === 'THREE_CARD' && 'grid-cols-3 gap-x-4', spreadType === 'CELTIC_CROSS' && 'grid-cols-2 gap-4'), children: _jsx(AnimatePresence, { mode: "wait", children: selectedCards.map((cardKey, index) => (_jsx(motion.div, { variants: animations.card, initial: "initial", animate: "enter", whileHover: "hover", custom: index, className: "relative", children: _jsxs("div", { className: "w-[120px] h-[180px] rounded-xl shadow-xl overflow-hidden", children: [_jsx("img", { src: CARD_IMAGES.cards[cardKey], alt: TAROT_CARDS[cardKey].name, className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300", children: _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-3 text-white", children: [_jsx("h4", { className: "font-bold text-xs mb-1", children: SPREAD_PATTERNS[spreadType].positions[index].meaning }), _jsx("p", { className: "text-xs opacity-90", children: TAROT_CARDS[cardKey].name })] }) })] }) }, cardKey))) }) }) }))] }), reading && (_jsxs("div", { style: styles.section, className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-purple-200 mb-6", children: "\u30BF\u30ED\u30C3\u30C8\u304B\u3089\u306E\u30E1\u30C3\u30BB\u30FC\u30B8" }), _jsx("div", { className: "prose prose-invert max-w-none", children: reading.split('\n').map((line, index) => {
                                            if (line.startsWith('【')) {
                                                return (_jsx("h3", { className: "text-lg font-bold text-purple-200 mt-6 mb-3", children: line }, index));
                                            }
                                            if (line.startsWith('**')) {
                                                return (_jsx("h4", { className: "text-base font-semibold text-purple-300 mt-4 mb-2", children: line.replace(/\*\*/g, '') }, index));
                                            }
                                            if (line.trim() === '') {
                                                return _jsx("br", {}, index);
                                            }
                                            return (_jsx("p", { className: "text-purple-100 leading-relaxed mb-3", children: line }, index));
                                        }) }), _jsx("button", { onClick: () => setShowChat(true), className: "mt-6 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-colors", children: "\u8A73\u3057\u304F\u8CEA\u554F\u3059\u308B" })] }))] }), _jsx(AnimatePresence, { children: showChat && (_jsxs("div", { className: "fixed inset-0 z-50", children: [_jsx(motion.div, { className: "absolute inset-0 bg-black/50", variants: animations.chat.overlay, initial: "initial", animate: "animate", exit: "exit", onClick: () => setShowChat(false) }), _jsx("div", { className: "absolute inset-0 overflow-y-auto", children: _jsx("div", { className: "min-h-full flex items-center justify-center p-4", children: _jsxs(motion.div, { style: styles.section, className: "w-full max-w-2xl bg-purple-900/95", variants: animations.chat.modal, initial: "initial", animate: "animate", exit: "exit", children: [_jsxs("div", { className: "p-6 flex justify-between items-center border-b border-purple-500/20", children: [_jsx("h2", { className: "text-xl font-semibold text-purple-200", children: "\u30AB\u30FC\u30C9\u3068\u306E\u5BFE\u8A71" }), _jsxs("button", { onClick: () => setShowChat(false), className: "text-purple-200 hover:text-purple-100 transition-colors", children: [_jsx("span", { className: "sr-only", children: "\u9589\u3058\u308B" }), _jsx("svg", { className: "w-6 h-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })] })] }), _jsxs("div", { ref: chatMessagesRef, className: "p-6 max-h-[50vh] overflow-y-auto space-y-4", children: [chatMessages.map((message, index) => (_jsx("div", { className: classNames('p-4 rounded-lg max-w-[80%]', message.role === 'user'
                                                                ? 'bg-purple-500/20 ml-auto'
                                                                : 'bg-purple-900/30 mr-auto'), children: _jsx("p", { className: "text-purple-100 leading-relaxed whitespace-pre-wrap", children: message.content }) }, index))), isChatLoading && (_jsx("div", { className: "bg-purple-900/30 p-4 rounded-lg mr-auto max-w-[80%]", children: _jsx("p", { className: "text-purple-300", children: "\u30BF\u30ED\u30C3\u30C8\u30AB\u30FC\u30C9\u304B\u3089\u8FD4\u7B54\u3092\u53D7\u3051\u53D6\u3063\u3066\u3044\u307E\u3059..." }) }))] }), _jsx("div", { className: "p-6 border-t border-purple-500/20", children: _jsxs("div", { className: "flex gap-3", children: [_jsx("input", { ref: chatInputRef, type: "text", value: chatInput, onChange: (e) => setChatInput(e.target.value), onKeyPress: (e) => {
                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                        e.preventDefault();
                                                                        handleSendMessage(chatInput);
                                                                    }
                                                                }, placeholder: "\u30AB\u30FC\u30C9\u306B\u3064\u3044\u3066\u8CEA\u554F\u3057\u3066\u304F\u3060\u3055\u3044...", className: classNames("flex-1 p-3 rounded-lg", "bg-purple-900/30 border border-purple-500/30", "text-purple-100 placeholder-purple-400", "focus:ring-2 focus:ring-purple-400 focus:border-transparent") }), _jsx("button", { onClick: (e) => {
                                                                    e.preventDefault();
                                                                    handleSendMessage(chatInput);
                                                                }, disabled: isChatLoading || !chatInput.trim(), className: classNames("px-6 py-3 rounded-lg transition-colors", "bg-purple-500/20 hover:bg-purple-500/30", "disabled:bg-purple-600/10 disabled:cursor-not-allowed", "text-purple-200"), children: "\u9001\u4FE1" })] }) })] }) }) })] })) })] })] }));
}
