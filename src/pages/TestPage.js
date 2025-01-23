import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function TestPage() {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            // TODO: Gemini APIの呼び出し
            setResult('テスト結果がここに表示されます');
        }
        catch (err) {
            setError('テストの実行に失敗しました。');
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900", children: [_jsx("header", { className: "p-4", children: _jsxs("div", { className: "max-w-4xl mx-auto flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-amber-200", children: "\u795E\u79D8\u306E\u5360\u3044" }), _jsxs("div", { className: "relative", children: [_jsx("button", { type: "button", onClick: () => setShowSettings(!showSettings), className: "p-2 text-purple-200 hover:text-purple-100 focus:outline-none", children: _jsxs("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })] }) }), showSettings && (_jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-purple-900/90 rounded-lg shadow-xl border border-purple-700/50", children: [_jsx("button", { type: "button", onClick: () => navigate('/personal-info'), className: "w-full px-4 py-2 text-left text-purple-200 hover:bg-purple-800/50 rounded-t-lg", children: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u7DE8\u96C6" }), _jsx("button", { type: "button", onClick: () => {
                                                localStorage.removeItem('token');
                                                navigate('/login');
                                            }, className: "w-full px-4 py-2 text-left text-red-300 hover:bg-purple-800/50 rounded-b-lg", children: "\u30ED\u30B0\u30A2\u30A6\u30C8" })] }))] })] }) }), _jsx("main", { className: "p-4 flex justify-center items-center", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs("div", { className: "bg-purple-950/50 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-800/30 p-8 space-y-6", children: [_jsx("div", { className: "text-center", children: _jsx("h2", { className: "text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-amber-200", children: "Gemini API \u30C6\u30B9\u30C8" }) }), error && (_jsx("div", { className: "bg-red-500/10 border border-red-500/50 rounded-lg p-4", children: _jsx("p", { className: "text-red-400 text-center", children: error }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "question", className: "text-purple-200 block mb-1 font-medium", children: "\u8CEA\u554F\u3092\u5165\u529B:" }), _jsx("input", { id: "question", type: "text", value: question, onChange: (e) => setQuestion(e.target.value), className: "w-full px-4 py-2 bg-purple-900/50 border border-purple-700/50 rounded-lg text-purple-100 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent", required: true })] }), _jsx("button", { type: "submit", className: "w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-100", children: "\u30C6\u30B9\u30C8\u5B9F\u884C" })] }), result && (_jsx("div", { className: "mt-4 p-4 bg-purple-800/20 rounded-lg border border-purple-700/30", children: _jsx("p", { className: "text-purple-100 whitespace-pre-wrap", children: result }) }))] }) }) })] }));
}
