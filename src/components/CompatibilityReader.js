import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeCompatibility } from '../utils/compatibility';
import { getReadings } from '../utils/storage';
const typeOptions = [
    { value: 'love', label: '恋愛' },
    { value: 'work', label: '仕事' },
    { value: 'friendship', label: '友情' }
];
export function CompatibilityReader({ onSave, onFeedback }) {
    const [selectedType, setSelectedType] = useState('love');
    const [selectedReading1, setSelectedReading1] = useState(null);
    const [selectedReading2, setSelectedReading2] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    // 保存された数秘術の結果を取得
    const savedReadings = getReadings().filter((reading) => reading.type === 'numerology');
    // 相性診断を実行
    const handleAnalyze = useCallback(async () => {
        if (!selectedReading1 || !selectedReading2) {
            setError('2つの数秘術の結果を選択してください');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await analyzeCompatibility(selectedReading1, selectedReading2, selectedType);
            setResult(result);
            setShowFeedback(true);
        }
        catch (error) {
            setError('相性診断の実行中にエラーが発生しました');
            console.error('相性診断エラー:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, [selectedReading1, selectedReading2, selectedType]);
    // 結果を保存
    const handleSave = useCallback(() => {
        if (result && onSave) {
            onSave({
                type: 'compatibility',
                reading: result.reading,
                timestamp: result.timestamp,
                compatibilityType: result.type,
                score: result.score
            });
        }
    }, [result, onSave]);
    return (_jsxs("div", { className: "space-y-6", role: "main", "aria-label": "\u76F8\u6027\u8A3A\u65AD", children: [_jsxs("div", { className: "space-y-4", role: "form", "aria-label": "\u76F8\u6027\u8A3A\u65AD\u30D5\u30A9\u30FC\u30E0", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "type", className: "block text-sm font-medium", children: "\u8A3A\u65AD\u30BF\u30A4\u30D7" }), _jsx("select", { id: "type", value: selectedType, onChange: (e) => setSelectedType(e.target.value), className: "w-full p-2 border rounded", "aria-required": "true", children: typeOptions.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "reading1", className: "block text-sm font-medium", children: "1\u4EBA\u76EE\u306E\u6570\u79D8\u8853\u7D50\u679C" }), _jsxs("select", { id: "reading1", value: selectedReading1?.timestamp || '', onChange: (e) => {
                                    const reading = savedReadings.find((r) => r.timestamp === e.target.value);
                                    setSelectedReading1(reading || null);
                                }, className: "w-full p-2 border rounded", "aria-required": "true", children: [_jsx("option", { value: "", children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), savedReadings.map((reading) => (_jsxs("option", { value: reading.timestamp, children: [new Date(reading.timestamp).toLocaleString(), " - \u904B\u547D\u6570: ", reading.destinyNumber] }, reading.timestamp)))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "reading2", className: "block text-sm font-medium", children: "2\u4EBA\u76EE\u306E\u6570\u79D8\u8853\u7D50\u679C" }), _jsxs("select", { id: "reading2", value: selectedReading2?.timestamp || '', onChange: (e) => {
                                    const reading = savedReadings.find((r) => r.timestamp === e.target.value);
                                    setSelectedReading2(reading || null);
                                }, className: "w-full p-2 border rounded", "aria-required": "true", children: [_jsx("option", { value: "", children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), savedReadings.map((reading) => (_jsxs("option", { value: reading.timestamp, children: [new Date(reading.timestamp).toLocaleString(), " - \u904B\u547D\u6570: ", reading.destinyNumber] }, reading.timestamp)))] })] }), _jsx("button", { onClick: handleAnalyze, disabled: isLoading, className: "w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50", "aria-busy": isLoading, children: isLoading ? '診断中...' : '相性を診断する' }), _jsx(AnimatePresence, { children: error && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "p-2 text-red-600 bg-red-50 rounded", role: "alert", children: error })) })] }), _jsx(AnimatePresence, { children: result && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, className: "space-y-4 p-4 bg-white rounded shadow", children: [_jsx("h3", { className: "text-lg font-medium", children: "\u8A3A\u65AD\u7D50\u679C" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-2xl font-bold text-center", children: ["\u76F8\u6027\u30B9\u30B3\u30A2: ", result.score, "\u70B9"] }), _jsx("div", { className: "whitespace-pre-wrap", children: result.reading })] }), onSave && (_jsx("button", { onClick: handleSave, className: "w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700", children: "\u7D50\u679C\u3092\u4FDD\u5B58" })), showFeedback && onFeedback && (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm text-center", children: "\u3053\u306E\u7D50\u679C\u306F\u53C2\u8003\u306B\u306A\u308A\u307E\u3057\u305F\u304B\uFF1F" }), _jsxs("div", { className: "flex justify-center space-x-4", children: [_jsx("button", { onClick: () => {
                                                onFeedback('POSITIVE');
                                                setShowFeedback(false);
                                            }, className: "py-1 px-3 bg-blue-100 text-blue-600 rounded hover:bg-blue-200", "aria-label": "\u306F\u3044\u3001\u53C2\u8003\u306B\u306A\u308A\u307E\u3057\u305F", children: "\uD83D\uDC4D \u306F\u3044" }), _jsx("button", { onClick: () => {
                                                onFeedback('NEGATIVE');
                                                setShowFeedback(false);
                                            }, className: "py-1 px-3 bg-gray-100 text-gray-600 rounded hover:bg-gray-200", "aria-label": "\u3044\u3044\u3048\u3001\u53C2\u8003\u306B\u306A\u308A\u307E\u305B\u3093\u3067\u3057\u305F", children: "\uD83D\uDC4E \u3044\u3044\u3048" })] })] }))] })) })] }));
}
