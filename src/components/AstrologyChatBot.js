import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot } from 'lucide-react';
import { usePersonalInfo } from '../contexts/PersonalInfoContext';
import { getOpenAIResponse } from '../utils/openai';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
const SUGGESTIONS = [
    "今日の運勢を教えて",
    "恋愛運が知りたいです",
    "仕事でのアドバイスをください",
    "金運アップの方法は？",
    "健康運はどうですか？",
    "いつが転機となりそう？",
];
export default function AstrologyChatBot() {
    const { personalInfo } = usePersonalInfo();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [chatContext, setChatContext] = useState({
        consecutiveQuestions: 0,
    });
    const messagesEndRef = useRef(null);
    // チャットの初期メッセージを設定
    useEffect(() => {
        if (messages.length === 0 && personalInfo) {
            const initialMessage = {
                id: 1,
                content: `こんにちは、${personalInfo.name}さん！\n${personalInfo.zodiacSign}の視点から、あなたの運勢についてお話しできることを嬉しく思います。\n\n気になることについて、お気軽にお尋ねください。`,
                sender: 'bot',
                type: 'text',
                timestamp: new Date(),
                metadata: {
                    suggestions: [...SUGGESTIONS],
                },
            };
            setMessages([initialMessage]);
        }
    }, [personalInfo]);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const analyzeSuggestions = (userInput) => {
        const suggestions = [];
        if (userInput.includes('恋愛')) {
            suggestions.push("恋愛運が知りたいです", "いつが転機となりそう？");
        }
        else if (userInput.includes('仕事')) {
            suggestions.push("仕事でのアドバイスをください", "いつが転機となりそう？");
        }
        else if (userInput.includes('金運')) {
            suggestions.push("金運アップの方法は？", "今日の運勢を教えて");
        }
        else {
            suggestions.push("今日の運勢を教えて", "健康運はどうですか？", "いつが転機となりそう？");
        }
        return suggestions;
    };
    const handleSend = async () => {
        if (!input.trim() || isLoading)
            return;
        const now = new Date(); // 現在の時刻を取得
        const userMessage = {
            id: Date.now(),
            content: input,
            sender: 'user',
            type: 'text',
            timestamp: now,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setShowSuggestions(false);
        try {
            const conversationHistory = messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                content: msg.content,
            }));
            // personalInfoを渡して応答を生成
            const response = await getOpenAIResponse(input, conversationHistory, now);
            const newSuggestions = analyzeSuggestions(input);
            const botMessage = {
                id: Date.now() + 1,
                content: response,
                sender: 'bot',
                type: 'fortune',
                timestamp: new Date(),
                metadata: {
                    suggestions: newSuggestions,
                },
            };
            setMessages(prev => [...prev, botMessage]);
            setChatContext(prev => ({
                ...prev,
                lastQuestion: input,
                consecutiveQuestions: prev.consecutiveQuestions + 1,
            }));
        }
        catch (error) {
            console.error('Error generating response:', error);
            const errorMessage = {
                id: Date.now() + 1,
                content: '申し訳ありません。一時的な問題が発生しました。もう一度お試しください。',
                sender: 'bot',
                type: 'text',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        }
        finally {
            setIsLoading(false);
            setTimeout(() => setShowSuggestions(true), 1000);
        }
    };
    return (_jsxs("div", { className: "relative max-w-4xl mx-auto p-4 sm:p-6 lg:p-8", children: [_jsx(AnimatePresence, { children: isLoading && (_jsx(LoadingSpinner, { message: "\u661F\u3005\u306E\u5C0E\u304D\u3092\u53D7\u3051\u3066\u3044\u307E\u3059..." })) }), _jsxs("div", { className: "flex justify-between items-center mb-4 sm:mb-6 lg:mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 text-center flex-grow", children: "AI\u3068\u5BFE\u8A71\u3057\u306A\u304C\u3089\u661F\u5360\u3044" }), _jsx("button", { onClick: () => navigate('/fortune'), className: "px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500", children: "\u5360\u3044\u9078\u629E\u306B\u623B\u308B" })] }), _jsx("div", { className: "flex flex-col", children: _jsxs("div", { className: "h-[600px] flex flex-col", children: [_jsxs("div", { className: "flex-1 overflow-y-auto mb-4 space-y-4 pr-2", children: [_jsx(AnimatePresence, { children: messages.map((message) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: `flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`, children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user'
                                                    ? 'bg-purple-500'
                                                    : 'bg-indigo-600'}`, children: message.sender === 'user' ? (_jsx(User, { size: 16, className: "text-white" })) : (_jsx(Bot, { size: 16, className: "text-white" })) }), _jsxs("div", { className: "space-y-2 max-w-[80%]", children: [_jsx("div", { className: `rounded-2xl px-4 py-2 ${message.sender === 'user'
                                                            ? 'bg-purple-500 text-white'
                                                            : 'bg-indigo-600/50 text-purple-50'}`, children: _jsx("p", { className: "whitespace-pre-wrap", children: message.content }) }), message.sender === 'bot' && message.metadata?.suggestions && showSuggestions && (_jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: message.metadata.suggestions.map((suggestion, index) => (_jsx("button", { onClick: () => setInput(suggestion), className: "text-sm px-3 py-1 rounded-full bg-purple-900/30 text-purple-200 hover:bg-purple-800/30 transition-colors", children: suggestion }, index))) }))] })] }, message.id))) }), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "relative mt-4", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), placeholder: "\u904B\u52E2\u3084\u6C17\u306B\u306A\u308B\u3053\u3068\u3092\u805E\u3044\u3066\u304F\u3060\u3055\u3044...", className: "w-full bg-purple-900/30 text-purple-100 placeholder-purple-300/50 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500", disabled: isLoading }), _jsx("button", { onClick: handleSend, disabled: isLoading || !input.trim(), className: `absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${isLoading || !input.trim()
                                        ? 'bg-purple-800/50 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-500'}`, children: _jsx(Send, { size: 18, className: "text-white" }) })] })] }) })] }));
}
