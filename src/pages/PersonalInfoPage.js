import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/auth/useAuth';
import { toast } from 'react-toastify';
// デモプロフィールデータ
const DEMO_PROFILE = {
    name: 'テストユーザー',
    birthDate: '2000-01-01',
    birthTime: '12:00',
    birthPlace: '東京都',
    gender: '未設定',
    profileImage: null,
};
const ZODIAC_SIGNS = [
    { value: 'aries', label: '牡羊座' },
    { value: 'taurus', label: '牡牛座' },
    { value: 'gemini', label: '双子座' },
    { value: 'cancer', label: '蟹座' },
    { value: 'leo', label: '獅子座' },
    { value: 'virgo', label: '乙女座' },
    { value: 'libra', label: '天秤座' },
    { value: 'scorpio', label: '蠍座' },
    { value: 'sagittarius', label: '射手座' },
    { value: 'capricorn', label: '山羊座' },
    { value: 'aquarius', label: '水瓶座' },
    { value: 'pisces', label: '魚座' }
];
export default function PersonalInfoPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [personalInfo, setPersonalInfo] = useState(DEMO_PROFILE);
    const [imagePreview, setImagePreview] = useState(DEMO_PROFILE.profileImage || null);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    // デモデータの初期化
    useEffect(() => {
        console.log('Initializing demo data');
        setPersonalInfo(DEMO_PROFILE);
        setImagePreview(DEMO_PROFILE.profileImage || null);
    }, []);
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // 画像をリサイズ
                const resizedImage = await resizeImage(file, 800); // 最大幅800pxにリサイズ
                setImagePreview(resizedImage);
                setPersonalInfo((prev) => ({
                    ...prev,
                    profileImage: resizedImage
                }));
            }
            catch (err) {
                console.error('画像のアップロードに失敗しました:', err);
                setErrors({ image: err instanceof Error ? err.message : '画像のアップロードに失敗しました' });
            }
        }
    };
    // 画像リサイズ関数
    const resizeImage = (file, maxWidth) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7)); // JPEG形式で圧縮率0.7
                URL.revokeObjectURL(img.src);
            };
            img.onerror = () => {
                reject(new Error('画像の読み込みに失敗しました'));
                URL.revokeObjectURL(img.src);
            };
        });
    };
    const calculateZodiacSign = (birthDate) => {
        const date = new Date(birthDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        // 誕生日から星座を計算
        const zodiacRanges = [
            { sign: 'capricorn', start: [1, 1], end: [1, 19] },
            { sign: 'aquarius', start: [1, 20], end: [2, 18] },
            { sign: 'pisces', start: [2, 19], end: [3, 20] },
            { sign: 'aries', start: [3, 21], end: [4, 19] },
            { sign: 'taurus', start: [4, 20], end: [5, 20] },
            { sign: 'gemini', start: [5, 21], end: [6, 20] },
            { sign: 'cancer', start: [6, 21], end: [7, 22] },
            { sign: 'leo', start: [7, 23], end: [8, 22] },
            { sign: 'virgo', start: [8, 23], end: [9, 22] },
            { sign: 'libra', start: [9, 23], end: [10, 22] },
            { sign: 'scorpio', start: [10, 23], end: [11, 21] },
            { sign: 'sagittarius', start: [11, 22], end: [12, 21] },
            { sign: 'capricorn', start: [12, 22], end: [12, 31] }
        ];
        const zodiacSign = zodiacRanges.find(range => {
            const [startMonth, startDay] = range.start;
            const [endMonth, endDay] = range.end;
            if (startMonth === month && day >= startDay)
                return true;
            if (endMonth === month && day <= endDay)
                return true;
            return false;
        });
        return zodiacSign?.sign || 'capricorn';
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'birthDate') {
            const zodiacSign = calculateZodiacSign(value);
            setPersonalInfo(prev => ({
                ...prev,
                [name]: value,
                zodiacSign
            }));
        }
        else {
            setPersonalInfo(prev => ({
                ...prev,
                [name]: value
            }));
        }
        // 入力時にエラーをクリア
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    const validateInput = (value, type) => {
        if (!value || value.trim() === '') {
            return `${type === 'name' ? '名前' : '生年月日'}を入力してください`;
        }
        if (type === 'date') {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return '有効な日付を入力してください';
            }
            if (date > new Date()) {
                return '未来の日付は選択できません';
            }
        }
        return null;
    };
    const validateForm = () => {
        const newErrors = {};
        const nameError = validateInput(personalInfo.name, 'name');
        if (nameError)
            newErrors.name = nameError;
        const dateError = validateInput(personalInfo.birthDate, 'date');
        if (dateError)
            newErrors.birthDate = dateError;
        if (!personalInfo.gender) {
            newErrors.gender = '性別を選択してください';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('入力内容に誤りがあります');
            return;
        }
        // デモモードでは保存をシミュレート
        setIsSaving(true);
        setTimeout(() => {
            toast.success('プロフィール情報を更新しました（デモ）');
            setSuccess(true);
            setIsSaving(false);
            // 保存成功後、占いページに戻る
            setTimeout(() => {
                navigate('/fortune');
            }, 1500);
        }, 1000);
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 p-8", children: _jsxs("div", { className: "max-w-2xl mx-auto bg-purple-800/30 backdrop-blur-sm rounded-xl p-8 shadow-lg", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-purple-100", children: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u8A2D\u5B9A" }), _jsx("span", { className: "text-sm text-purple-300 bg-purple-700/50 px-3 py-1 rounded-full", children: user?.subscriptionPlan === 'test' ? 'テストプラン' : 'デモモード' })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-purple-200 mb-2", children: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u753B\u50CF" }), _jsxs("div", { className: "flex items-center space-x-4", children: [imagePreview && (_jsx("img", { src: imagePreview, alt: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB", className: "w-24 h-24 rounded-full object-cover" })), _jsxs("label", { className: "cursor-pointer bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors", children: ["\u753B\u50CF\u3092\u9078\u629E", _jsx("input", { type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden" })] })] }), errors.image && (_jsx("p", { className: "text-red-400 text-sm mt-1", children: errors.image }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-purple-200 mb-2", children: "\u540D\u524D" }), _jsx("input", { type: "text", id: "name", name: "name", value: personalInfo.name, onChange: handleInputChange, className: "w-full bg-purple-900/50 border border-purple-700 text-purple-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" }), errors.name && (_jsx("p", { className: "text-red-400 text-sm mt-1", children: errors.name }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "birthDate", className: "block text-purple-200 mb-2", children: "\u751F\u5E74\u6708\u65E5" }), _jsx("input", { type: "date", id: "birthDate", name: "birthDate", value: personalInfo.birthDate, onChange: handleInputChange, className: "w-full bg-purple-900/50 border border-purple-700 text-purple-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" }), errors.birthDate && (_jsx("p", { className: "text-red-400 text-sm mt-1", children: errors.birthDate }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "birthTime", className: "block text-purple-200 mb-2", children: "\u8A95\u751F\u6642\u523B\uFF08\u4EFB\u610F\uFF09" }), _jsx("input", { type: "time", id: "birthTime", name: "birthTime", value: personalInfo.birthTime || '', onChange: handleInputChange, className: "w-full bg-purple-900/50 border border-purple-700 text-purple-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "birthPlace", className: "block text-purple-200 mb-2", children: "\u51FA\u751F\u5730\uFF08\u4EFB\u610F\uFF09" }), _jsx("input", { type: "text", id: "birthPlace", name: "birthPlace", value: personalInfo.birthPlace || '', onChange: handleInputChange, className: "w-full bg-purple-900/50 border border-purple-700 text-purple-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "gender", className: "block text-purple-200 mb-2", children: "\u6027\u5225" }), _jsxs("select", { id: "gender", name: "gender", value: personalInfo.gender || '', onChange: handleInputChange, className: "w-full bg-purple-900/50 border border-purple-700 text-purple-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500", children: [_jsx("option", { value: "", children: "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044" }), _jsx("option", { value: "male", children: "\u7537\u6027" }), _jsx("option", { value: "female", children: "\u5973\u6027" }), _jsx("option", { value: "other", children: "\u305D\u306E\u4ED6" }), _jsx("option", { value: "not_specified", children: "\u56DE\u7B54\u3057\u306A\u3044" })] }), errors.gender && (_jsx("p", { className: "text-red-400 text-sm mt-1", children: errors.gender }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "zodiacSign", className: "block text-purple-200 mb-2", children: "\u661F\u5EA7" }), _jsx("select", { id: "zodiacSign", name: "zodiacSign", value: personalInfo.zodiacSign, onChange: handleInputChange, className: "w-full bg-purple-900/50 border border-purple-700 text-purple-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500", children: ZODIAC_SIGNS.map(sign => (_jsx("option", { value: sign.value, children: sign.label }, sign.value))) })] }), _jsxs("div", { className: "flex justify-between items-center pt-4", children: [_jsx("button", { type: "button", onClick: () => navigate('/fortune'), className: "bg-purple-700/50 text-purple-200 px-6 py-2 rounded-lg hover:bg-purple-600/50 transition-colors", children: "\u623B\u308B" }), _jsx(motion.button, { type: "submit", disabled: isSaving, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: `bg-purple-600 text-white px-8 py-2 rounded-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500'} transition-colors`, children: isSaving ? '保存中...' : '保存' })] })] }), success && (_jsx("div", { className: "mt-4 bg-green-500/10 border border-green-500/50 rounded-lg p-4", children: _jsx("p", { className: "text-green-400 text-center", children: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u60C5\u5831\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F" }) }))] }) }));
}
;
