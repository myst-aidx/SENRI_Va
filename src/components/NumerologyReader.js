import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { generateNumerologyReading } from '../utils/numerology';
import LoadingSpinner from './LoadingSpinner';
// アニメーション設定
const animations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
};
// 入力フォームコンポーネント
const InputForm = React.memo(({ onSubmit, isLoading }) => {
    const [birthDate, setBirthDate] = useState('');
    const [name, setName] = useState('');
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit({ birthDate, name: name || undefined });
    }, [birthDate, name, onSubmit]);
    return (_jsxs(motion.form, { role: "form", "aria-label": "\u6570\u79D8\u8853\u89E3\u6790\u30D5\u30A9\u30FC\u30E0", onSubmit: handleSubmit, className: "space-y-4 sm:space-y-6", ...animations, children: [_jsxs("div", { role: "group", "aria-labelledby": "birthdate-label", children: [_jsxs("label", { id: "birthdate-label", className: "block text-sm sm:text-base font-medium text-purple-200 mb-1 sm:mb-2", children: ["\u751F\u5E74\u6708\u65E5", _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }), _jsx("input", { type: "date", value: birthDate, onChange: (e) => setBirthDate(e.target.value), required: true, "aria-required": "true", className: "mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-purple-900/50 border border-purple-700/50 text-purple-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), _jsxs("div", { role: "group", "aria-labelledby": "name-label", children: [_jsx("label", { id: "name-label", className: "block text-sm sm:text-base font-medium text-purple-200 mb-1 sm:mb-2", children: "\u540D\u524D\uFF08\u30AA\u30D7\u30B7\u30E7\u30F3\uFF09" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "\u6F22\u5B57\u3001\u3072\u3089\u304C\u306A\u3001\u30AB\u30BF\u30AB\u30CA\u3001\u82F1\u5B57", className: "mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-purple-900/50 border border-purple-700/50 text-purple-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), _jsx("button", { type: "submit", disabled: isLoading, "aria-busy": isLoading, className: "w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm sm:text-base hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50", children: isLoading ? '解析中...' : '解析する' })] }));
});
// 結果表示コンポーネント
const ReadingResult = React.memo(({ reading, onSave, onFeedback }) => {
    return (_jsxs(motion.div, { role: "article", "aria-label": "\u6570\u79D8\u8853\u89E3\u6790\u7D50\u679C", className: "space-y-4 sm:space-y-6", ...animations, children: [_jsxs("div", { className: "bg-purple-900/30 p-4 sm:p-6 rounded-lg border border-purple-700/50", children: [_jsx("h2", { className: "text-lg sm:text-xl font-bold text-purple-100 mb-3 sm:mb-4", children: "\u89E3\u6790\u7D50\u679C" }), _jsx("p", { className: "whitespace-pre-wrap text-sm sm:text-base text-purple-200", children: reading.reading }), _jsxs("div", { className: "mt-4 sm:mt-6 space-y-2 sm:space-y-3", children: [_jsxs("p", { className: "text-sm sm:text-base text-purple-100", children: [_jsx("span", { className: "font-medium", children: "\u904B\u547D\u6570: " }), reading.destinyNumber] }), reading.nameNumber && (_jsxs("p", { className: "text-sm sm:text-base text-purple-100", children: [_jsx("span", { className: "font-medium", children: "\u8868\u73FE\u6570: " }), reading.nameNumber] }))] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-4", children: [onSave && (_jsx("button", { onClick: () => onSave(reading), className: "w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg text-sm sm:text-base hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500", children: "\u7D50\u679C\u3092\u4FDD\u5B58" })), onFeedback && (_jsxs("div", { role: "group", "aria-label": "\u30D5\u30A3\u30FC\u30C9\u30D0\u30C3\u30AF", className: "w-full sm:w-auto flex gap-2 sm:gap-4", children: [_jsx("button", { onClick: () => onFeedback('POSITIVE'), className: "flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg text-sm sm:text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500", "aria-label": "\u826F\u3044\u7D50\u679C\u3067\u3057\u305F", children: "\uD83D\uDC4D \u826F\u3044" }), _jsx("button", { onClick: () => onFeedback('NEGATIVE'), className: "flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg text-sm sm:text-base hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500", "aria-label": "\u6539\u5584\u304C\u5FC5\u8981\u3067\u3059", children: "\uD83D\uDC4E \u6539\u5584\u304C\u5FC5\u8981" })] }))] })] }));
});
// メインコンポーネント
export function NumerologyReader({ onSave, onFeedback }) {
    const navigate = useNavigate();
    const [reading, setReading] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = useCallback(async (params) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateNumerologyReading(params);
            setReading(result);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    return (_jsxs("div", { className: "max-w-2xl mx-auto p-4 sm:p-6 lg:p-8", children: [_jsx(AnimatePresence, { children: isLoading && (_jsx(LoadingSpinner, { message: "\u6570\u79D8\u8853\u3067\u904B\u547D\u3092\u8AAD\u307F\u89E3\u3044\u3066\u3044\u307E\u3059..." })) }), _jsxs("div", { className: "flex justify-between items-center mb-4 sm:mb-6 lg:mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 text-center flex-grow", children: "\u6570\u79D8\u8853\u3067\u904B\u547D\u3092\u8AAD\u307F\u89E3\u304F" }), _jsx("button", { onClick: () => navigate('/fortune'), className: "px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500", children: "\u5360\u3044\u9078\u629E\u306B\u623B\u308B" })] }), _jsxs(AnimatePresence, { mode: "wait", children: [error && (_jsx(motion.div, { role: "alert", className: "bg-red-500/10 border border-red-500/50 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base", ...animations, children: error })), !reading ? (_jsx(InputForm, { onSubmit: handleSubmit, isLoading: isLoading })) : (_jsx(ReadingResult, { reading: reading, onSave: onSave, onFeedback: onFeedback }))] })] }));
}
