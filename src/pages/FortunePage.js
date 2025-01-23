import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { Sparkles, Calculator, Calendar, Home, Settings, Compass, Hand, Moon, Cat } from 'lucide-react';
const fortuneTypes = [
    {
        id: 'astrology',
        name: '星占い',
        description: '星々の配置からあなたの運勢を読み解き、人生の指針を示します。',
        path: '/fortune/astrology',
        icon: Sparkles,
        availableInTest: true
    },
    {
        id: 'tarot',
        name: 'タロット占い',
        description: '神秘的なタロットカードを使って、あなたの運命を読み解きます。',
        path: '/fortune/tarot',
        icon: Moon,
        availableInTest: true
    },
    {
        id: 'numerology',
        name: '数秘術',
        description: '生年月日から導き出される数字で、あなたの運命のパターンを解き明かします。',
        path: '/fortune/numerology',
        icon: Calculator,
        availableInTest: false
    },
    {
        id: 'palm',
        name: '手相占い',
        description: 'あなたの手のひらに刻まれた運命の筋を読み解きます。',
        path: '/fortune/palm',
        icon: Hand,
        availableInTest: false
    },
    {
        id: 'dream',
        name: '夢占い',
        description: '不思議な夢の中に隠された、あなたへのメッセージを解読します。',
        path: '/fortune/dream',
        icon: Moon,
        availableInTest: false
    },
    {
        id: 'animal',
        name: '動物占い',
        description: 'あなたの心に宿る守護動物を見つけ、その意味を解き明かします。',
        path: '/fortune/animal',
        icon: Cat,
        availableInTest: false
    },
    {
        id: 'fourpillars',
        name: '四柱推命',
        description: '生年月日時から導き出される四つの柱で、あなたの運命を占います。',
        path: '/fortune/fourpillars',
        icon: Calendar,
        availableInTest: false
    },
    {
        id: 'fengshui',
        name: '風水占い',
        description: '住空間の気の流れから、運気の改善と人生の調和を導く',
        path: '/fortune/fengshui',
        icon: Compass,
        availableInTest: true
    }
];
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};
const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};
export default function FortunePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showSettings, setShowSettings] = useState(false);
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    const handleFortuneClick = (fortune) => {
        if (user?.subscriptionPlan === 'test' && !fortune.availableInTest) {
            toast.info('この占いはテストプランでは利用できません。有料プランへのアップグレードをご検討ください。');
            return;
        }
        navigate(fortune.path);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100", children: [_jsx("nav", { className: "p-4 bg-purple-900/50", children: _jsxs("div", { className: "max-w-4xl mx-auto flex justify-between items-center", children: [_jsxs("button", { onClick: () => navigate('/'), className: "flex items-center space-x-2 text-purple-200 hover:text-purple-100", children: [_jsx(Home, { size: 24 }), _jsx("span", { children: "\u30DB\u30FC\u30E0" })] }), _jsxs("button", { onClick: () => navigate('/settings'), className: "flex items-center space-x-2 text-purple-200 hover:text-purple-100", children: [_jsx(Settings, { size: 24 }), _jsx("span", { children: "\u8A2D\u5B9A" })] })] }) }), _jsx("main", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-center mb-8", children: "\u5360\u3044\u30E1\u30CB\u30E5\u30FC" }), _jsx(motion.div, { className: "grid grid-cols-1 md:grid-cols-2 gap-6", variants: containerVariants, initial: "hidden", animate: "visible", children: fortuneTypes.map((fortune) => (_jsx(motion.div, { variants: itemVariants, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => handleFortuneClick(fortune), className: `relative bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:bg-purple-800/30 ${user?.subscriptionPlan === 'test' && !fortune.availableInTest ? 'opacity-50' : ''}`, children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(fortune.icon, { className: "w-8 h-8 text-purple-400" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h3", { className: "text-xl font-semibold text-purple-200 group-hover:text-purple-100", children: [fortune.name, user?.subscriptionPlan === 'test' && !fortune.availableInTest && (_jsx("span", { className: "ml-2 text-xs px-2 py-1 bg-purple-500/30 rounded-full", children: "\u30D7\u30EC\u30DF\u30A2\u30E0\u9650\u5B9A" }))] }), _jsx("p", { className: "text-purple-300 text-sm mt-1", children: fortune.description })] })] }) }, fortune.id))) })] }) })] }));
}
