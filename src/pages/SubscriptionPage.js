import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { toast } from 'react-toastify';
export default function SubscriptionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(location.state?.plan || 'basic');
    const plans = [
        {
            id: 'basic',
            name: 'ベーシック',
            price: '1,000',
            features: ['基本的な占い機能', '月3回まで詳細な占い']
        },
        {
            id: 'premium',
            name: 'プレミアム',
            price: '3,000',
            features: ['すべての占い機能', '無制限の詳細な占い', '優先サポート']
        }
    ];
    // テストプランユーザーの場合は、デモメッセージを表示して戻る
    if (user?.plan === 'test') {
        return (_jsx("div", { className: "min-h-screen bg-purple-900 py-8 px-4", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "bg-purple-800/30 backdrop-blur-sm rounded-xl p-8 text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-purple-100 mb-4", children: "\u30C6\u30B9\u30C8\u30D7\u30E9\u30F3" }), _jsxs("p", { className: "text-purple-200 mb-6", children: ["\u73FE\u5728\u3001\u30C6\u30B9\u30C8\u30D7\u30E9\u30F3\u3092\u3054\u5229\u7528\u4E2D\u3067\u3059\u3002", _jsx("br", {}), "\u30C6\u30B9\u30C8\u30D7\u30E9\u30F3\u3067\u306F\u3001\u57FA\u672C\u7684\u306A\u5360\u3044\u6A5F\u80FD\u3092\u304A\u8A66\u3057\u3044\u305F\u3060\u3051\u307E\u3059\u3002"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-purple-700/30 rounded-lg p-4", children: [_jsx("h2", { className: "text-xl font-bold text-purple-100 mb-2", children: "\u30C6\u30B9\u30C8\u30D7\u30E9\u30F3\u306E\u7279\u5FB4" }), _jsxs("ul", { className: "text-purple-200 space-y-2", children: [_jsx("li", { children: "\u2022 \u57FA\u672C\u7684\u306A\u5360\u3044\u6A5F\u80FD\u306E\u5229\u7528" }), _jsx("li", { children: "\u2022 1\u56DE\u9650\u308A\u306E\u8A73\u7D30\u306A\u5360\u3044" }), _jsx("li", { children: "\u2022 \u5C65\u6B74\u306E\u4FDD\u5B58" })] })] }), _jsxs("div", { className: "bg-purple-700/30 rounded-lg p-4", children: [_jsx("h2", { className: "text-xl font-bold text-purple-100 mb-2", children: "\u5236\u9650\u4E8B\u9805" }), _jsxs("ul", { className: "text-purple-200 space-y-2", children: [_jsx("li", { children: "\u2022 \u4E00\u90E8\u306E\u9AD8\u5EA6\u306A\u5360\u3044\u6A5F\u80FD\u306F\u5229\u7528\u3067\u304D\u307E\u305B\u3093" }), _jsx("li", { children: "\u2022 \u8A73\u7D30\u306A\u5360\u3044\u306F1\u56DE\u9650\u308A\u3067\u3059" }), _jsx("li", { children: "\u2022 \u30B5\u30DD\u30FC\u30C8\u6A5F\u80FD\u306F\u57FA\u672C\u7684\u306A\u3082\u306E\u306B\u9650\u3089\u308C\u307E\u3059" })] })] })] }), _jsx("button", { onClick: () => navigate('/fortune'), className: "mt-8 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors", children: "\u5360\u3044\u306B\u623B\u308B" })] }) }) }));
    }
    const handleSubscribe = async (e) => {
        e.preventDefault();
        setError(null);
        // デモモードでは即座に成功
        setIsProcessing(true);
        setTimeout(() => {
            setSuccess(true);
            toast.success('サブスクリプションの登録が完了しました（デモ）');
            setTimeout(() => {
                navigate('/fortune');
            }, 2000);
        }, 1000);
    };
    return (_jsx("div", { className: "min-h-screen bg-purple-900 py-8 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-purple-100 mb-8 text-center", children: "\u30B5\u30D6\u30B9\u30AF\u30EA\u30D7\u30B7\u30E7\u30F3" }), _jsx("div", { className: "grid md:grid-cols-2 gap-6 mb-8", children: plans.map((plan) => (_jsxs("div", { className: `bg-purple-800/30 backdrop-blur-sm rounded-xl p-6 border-2 transition-all ${selectedPlan === plan.id
                            ? 'border-purple-400 shadow-lg scale-105'
                            : 'border-purple-700 hover:border-purple-500'}`, onClick: () => setSelectedPlan(plan.id), children: [_jsx("h3", { className: "text-xl font-bold text-purple-100 mb-2", children: plan.name }), _jsxs("p", { className: "text-2xl font-bold text-purple-200 mb-4", children: ["\u00A5", plan.price, _jsx("span", { className: "text-sm", children: "/\u6708" })] }), _jsx("ul", { className: "space-y-2", children: plan.features.map((feature, index) => (_jsxs("li", { className: "text-purple-300 flex items-center", children: [_jsx("svg", { className: "w-5 h-5 mr-2 text-purple-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), feature] }, index))) })] }, plan.id))) }), success ? (_jsxs("div", { className: "bg-green-500/10 border border-green-500/50 rounded-xl p-6 text-center", children: [_jsx("h3", { className: "text-xl font-bold text-green-400 mb-2", children: "\u30B5\u30D6\u30B9\u30AF\u30EA\u30D7\u30B7\u30E7\u30F3\u306E\u767B\u9332\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\uFF01" }), _jsx("p", { className: "text-green-300", children: "\u81EA\u52D5\u7684\u306B\u5360\u3044\u30DA\u30FC\u30B8\u306B\u79FB\u52D5\u3057\u307E\u3059..." })] })) : (_jsxs("div", { className: "bg-purple-800/30 backdrop-blur-sm rounded-xl p-6 text-center", children: [_jsxs("p", { className: "text-purple-200 mb-6", children: ["\u30C7\u30E2\u30E2\u30FC\u30C9\u3067\u306F\u3001\u5B9F\u969B\u306E\u652F\u6255\u3044\u51E6\u7406\u306F\u884C\u308F\u308C\u307E\u305B\u3093\u3002", _jsx("br", {}), "\u300C\u767B\u9332\u3059\u308B\u300D\u30DC\u30BF\u30F3\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u3001\u30C7\u30E2\u7528\u306E\u6210\u529F\u30E1\u30C3\u30BB\u30FC\u30B8\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002"] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("button", { type: "button", onClick: () => navigate('/fortune'), className: "px-6 py-2 bg-purple-700/50 text-purple-200 rounded-lg hover:bg-purple-600/50 transition-colors", children: "\u623B\u308B" }), _jsx("button", { onClick: handleSubscribe, disabled: isProcessing, className: "px-8 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: isProcessing ? '処理中...' : '登録する（デモ）' })] })] }))] }) }));
}
