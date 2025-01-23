import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User as UserIcon, Bot } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { getGeminiResponse } from '../utils/ai/gemini';
export default function PersonalizedChatBot({ initialContext, onContextUpdate, fortuneType }) {
    const { user } = useAuth();
    const [state, setState] = useState({
        messages: [],
        context: {
            userId: user?.id || '',
            sessionId: crypto.randomUUID(),
            lastInteraction: new Date().toISOString(),
            fortuneHistory: [],
            preferences: {
                favoriteTypes: [],
                interestedAspects: [],
                language: 'ja'
            },
            ...initialContext
        },
        isLoading: false,
        error: null
    });
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState('');
    useEffect(() => {
        if (state.messages.length === 0 && user) {
            const welcomeMessage = {
                id: Date.now(),
                content: `こんにちは、${user?.displayName ?? user?.name ?? 'ゲスト'}さん！\n過去の占い結果を踏まえて、あなただけの運勢をお伝えします。`,
                sender: 'bot',
                timestamp: new Date().toISOString(),
                metadata: {
                    fortuneType,
                    suggestions: [
                        '今日の運勢を教えて',
                        '恋愛運について詳しく',
                        '仕事運のアドバイスが欲しい'
                    ]
                }
            };
            setState(prev => ({
                ...prev,
                messages: [welcomeMessage]
            }));
        }
    }, [user, fortuneType]);
    useEffect(() => {
        scrollToBottom();
    }, [state.messages]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const updateContext = useCallback((newContext) => {
        setState(prev => ({
            ...prev,
            context: {
                ...prev.context,
                ...newContext,
                lastInteraction: new Date().toISOString()
            }
        }));
        onContextUpdate?.({
            ...state.context,
            ...newContext,
            lastInteraction: new Date().toISOString()
        });
    }, [state.context, onContextUpdate]);
    const handleSend = async () => {
        if (!input.trim() || state.isLoading)
            return;
        const userMessage = {
            id: Date.now(),
            content: input,
            sender: 'user',
            timestamp: new Date().toISOString()
        };
        setState(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            isLoading: true,
            error: null
        }));
        setInput('');
        try {
            const systemPrompt = `
あなたは占い師として、ユーザーの過去の占い結果と対話履歴を踏まえて、パーソナライズされた占い結果を提供します。
以下の情報を考慮して回答を生成してください：

1. ユーザーの過去の占い結果: ${JSON.stringify(state.context.fortuneHistory)}
2. ユーザーの興味のある分野: ${JSON.stringify(state.context.preferences.interestedAspects)}
3. 好みの占いタイプ: ${JSON.stringify(state.context.preferences.favoriteTypes)}

回答は以下の要素を含めてください：
- 過去の結果との関連性
- 具体的なアドバイス
- 将来の展望
- 注意点や改善点
`;
            const response = await getGeminiResponse(systemPrompt, input, state.messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            })));
            if (response.error) {
                throw response.error;
            }
            const botMessage = {
                id: Date.now() + 1,
                content: response.content,
                sender: 'bot',
                timestamp: new Date().toISOString(),
                metadata: {
                    fortuneType,
                    suggestions: generateSuggestions(input, response.content)
                }
            };
            setState(prev => ({
                ...prev,
                messages: [...prev.messages, botMessage],
                isLoading: false
            }));
            // コンテキストの更新
            updateContext({
                fortuneHistory: [
                    ...state.context.fortuneHistory,
                    {
                        type: fortuneType || 'general',
                        result: response.content,
                        timestamp: new Date().toISOString()
                    }
                ]
            });
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : '予期せぬエラーが発生しました'
            }));
        }
    };
    const generateSuggestions = (userInput, aiResponse) => {
        const suggestions = [];
        if (userInput.includes('恋愛')) {
            suggestions.push('相性の良い相手について', 'ベストなタイミングは？', '恋愛運を上げるコツ');
        }
        else if (userInput.includes('仕事')) {
            suggestions.push('キャリアの転機について', 'チームワークを改善するには', '昇進のチャンス');
        }
        else if (userInput.includes('金運')) {
            suggestions.push('投資のタイミング', '金運アップの方法', '臨時収入の可能性');
        }
        else {
            suggestions.push('今週の運勢は？', '対人運について', '健康運のアドバイス');
        }
        return suggestions;
    };
    return (_jsx("div", { className: "w-full max-w-4xl mx-auto p-2 sm:p-4 md:p-6", children: _jsxs("div", { className: "h-[calc(100vh-8rem)] sm:h-[600px] flex flex-col bg-purple-950/20 rounded-xl p-2 sm:p-4", children: [_jsxs("div", { className: "flex-1 overflow-y-auto mb-2 sm:mb-4 space-y-2 sm:space-y-4", children: [_jsx(AnimatePresence, { children: state.messages.map((message) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: `flex items-start gap-2 sm:gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`, children: [_jsx("div", { className: `w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${message.sender === 'user'
                                            ? 'bg-purple-500'
                                            : 'bg-indigo-600'}`, children: message.sender === 'user' ? (_jsx(UserIcon, { size: 12, className: "sm:size-16 text-white" })) : (_jsx(Bot, { size: 12, className: "sm:size-16 text-white" })) }), _jsxs("div", { className: `max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-2 ${message.sender === 'user'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-indigo-600/50 text-purple-50'}`, children: [_jsx("div", { className: "whitespace-pre-wrap text-sm sm:text-base", children: message.content }), message.metadata?.suggestions && (_jsx("div", { className: "flex flex-wrap gap-1.5 sm:gap-2 mt-2", children: message.metadata.suggestions.map((suggestion, index) => (_jsx("button", { onClick: () => setInput(suggestion), className: "text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-purple-900/30 text-purple-200 hover:bg-purple-800/30 transition-colors", children: suggestion }, index))) }))] })] }, message.id))) }), state.isLoading && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex items-center gap-2 text-purple-300", children: [_jsxs("div", { className: "flex space-x-1", children: [_jsx("div", { className: "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce" }), _jsx("div", { className: "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce", style: { animationDelay: '0.2s' } }), _jsx("div", { className: "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce", style: { animationDelay: '0.4s' } })] }), _jsx("span", { className: "text-xs sm:text-sm", children: "\u5360\u3044\u306E\u795E\u8A17\u3092\u8AAD\u307F\u89E3\u3044\u3066\u3044\u307E\u3059..." })] })), state.error && (_jsx("div", { className: "text-xs sm:text-sm text-red-400 px-3 py-2 sm:px-4 sm:py-2 bg-red-900/20 rounded-lg", children: state.error })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), placeholder: "\u904B\u52E2\u3084\u6C17\u306B\u306A\u308B\u3053\u3068\u3092\u805E\u3044\u3066\u304F\u3060\u3055\u3044...", className: "w-full bg-purple-900/30 text-purple-100 placeholder-purple-300/50 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-10 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500", disabled: state.isLoading }), _jsx("button", { onClick: handleSend, disabled: state.isLoading, className: `absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-colors
              ${state.isLoading
                                ? 'bg-purple-500/50 cursor-not-allowed'
                                : 'bg-purple-500 hover:bg-purple-600'}`, children: _jsx(Send, { size: 12, className: "sm:size-16 text-white" }) })] })] }) }));
}
