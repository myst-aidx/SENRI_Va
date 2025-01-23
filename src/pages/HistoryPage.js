import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
// デモ用の履歴データ
const DEMO_HISTORY = [
    {
        id: '1',
        date: new Date().toISOString(),
        type: '星占い',
        question: '今日の運勢は？',
        result: '今日はラッキーな一日になりそうです。新しいことに挑戦するのに適した日です。'
    },
    {
        id: '2',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        type: 'タロット',
        question: '恋愛運について',
        result: '「恋人」のカードが出ました。素晴らしい出会いが期待できます。'
    }
];
const HistoryPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // デモデータを表示
        setHistoryData(DEMO_HISTORY);
        setLoading(false);
    }, []);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen p-8 flex items-center justify-center", children: _jsx("div", { className: "text-purple-200", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." }) }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-purple-100", children: "\u5360\u3044\u5C65\u6B74" }), _jsx("button", { onClick: () => navigate('/fortune'), className: "px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500", children: "\u5360\u3044\u9078\u629E\u306B\u623B\u308B" })] }), error && (_jsx("div", { className: "bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-4", children: error })), historyData.length > 0 ? (_jsx("div", { className: "space-y-6", children: historyData.map((item) => (_jsxs("div", { className: "bg-purple-900/30 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6", children: [_jsx("div", { className: "flex justify-between items-start mb-4", children: _jsxs("div", { children: [_jsx("p", { className: "text-sm text-purple-300", children: new Date(item.date).toLocaleDateString('ja-JP') }), _jsx("p", { className: "text-lg font-medium text-purple-100", children: item.type })] }) }), _jsxs("p", { className: "text-purple-200 mb-4", children: ["\u8CEA\u554F: ", item.question] }), _jsxs("p", { className: "text-purple-200", children: ["\u7D50\u679C: ", item.result] })] }, item.id))) })) : (_jsx("p", { className: "text-purple-300 text-center", children: "\u5C65\u6B74\u304C\u3042\u308A\u307E\u305B\u3093" }))] }));
};
export default HistoryPage;
