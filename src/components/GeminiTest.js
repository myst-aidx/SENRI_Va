import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// file: src/components/GeminiTest.tsx
import { useState } from 'react';
import { getOpenAIResponse } from '../utils/openai';
export default function GeminiTest() {
    // ユーザーが入力したテキストを保持するState
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // テスト実行（OpenAIに問い合わせ）
    const testGemini = async () => {
        setLoading(true);
        setError('');
        try {
            // ここを変更して、userInputを引数に渡す
            const result = await getOpenAIResponse(userInput, [], new Date());
            setResponse(result);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
            console.error('Gemini Test Error:', err);
        }
        setLoading(false);
    };
    return (_jsxs("div", { className: "p-4 space-y-4", children: [_jsx("h2", { className: "text-xl font-bold text-purple-100", children: "Gemini API \u30C6\u30B9\u30C8" }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-purple-200", children: "\u8CEA\u554F\u3092\u5165\u529B:" }), _jsx("input", { type: "text", value: userInput, onChange: (e) => setUserInput(e.target.value), placeholder: "\u880D\u5EA7\u306E\u604B\u611B\u904B\u3092\u6559\u3048\u3066", className: "p-2 rounded text-black w-full" })] }), _jsx("button", { onClick: testGemini, disabled: loading, className: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50", children: loading ? 'テスト実行中...' : 'テスト実行' }), error && (_jsxs("div", { className: "p-4 bg-red-500/20 text-red-100 rounded-lg", children: ["\u30A8\u30E9\u30FC: ", error] })), response && (_jsxs("div", { className: "p-4 bg-purple-800/20 text-purple-100 rounded-lg", children: [_jsx("h3", { className: "font-bold mb-2", children: "API \u30EC\u30B9\u30DD\u30F3\u30B9:" }), _jsx("pre", { className: "whitespace-pre-wrap", children: response })] }))] }));
}
