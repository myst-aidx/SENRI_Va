import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getReadings, deleteReading } from '../utils/storage';
// アニメーション設定
const animations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
};
// 日付をフォーマット
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
// 占いの種類を日本語に変換
function getFortuneTypeName(type) {
    const typeNames = {
        numerology: '数秘術',
        tarot: 'タロット',
        palmistry: '手相',
        dream: '夢占い',
        compatibility: '相性診断',
        fortune: '運勢'
    };
    return typeNames[type];
}
export function ReadingHistory({ onSelect }) {
    const [readings, setReadings] = useState([]);
    const [selectedType, setSelectedType] = useState('all');
    const [isDeleting, setIsDeleting] = useState(false);
    // 履歴を読み込み
    const loadReadings = useCallback(() => {
        const stored = getReadings();
        setReadings(stored);
    }, []);
    // 初回読み込み
    useEffect(() => {
        loadReadings();
    }, [loadReadings]);
    // 結果を削除
    const handleDelete = useCallback(async (timestamp) => {
        if (!window.confirm('この結果を削除してもよろしいですか？'))
            return;
        setIsDeleting(true);
        try {
            deleteReading(timestamp);
            loadReadings();
        }
        catch (error) {
            console.error('削除に失敗しました:', error);
            alert('削除に失敗しました');
        }
        finally {
            setIsDeleting(false);
        }
    }, [loadReadings]);
    // 表示する結果をフィルタリング
    const filteredReadings = selectedType === 'all'
        ? readings
        : readings.filter(reading => reading.type === selectedType);
    return (_jsxs("div", { className: "max-w-2xl mx-auto p-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "\u5C65\u6B74" }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "\u5360\u3044\u306E\u7A2E\u985E\u3067\u30D5\u30A3\u30EB\u30BF" }), _jsxs("select", { value: selectedType, onChange: (e) => setSelectedType(e.target.value), className: "block w-full rounded-md border-gray-300 shadow-sm", children: [_jsx("option", { value: "all", children: "\u3059\u3079\u3066" }), _jsx("option", { value: "numerology", children: "\u6570\u79D8\u8853" }), _jsx("option", { value: "tarot", children: "\u30BF\u30ED\u30C3\u30C8" }), _jsx("option", { value: "palmistry", children: "\u624B\u76F8" }), _jsx("option", { value: "dream", children: "\u5922\u5360\u3044" })] })] }), _jsx(AnimatePresence, { mode: "wait", children: filteredReadings.length === 0 ? (_jsx(motion.p, { className: "text-gray-500 text-center py-8", ...animations, children: "\u5C65\u6B74\u304C\u3042\u308A\u307E\u305B\u3093" })) : (_jsx(motion.div, { className: "space-y-4", ...animations, children: filteredReadings.map((reading) => (_jsxs(motion.div, { className: "bg-white p-6 rounded-lg shadow-lg", layout: true, ...animations, children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("span", { className: "inline-block px-2 py-1 text-sm bg-indigo-100 text-indigo-800 rounded", children: getFortuneTypeName(reading.type) }), _jsx("time", { className: "block text-sm text-gray-500 mt-1", children: formatDate(reading.timestamp) })] }), _jsxs("div", { className: "space-x-2", children: [onSelect && (_jsx("button", { onClick: () => onSelect(reading), className: "text-blue-600 hover:text-blue-800", disabled: isDeleting, children: "\u8A73\u7D30" })), _jsx("button", { onClick: () => handleDelete(reading.timestamp), className: "text-red-600 hover:text-red-800", disabled: isDeleting, children: "\u524A\u9664" })] })] }), _jsx("div", { className: "prose max-w-none", children: _jsx("p", { className: "line-clamp-3", children: reading.reading }) }), 'destinyNumber' in reading && (_jsxs("div", { className: "mt-4 text-sm text-gray-600", children: [_jsxs("p", { children: ["\u904B\u547D\u6570: ", reading.destinyNumber] }), reading.nameNumber && (_jsxs("p", { children: ["\u8868\u73FE\u6570: ", reading.nameNumber] }))] }))] }, reading.timestamp))) })) })] }));
}
