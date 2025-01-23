import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateFortune } from '../utils/fortune';
import { getReadings } from '../utils/storage';
const periodOptions = [
    { value: 'daily', label: '今日の運勢' },
    { value: 'weekly', label: '今週の運勢' },
    { value: 'monthly', label: '今月の運勢' },
    { value: 'yearly', label: '今年の運勢' }
];
const aspectNames = {
    general: '総合運',
    love: '恋愛運',
    work: '仕事運',
    health: '健康運',
    money: '金運'
};
export function FortuneUpdater({ onSave, onFeedback }) {
    const [selectedPeriod, setSelectedPeriod] = useState('daily');
    const [selectedReading, setSelectedReading] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    // 保存された数秘術の結果を取得
    const savedReadings = getReadings().filter((reading) => reading.type === 'numerology');
    // 運勢を更新
    const handleUpdate = useCallback(async () => {
        if (!selectedReading) {
            setError('数秘術の結果を選択してください');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await updateFortune(selectedReading, selectedPeriod);
            setResult(result);
            setShowFeedback(true);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'まだ更新の必要はありません') {
                setError('この期間の運勢はまだ更新の必要がありません');
            }
            else {
                setError('運勢の更新中にエラーが発生しました');
                console.error('運勢更新エラー:', error);
            }
        }
        finally {
            setIsLoading(false);
        }
    }, [selectedReading, selectedPeriod]);
    // 結果を保存
    const handleSave = useCallback(() => {
        if (result && onSave) {
            onSave({
                type: 'fortune',
                reading: Object.entries(result.aspects)
                    .map(([key, value]) => `${aspectNames[key]}: ${value}`)
                    .join('\n\n'),
                timestamp: result.timestamp,
                period: result.period,
                aspects: result.aspects,
                luckyItems: result.luckyItems
            });
        }
    }, [result, onSave]);
    return (_jsxs("div", { className: "space-y-6", role: "main", "aria-label": "\u904B\u52E2\u66F4\u65B0", children: [_jsxs("div", { className: "space-y-4", role: "form", "aria-label": "\u904B\u52E2\u66F4\u65B0\u30D5\u30A9\u30FC\u30E0", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "period", className: "block text-sm font-medium", children: "\u671F\u9593" }), _jsx("select", { id: "period", value: selectedPeriod, onChange: (e) => setSelectedPeriod(e.target.value), className: "w-full p-2 border rounded", "aria-required": "true", children: periodOptions.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "reading", className: "block text-sm font-medium", children: "\u6570\u79D8\u8853\u306E\u7D50\u679C" }), _jsxs("select", { id: "reading", value: selectedReading?.timestamp || '', onChange: (e) => {
                                    const reading = savedReadings.find((r) => r.timestamp === e.target.value);
                                    setSelectedReading(reading || null);
                                }, className: "w-full p-2 border rounded", "aria-required": "true", children: [_jsx("option", { value: "", children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), savedReadings.map((reading) => (_jsxs("option", { value: reading.timestamp, children: [new Date(reading.timestamp).toLocaleString(), " - \u904B\u547D\u6570: ", reading.destinyNumber] }, reading.timestamp)))] })] }), _jsx("button", { onClick: handleUpdate, disabled: isLoading, className: "w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50", "aria-busy": isLoading, children: isLoading ? '更新中...' : '運勢を更新する' }), _jsx(AnimatePresence, { children: error && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "p-2 text-red-600 bg-red-50 rounded", role: "alert", children: error })) })] }), _jsx(AnimatePresence, { children: result && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, className: "space-y-4 p-4 bg-white rounded shadow", children: [_jsx("h3", { className: "text-lg font-medium", children: "\u904B\u52E2" }), Object.entries(result.aspects).map(([key, value]) => (_jsxs("div", { className: "space-y-1", children: [_jsx("h4", { className: "font-medium", children: aspectNames[key] }), _jsx("p", { className: "text-gray-600", children: value })] }, key))), _jsxs("div", { className: "mt-4 p-4 bg-gray-50 rounded", children: [_jsx("h4", { className: "font-medium", children: "\u30E9\u30C3\u30AD\u30FC\u30A2\u30A4\u30C6\u30E0" }), _jsxs("ul", { className: "mt-2 space-y-1 text-gray-600", children: [_jsxs("li", { children: ["\u30AB\u30E9\u30FC: ", result.luckyItems.color] }), _jsxs("li", { children: ["\u30CA\u30F3\u30D0\u30FC: ", result.luckyItems.number] }), _jsxs("li", { children: ["\u65B9\u89D2: ", result.luckyItems.direction] })] })] }), onSave && (_jsx("button", { onClick: handleSave, className: "w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700", children: "\u7D50\u679C\u3092\u4FDD\u5B58" })), showFeedback && onFeedback && (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm text-center", children: "\u3053\u306E\u7D50\u679C\u306F\u53C2\u8003\u306B\u306A\u308A\u307E\u3057\u305F\u304B\uFF1F" }), _jsxs("div", { className: "flex justify-center space-x-4", children: [_jsx("button", { onClick: () => {
                                                onFeedback('POSITIVE');
                                                setShowFeedback(false);
                                            }, className: "py-1 px-3 bg-blue-100 text-blue-600 rounded hover:bg-blue-200", "aria-label": "\u306F\u3044\u3001\u53C2\u8003\u306B\u306A\u308A\u307E\u3057\u305F", children: "\uD83D\uDC4D \u306F\u3044" }), _jsx("button", { onClick: () => {
                                                onFeedback('NEGATIVE');
                                                setShowFeedback(false);
                                            }, className: "py-1 px-3 bg-gray-100 text-gray-600 rounded hover:bg-gray-200", "aria-label": "\u3044\u3044\u3048\u3001\u53C2\u8003\u306B\u306A\u308A\u307E\u305B\u3093\u3067\u3057\u305F", children: "\uD83D\uDC4E \u3044\u3044\u3048" })] })] }))] })) })] }));
}
