import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, History, Upload } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { ROOM_POSITIONS, DIRECTIONS, generateRoomFengshuiInterpretation, generateFloorPlanFengshuiInterpretation, } from '../utils/fengshuiAI';
const FengshuiReader = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('room');
    const [selectedRoom, setSelectedRoom] = useState('リビング');
    const [selectedDirection, setSelectedDirection] = useState('北');
    const [mainDirection, setMainDirection] = useState('北');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [reading, setReading] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleImageChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB制限
                setError('画像サイズは10MB以下にしてください。');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    }, []);
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            if (mode === 'floorplan' && !image) {
                throw new Error('間取り図をアップロードしてください。');
            }
            let interpretation;
            if (mode === 'room') {
                interpretation = await generateRoomFengshuiInterpretation({
                    position: selectedRoom,
                    direction: selectedDirection,
                    imageUrl: imagePreview || undefined,
                });
            }
            else {
                if (!imagePreview) {
                    throw new Error('間取り図をアップロードしてください。');
                }
                interpretation = await generateFloorPlanFengshuiInterpretation({
                    imageUrl: imagePreview,
                    mainDirection: mainDirection,
                });
            }
            setReading({
                type: mode,
                interpretation,
                timestamp: new Date(),
            });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました。');
        }
        finally {
            setIsLoading(false);
        }
    }, [mode, selectedRoom, selectedDirection, mainDirection, image, imagePreview]);
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-purple-100", children: [_jsx("nav", { className: "p-4 bg-purple-900/50", children: _jsxs("div", { className: "max-w-4xl mx-auto flex justify-between items-center", children: [_jsxs("button", { onClick: () => navigate('/fortune'), className: "flex items-center space-x-2 text-purple-200 hover:text-purple-100", children: [_jsx(Home, { size: 24 }), _jsx("span", { children: "\u30DB\u30FC\u30E0" })] }), _jsxs("button", { onClick: () => navigate('/history'), className: "flex items-center space-x-2 text-purple-200 hover:text-purple-100", children: [_jsx(History, { size: 24 }), _jsx("span", { children: "\u5C65\u6B74" })] })] }) }), _jsx("main", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-4 sm:mb-6 lg:mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 text-center flex-grow", children: "\u98A8\u6C34\u5360\u3044" }), _jsx("button", { onClick: () => navigate('/fortune'), className: "px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500", children: "\u5360\u3044\u9078\u629E\u306B\u623B\u308B" })] }), _jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { onClick: () => setMode('room'), className: `flex-1 py-3 px-4 rounded-lg ${mode === 'room'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'}`, children: "\u90E8\u5C4B\u5225\u8A3A\u65AD" }), _jsx("button", { onClick: () => setMode('floorplan'), className: `flex-1 py-3 px-4 rounded-lg ${mode === 'floorplan'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'}`, children: "\u9593\u53D6\u308A\u8A3A\u65AD" })] }) }), _jsxs(motion.form, { onSubmit: handleSubmit, className: "space-y-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [error && (_jsx("div", { className: "bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4", children: error })), _jsxs("div", { className: "p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg", children: [mode === 'room' ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "\u90E8\u5C4B\u306E\u7A2E\u985E" }), _jsx("select", { value: selectedRoom, onChange: (e) => setSelectedRoom(e.target.value), className: "w-full p-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100", children: ROOM_POSITIONS.map((position) => (_jsx("option", { value: position, children: position }, position))) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "\u90E8\u5C4B\u306E\u65B9\u89D2" }), _jsx("select", { value: selectedDirection, onChange: (e) => setSelectedDirection(e.target.value), className: "w-full p-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100", children: DIRECTIONS.map((direction) => (_jsx("option", { value: direction, children: direction }, direction))) })] })] })) : (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "\u9593\u53D6\u308A\u306E\u4E3B\u8981\u306A\u65B9\u89D2" }), _jsx("select", { value: mainDirection, onChange: (e) => setMainDirection(e.target.value), className: "w-full p-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100", children: DIRECTIONS.map((direction) => (_jsx("option", { value: direction, children: direction }, direction))) })] })), _jsxs("div", { className: "mb-4", children: [_jsxs("label", { className: "block text-sm font-medium mb-2", children: [mode === 'room' ? '部屋の写真（任意）' : '間取り図', _jsx("span", { className: "text-purple-400 ml-2", children: mode === 'floorplan' && '（必須）' })] }), !imagePreview ? (_jsx("div", { className: "flex items-center justify-center w-full", children: _jsxs("label", { className: "flex flex-col items-center justify-center w-full h-64 border-2 border-purple-700/50 border-dashed rounded-lg cursor-pointer bg-purple-800/30 hover:bg-purple-800/50", children: [_jsxs("div", { className: "flex flex-col items-center justify-center pt-5 pb-6", children: [_jsx(Upload, { className: "w-8 h-8 mb-4 text-purple-500" }), _jsx("p", { className: "mb-2 text-sm text-purple-400", children: "\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u753B\u50CF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9" }), _jsx("p", { className: "text-xs text-purple-500", children: "PNG, JPG, JPEG (\u6700\u5927 10MB)" })] }), _jsx("input", { type: "file", className: "hidden", accept: "image/*", onChange: handleImageChange })] }) })) : (_jsxs("div", { className: "relative mt-4", children: [_jsx("img", { src: imagePreview, alt: "\u30D7\u30EC\u30D3\u30E5\u30FC", className: "max-w-full h-auto rounded-lg" }), _jsx("button", { type: "button", onClick: () => {
                                                                setImage(null);
                                                                setImagePreview('');
                                                            }, className: "absolute top-2 right-2 p-2 bg-purple-900/80 rounded-full hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })] }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: `w-full py-3 px-4 rounded-lg bg-purple-600 text-white font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500'}`, children: isLoading ? '解析中...' : '風水を診断する' })] })] }), _jsx(AnimatePresence, { mode: "wait", children: isLoading && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsx(LoadingSpinner, { message: mode === 'room' ? '部屋の気の流れを読み解いています...' : '間取り図から運気を分析しています...' }) })) }), _jsx(AnimatePresence, { children: reading && !isLoading && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "mt-8 p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "\u98A8\u6C34\u8A3A\u65AD\u7D50\u679C" }), _jsx("div", { className: "prose prose-purple prose-invert max-w-none", children: reading.interpretation.split('\n').map((paragraph, index) => (_jsx("p", { className: "mb-4 text-purple-200", children: paragraph }, index))) }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { onClick: () => {
                                                setReading(null);
                                                setImage(null);
                                                setImagePreview('');
                                            }, className: "px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500", children: "\u65B0\u3057\u3044\u8A3A\u65AD\u3092\u59CB\u3081\u308B" }) })] })) })] }) })] }));
};
export default FengshuiReader;
