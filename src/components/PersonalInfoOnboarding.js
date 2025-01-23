import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star, Clock, User, Save } from 'lucide-react';
import { calculateZodiacSign } from '../utils/astrology';
export default function PersonalInfoOnboarding({ onComplete, onSkip, existingData }) {
    const [step, setStep] = useState(1);
    const [info, setInfo] = useState(existingData || {
        name: '',
        birthDate: '',
        birthTime: '',
        gender: '',
    });
    const [errors, setErrors] = useState({});
    const validateStep = (currentStep) => {
        const newErrors = {};
        switch (currentStep) {
            case 1:
                if (!info.name.trim()) {
                    newErrors.name = 'お名前を入力してください';
                }
                break;
            case 2:
                if (!info.birthDate) {
                    newErrors.birthDate = '生年月日を選択してください';
                }
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };
    const handleBack = () => {
        setStep(prev => prev - 1);
    };
    const handleComplete = () => {
        if (validateStep(step)) {
            const birthDate = new Date(info.birthDate);
            const zodiacSign = calculateZodiacSign(birthDate);
            onComplete({ ...info, zodiacSign });
        }
    };
    const steps = [
        {
            title: 'あなたのお名前',
            icon: _jsx(User, { className: "w-6 h-6" }),
            content: (_jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "text", placeholder: "\u304A\u540D\u524D\uFF08\u30CB\u30C3\u30AF\u30CD\u30FC\u30E0\u53EF\uFF09", value: info.name, onChange: e => setInfo({ ...info, name: e.target.value }), className: "w-full bg-purple-900/30 text-purple-100 placeholder-purple-300/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" }), errors.name && (_jsx("p", { className: "text-red-400 text-sm", children: errors.name }))] }))
        },
        {
            title: '生年月日',
            icon: _jsx(Star, { className: "w-6 h-6" }),
            content: (_jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "date", value: info.birthDate, onChange: e => setInfo({ ...info, birthDate: e.target.value }), className: "w-full bg-purple-900/30 text-purple-100 placeholder-purple-300/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" }), errors.birthDate && (_jsx("p", { className: "text-red-400 text-sm", children: errors.birthDate }))] }))
        },
        {
            title: '生まれた時間（任意）',
            icon: _jsx(Clock, { className: "w-6 h-6" }),
            content: (_jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "time", value: info.birthTime, onChange: e => setInfo({ ...info, birthTime: e.target.value }), className: "w-full bg-purple-900/30 text-purple-100 placeholder-purple-300/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" }), _jsx("p", { className: "text-purple-300 text-sm", children: "\u203B\u3088\u308A\u8A73\u7D30\u306A\u5360\u3044\u306E\u305F\u3081\u306B\u4F7F\u7528\u3055\u308C\u307E\u3059" })] }))
        },
        {
            title: '性別（任意）',
            icon: _jsx(User, { className: "w-6 h-6" }),
            content: (_jsx("div", { className: "space-y-4", children: _jsx("div", { className: "flex gap-4", children: ['male', 'female', 'other'].map((gender) => (_jsx("button", { onClick: () => setInfo({ ...info, gender: gender }), className: `flex-1 py-3 px-4 rounded-lg transition-colors ${info.gender === gender
                            ? 'bg-purple-500 text-white'
                            : 'bg-purple-900/30 text-purple-200 hover:bg-purple-800/30'}`, children: gender === 'male' ? '男性' : gender === 'female' ? '女性' : 'その他' }, gender))) }) }))
        }
    ];
    return (_jsxs("div", { className: "max-w-md mx-auto bg-purple-950/50 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-800/30 p-6", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-purple-100 mb-2", children: "\u30D1\u30FC\u30BD\u30CA\u30EB\u5360\u3044\u8A2D\u5B9A" }), _jsx("p", { className: "text-purple-300", children: "\u3088\u308A\u6B63\u78BA\u306A\u5360\u3044\u7D50\u679C\u306E\u305F\u3081\u306B\u3001\u3042\u306A\u305F\u306E\u60C5\u5831\u3092\u6559\u3048\u3066\u304F\u3060\u3055\u3044" })] }), _jsxs("div", { className: "relative", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 }, className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [steps[step - 1].icon, _jsx("h3", { className: "text-xl font-semibold text-purple-100", children: steps[step - 1].title })] }), steps[step - 1].content] }, step) }), _jsxs("div", { className: "mt-8 flex justify-between", children: [_jsxs("button", { onClick: step === 1 ? onSkip : handleBack, className: "px-4 py-2 text-purple-300 hover:text-purple-100 transition-colors flex items-center gap-2", children: [_jsx(ChevronLeft, { className: "w-4 h-4" }), step === 1 ? 'スキップ' : '戻る'] }), _jsx("button", { onClick: step === steps.length ? handleComplete : handleNext, className: "px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors flex items-center gap-2", children: step === steps.length ? (_jsxs(_Fragment, { children: [_jsx(Save, { className: "w-4 h-4" }), "\u5B8C\u4E86"] })) : (_jsxs(_Fragment, { children: ["\u6B21\u3078", _jsx(ChevronRight, { className: "w-4 h-4" })] })) })] })] }), _jsx("div", { className: "mt-6 flex justify-center gap-2", children: steps.map((_, i) => (_jsx("div", { className: `w-2 h-2 rounded-full transition-colors ${i + 1 === step ? 'bg-purple-500' : 'bg-purple-800'}` }, i))) })] }));
}
