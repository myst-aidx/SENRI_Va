import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { generatePalmReading } from '../utils/palm';
import { useNavigate } from 'react-router-dom';
export default function PalmReader({ onSave, onFeedback }) {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [reading, setReading] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        // 画像ファイルの検証
        if (!file.type.startsWith('image/')) {
            setError('画像ファイルを選択してください');
            return;
        }
        try {
            setError('');
            setIsLoading(true);
            // 画像のプレビュー用URL生成
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            // AI解釈の生成
            const result = await generatePalmReading(file);
            setReading(result);
        }
        catch (err) {
            setError('手相の解析中にエラーが発生しました。もう一度お試しください。');
            console.error('Palm reading error:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    // 結果の保存
    const handleSave = () => {
        if (reading && onSave) {
            onSave({
                type: 'palm',
                reading,
                timestamp: new Date().toISOString()
            });
        }
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-4 sm:mb-6 lg:mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 text-center flex-grow", children: "\u624B\u76F8\u304B\u3089\u904B\u547D\u3092\u8AAD\u307F\u89E3\u304F" }), _jsx("button", { onClick: () => navigate('/fortune'), className: "px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500", children: "\u5360\u3044\u9078\u629E\u306B\u623B\u308B" })] }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg", children: _jsx("p", { className: "text-red-400 text-center", children: error }) })), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden" }), _jsx("button", { onClick: () => fileInputRef.current?.click(), disabled: isLoading, className: "w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? '解析中...' : '手のひらの写真をアップロード' }), _jsx("p", { className: "mt-2 text-sm text-purple-300 text-center", children: "\u9BAE\u660E\u306A\u624B\u306E\u3072\u3089\u306E\u5199\u771F\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044" })] }), selectedImage && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mt-8", children: [_jsx("h3", { className: "text-xl text-purple-100 mb-4", children: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3055\u308C\u305F\u753B\u50CF" }), _jsx("div", { className: "relative aspect-square max-w-md mx-auto", children: _jsx("img", { src: selectedImage, alt: "\u624B\u306E\u3072\u3089\u306E\u5199\u771F", className: "w-full h-full object-cover rounded-lg" }) })] })), reading && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mt-8 p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg", children: [_jsx("h3", { className: "text-xl text-purple-100 mb-4", children: "\u624B\u76F8\u304B\u3089\u306E\u30E1\u30C3\u30BB\u30FC\u30B8" }), _jsx("div", { className: "prose prose-invert max-w-none", children: _jsx("pre", { className: "whitespace-pre-wrap text-purple-100", children: reading }) }), onSave && (_jsx("button", { onClick: handleSave, className: "mt-4 w-full py-2 bg-indigo-600/50 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500", children: "\u7D50\u679C\u3092\u4FDD\u5B58" }))] }))] })] }));
}
