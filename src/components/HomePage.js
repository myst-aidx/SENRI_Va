import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Compass, Users, Award, Check, CreditCard } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import TestUserAuthModal from './TestUserAuthModal';
const features = [
    { icon: Star, text: '占星術の専門家による監修' },
    { icon: Users, text: '95%以上の利用者満足度' },
    { icon: Compass, text: '風水と四柱推命との統合分析' },
    { icon: Award, text: '独自のAIアルゴリズム' },
];
const SUBSCRIPTION_PLANS = [
    {
        id: 'premium',
        name: 'プレミアムプラン',
        price: '9,800',
        features: [
            '四柱推命機能の無制限利用',
            '動物占いの無制限利用',
            '夢占いの無制限利用',
            '手相占いの無制限利用',
            '数秘術の無制限利用',
            '詳細な運勢解説',
            '24時間サポート',
            'プレミアム限定コンテンツ',
            '月1回の個別オンラインコンサルティング'
        ],
        recommended: true
    },
    {
        id: 'basic',
        name: 'ベーシックプラン',
        price: '4,980',
        features: [
            '四柱推命機能の利用',
            '動物占いの基本機能',
            '夢占いの基本機能',
            '手相占いの基本機能',
            '数秘術の基本機能',
            '基本的な運勢解説',
            'メールサポート'
        ],
        recommended: false
    },
    {
        id: 'test',
        name: 'テストプラン',
        price: '0',
        features: [
            '全ての占い機能が制限付で利用可能',
            '全ての解説機能が利用可能',
            '24時間サポート',
            'テストユーザー専用機能',
            '※テストユーザー専用のプランです'
        ],
        recommended: false
    }
];
export default function HomePage() {
    const [showTestUserModal, setShowTestUserModal] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const handlePlanSelect = (plan) => {
        if (isAuthenticated) {
            navigate('/subscription', { state: { selectedPlan: plan } });
            return;
        }
        // テストプランの場合のみモーダルを表示
        if (plan === 'test') {
            setShowTestUserModal(true);
            return;
        }
        // その他のプランの場合はログインページに遷移
        navigate('/login', {
            state: {
                redirectTo: '/subscription',
                selectedPlan: plan
            }
        });
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "text-center py-20", children: [_jsx("h1", { className: "text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-purple-200 to-amber-200", children: "\u795E\u79D8\u306E\u5360\u3044" }), _jsx("p", { className: "text-xl md:text-2xl mb-8 text-purple-200", children: "\u3042\u306A\u305F\u306E\u904B\u547D\u306E\u5C0E\u304D\u3092\u3001\u6700\u65B0\u306E\u30C6\u30AF\u30CE\u30ED\u30B8\u30FC\u3068\u4F1D\u7D71\u7684\u306A\u5360\u8853\u3067\u89E3\u304D\u660E\u304B\u3057\u307E\u3059" })] }), _jsx("div", { className: "py-16", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: features.map((feature, index) => (_jsxs("div", { className: "bg-purple-900/30 backdrop-blur-sm p-6 rounded-xl border border-purple-800/30", children: [_jsx(feature.icon, { className: "w-12 h-12 text-purple-300 mb-4" }), _jsx("p", { className: "text-lg text-purple-100", children: feature.text })] }, index))) }) }), _jsxs("div", { className: "py-16", children: [_jsx("h2", { className: "text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-purple-200 to-amber-200", children: "\u6599\u91D1\u30D7\u30E9\u30F3" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: SUBSCRIPTION_PLANS.map((plan) => (_jsxs("div", { className: `bg-purple-900/30 backdrop-blur-sm p-8 rounded-xl border ${plan.recommended ? 'border-amber-400/50' : 'border-purple-800/30'} relative`, children: [plan.recommended && (_jsx("div", { className: "absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold", children: "\u304A\u3059\u3059\u3081" })), _jsx("h3", { className: "text-2xl font-bold mb-4", children: plan.name }), _jsxs("div", { className: "text-3xl font-bold mb-6", children: ["\u00A5", plan.price, _jsx("span", { className: "text-lg font-normal text-purple-300", children: "/\u6708" })] }), _jsx("ul", { className: "space-y-4 mb-8", children: plan.features.map((feature, index) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(Check, { className: "w-5 h-5 text-purple-400 mt-1 flex-shrink-0" }), _jsx("span", { children: feature })] }, index))) }), _jsxs("button", { onClick: () => handlePlanSelect(plan.id), className: `w-full py-3 px-6 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${plan.recommended
                                        ? 'bg-amber-400 hover:bg-amber-500 text-purple-900'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white'}`, children: [_jsx(CreditCard, { className: "w-5 h-5" }), "\u30D7\u30E9\u30F3\u3092\u9078\u629E"] })] }, plan.id))) })] }), showTestUserModal && (_jsx(TestUserAuthModal, { onClose: () => setShowTestUserModal(false), onSuccess: () => navigate('/fortune') }))] }));
}
