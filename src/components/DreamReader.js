import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateDreamReading } from '../utils/dream';
import { useNavigate } from 'react-router-dom';
export default function DreamReader({ onSave, onFeedback }) {
    const navigate = useNavigate();
    const [dreamContent, setDreamContent] = useState('');
    const [reading, setReading] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!dreamContent.trim()) {
            setError('夢の内容を入力してください');
            return;
        }
        try {
            setError('');
            setIsLoading(true);
            // AI解釈の生成
            const result = await generateDreamReading(dreamContent);
            setReading(result);
        }
        catch (err) {
            setError('夢の解析中にエラーが発生しました。もう一度お試しください。');
            console.error('Dream reading error:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    // 結果の保存
    const handleSave = () => {
        if (reading && onSave) {
            onSave({
                type: 'dream',
                content: dreamContent,
                reading,
                timestamp: new Date().toISOString()
            });
        }
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-4 sm:mb-6 lg:mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 text-center flex-grow", children: "\u5922\u306E\u4E2D\u306E\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u89E3\u8AAD" }), _jsx("button", { onClick: () => navigate('/fortune'), className: "px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500", children: "\u5360\u3044\u9078\u629E\u306B\u623B\u308B" })] }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg", children: _jsx("p", { className: "text-red-400 text-center", children: error }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-purple-200 mb-2", children: ["\u5922\u306E\u5185\u5BB9", _jsx("span", { className: "text-purple-400 text-sm ml-2", children: "\u3067\u304D\u308B\u3060\u3051\u8A73\u3057\u304F\u8A18\u8FF0\u3057\u3066\u304F\u3060\u3055\u3044" })] }), _jsx("textarea", { value: dreamContent, onChange: (e) => setDreamContent(e.target.value), placeholder: "\u4F8B\uFF1A\u5927\u304D\u306A\u767D\u3044\u9CE5\u304C\u7A7A\u3092\u98DB\u3093\u3067\u3044\u3066\u3001\u79C1\u3082\u305D\u306E\u9CE5\u3068\u4E00\u7DD2\u306B\u98DB\u3093\u3067\u3044\u308B\u5922\u3092\u898B\u307E\u3057\u305F...", className: "w-full h-40 px-4 py-2 bg-purple-900/50 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? '解析中...' : '夢を解析する' })] }), reading && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mt-8 p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg", children: [_jsx("h3", { className: "text-xl text-purple-100 mb-4", children: "\u5922\u304B\u3089\u306E\u30E1\u30C3\u30BB\u30FC\u30B8" }), _jsx("div", { className: "prose prose-invert max-w-none", children: _jsx("pre", { className: "whitespace-pre-wrap text-purple-100", children: reading }) }), onSave && (_jsx("button", { onClick: handleSave, className: "mt-4 w-full py-2 bg-indigo-600/50 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500", children: "\u7D50\u679C\u3092\u4FDD\u5B58" }))] }))] }));
}
