import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, History } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { generateAIInterpretation } from '../utils/fourPillarsAI';
// 十干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 十二支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 五行
const FIVE_ELEMENTS = ['木', '火', '土', '金', '水'];
// 十二運
const TWELVE_STAGES = ['長生', '沐浴', '冠帶', '臨官', '帝旺', '衰', '病', '死', '墓', '絕', '胎', '養'];
// 時刻文字列をTime型に変換
const parseTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    return { hour, minute };
};
// 四柱推命の計算ロジック
const calculateFourPillars = (birthDate, time) => {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    // 時刻を小数点に変換（例: 13:30 → 13.5）
    const hourDecimal = time.hour + time.minute / 60;
    // 年柱の計算
    const yearStemIndex = (year - 4) % 10;
    const yearBranchIndex = (year - 4) % 12;
    // 月柱の計算（簡略化）
    const monthStemIndex = (yearStemIndex * 2 + month) % 10;
    const monthBranchIndex = (month + 2) % 12;
    // 日柱の計算（簡略化）
    const dayStemIndex = (year * 5 + Math.floor(year / 4) + day - 7) % 10;
    const dayBranchIndex = (day * 12) % 12;
    // 時柱の計算（小数点を考慮）
    const hourStemIndex = (dayStemIndex * 2 + Math.floor(hourDecimal / 2)) % 10;
    const hourBranchIndex = Math.floor(hourDecimal / 2) % 12;
    return {
        year: {
            stem: HEAVENLY_STEMS[yearStemIndex],
            branch: EARTHLY_BRANCHES[yearBranchIndex],
        },
        month: {
            stem: HEAVENLY_STEMS[monthStemIndex],
            branch: EARTHLY_BRANCHES[monthBranchIndex],
        },
        day: {
            stem: HEAVENLY_STEMS[dayStemIndex],
            branch: EARTHLY_BRANCHES[dayBranchIndex],
        },
        hour: {
            stem: HEAVENLY_STEMS[hourStemIndex],
            branch: EARTHLY_BRANCHES[hourBranchIndex],
        },
    };
};
// 五行の相性を判定
const getMainElement = (fourPillars) => {
    const stemIndex = HEAVENLY_STEMS.indexOf(fourPillars.day.stem);
    return FIVE_ELEMENTS[Math.floor(stemIndex / 2)];
};
// 運勢の段階を判定
const getLifeStage = (fourPillars) => {
    const randomIndex = Math.floor(Math.random() * TWELVE_STAGES.length);
    return TWELVE_STAGES[randomIndex];
};
// 時刻オプションを生成（5分単位）
const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            options.push(timeStr);
        }
    }
    return options;
};
export default function FourPillarsReader() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [reading, setReading] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const date = new Date(birthDate);
            const time = parseTime(birthTime);
            if (isNaN(date.getTime()) || !birthTime) {
                throw new Error('生年月日と時刻を正しく入力してください。');
            }
            const fourPillars = calculateFourPillars(date, time);
            const mainElement = getMainElement(fourPillars);
            const lifeStage = getLifeStage(fourPillars);
            // AI解釈を生成
            const aiInterpretation = await generateAIInterpretation({
                ...fourPillars,
                mainElement,
                lifeStage,
            });
            setReading({
                fourPillars,
                mainElement,
                lifeStage,
                interpretation: aiInterpretation,
            });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
        }
        finally {
            setIsLoading(false);
        }
    }, [birthDate, birthTime]);
    const timeOptions = generateTimeOptions();
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-purple-100", children: [_jsx("nav", { className: "p-4 bg-purple-900/50", children: _jsxs("div", { className: "max-w-4xl mx-auto flex justify-between items-center", children: [_jsxs("button", { onClick: () => navigate('/fortune'), className: "flex items-center space-x-2 text-purple-200 hover:text-purple-100", children: [_jsx(Home, { size: 24 }), _jsx("span", { children: "\u30DB\u30FC\u30E0" })] }), _jsxs("button", { onClick: () => navigate('/history'), className: "flex items-center space-x-2 text-purple-200 hover:text-purple-100", children: [_jsx(History, { size: 24 }), _jsx("span", { children: "\u5C65\u6B74" })] })] }) }), _jsx("main", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-4 sm:mb-6 lg:mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 text-center flex-grow", children: "\u56DB\u67F1\u63A8\u547D" }), _jsx("button", { onClick: () => navigate('/fortune'), className: "px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500", children: "\u5360\u3044\u9078\u629E\u306B\u623B\u308B" })] }), _jsxs(motion.form, { onSubmit: handleSubmit, className: "space-y-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [error && (_jsx("div", { className: "bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4", children: error })), _jsxs("div", { className: "p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg", children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "birthDate", className: "block text-sm font-medium mb-2", children: "\u751F\u5E74\u6708\u65E5" }), _jsx("input", { type: "date", id: "birthDate", value: birthDate, onChange: (e) => setBirthDate(e.target.value), className: "w-full p-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "\u751F\u307E\u308C\u305F\u6642\u523B\uFF085\u5206\u5358\u4F4D\uFF09" }), _jsxs("select", { value: birthTime, onChange: (e) => setBirthTime(e.target.value), required: true, className: "mt-1 block w-full px-3 py-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100", children: [_jsx("option", { value: "", children: "\u6642\u523B\u3092\u9078\u629E" }), timeOptions.map((time) => (_jsx("option", { value: time, children: time }, time)))] })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50", children: "\u9451\u5B9A\u3059\u308B" })] }), isLoading && (_jsx(LoadingSpinner, { message: "\u56DB\u67F1\u63A8\u547D\u3067\u904B\u547D\u3092\u8AAD\u307F\u89E3\u3044\u3066\u3044\u307E\u3059..." })), reading && !isLoading && (_jsxs(motion.div, { className: "p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "\u56DB\u67F1" }), _jsxs("div", { className: "grid grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-medium mb-2", children: "\u5E74\u67F1" }), _jsxs("p", { className: "text-2xl", children: [reading.fourPillars.year.stem, reading.fourPillars.year.branch] })] }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-medium mb-2", children: "\u6708\u67F1" }), _jsxs("p", { className: "text-2xl", children: [reading.fourPillars.month.stem, reading.fourPillars.month.branch] })] }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-medium mb-2", children: "\u65E5\u67F1" }), _jsxs("p", { className: "text-2xl", children: [reading.fourPillars.day.stem, reading.fourPillars.day.branch] })] }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-medium mb-2", children: "\u6642\u67F1" }), _jsxs("p", { className: "text-2xl", children: [reading.fourPillars.hour.stem, reading.fourPillars.hour.branch] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-medium mb-2", children: "\u4E3B\u305F\u308B\u4E94\u884C" }), _jsx("p", { className: "text-2xl", children: reading.mainElement })] }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-medium mb-2", children: "\u73FE\u5728\u306E\u904B\u52E2\u6BB5\u968E" }), _jsx("p", { className: "text-2xl", children: reading.lifeStage })] })] }), _jsx("h2", { className: "text-xl font-semibold mb-4", children: "AI\u5360\u3044\u5E2B\u306B\u3088\u308B\u8A73\u7D30\u306A\u89E3\u91C8" }), _jsx("div", { className: "prose prose-invert max-w-none", children: _jsx("pre", { className: "whitespace-pre-wrap text-purple-100", children: reading.interpretation }) })] }))] })] }) })] }));
}
