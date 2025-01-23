import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shareReading, copyToClipboard } from '../utils/share';
const platforms = [
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'line', label: 'LINE', icon: '💬' },
    { value: 'facebook', label: 'Facebook', icon: '👍' }
];
export function ShareButtons({ reading, url, hashtags }) {
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const [error, setError] = useState(null);
    // シェアを実行
    const handleShare = useCallback((platform) => {
        try {
            shareReading(reading, { platform, url, hashtags });
        }
        catch (error) {
            setError('シェアに失敗しました');
            console.error('シェアエラー:', error);
        }
    }, [reading, url, hashtags]);
    // クリップボードにコピー
    const handleCopy = useCallback(async () => {
        try {
            await copyToClipboard(reading);
            setShowCopyMessage(true);
            setTimeout(() => setShowCopyMessage(false), 2000);
        }
        catch (error) {
            setError('コピーに失敗しました');
            console.error('コピーエラー:', error);
        }
    }, [reading]);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-center space-x-4", children: [platforms.map((platform) => (_jsxs("button", { onClick: () => handleShare(platform.value), className: "p-2 bg-white rounded shadow hover:bg-gray-50 transition-colors", "aria-label": `${platform.label}でシェア`, children: [_jsx("span", { className: "text-2xl", role: "img", "aria-hidden": "true", children: platform.icon }), _jsx("span", { className: "sr-only", children: platform.label })] }, platform.value))), _jsxs("button", { onClick: handleCopy, className: "p-2 bg-white rounded shadow hover:bg-gray-50 transition-colors", "aria-label": "\u30C6\u30AD\u30B9\u30C8\u3092\u30B3\u30D4\u30FC", children: [_jsx("span", { className: "text-2xl", role: "img", "aria-hidden": "true", children: "\uD83D\uDCCB" }), _jsx("span", { className: "sr-only", children: "\u30B3\u30D4\u30FC" })] })] }), _jsxs(AnimatePresence, { children: [showCopyMessage && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "text-center text-green-600", role: "status", "aria-live": "polite", children: "\u30C6\u30AD\u30B9\u30C8\u3092\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F\uFF01" })), error && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "text-center text-red-600", role: "alert", children: error }))] })] }));
}
