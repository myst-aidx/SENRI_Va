import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { AuthError, ErrorType } from '../types/errors';
export default function SignupPage() {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (password !== confirmPassword) {
                setError('パスワードが一致しません。');
                return;
            }
            await signup(email, password, confirmPassword);
            navigate('/personal-info');
        }
        catch (err) {
            console.error('Signup error:', err);
            if (err instanceof AuthError) {
                switch (err.type) {
                    case ErrorType.VALIDATION:
                        setError('入力内容が正しくありません。メールアドレスとパスワードを確認してください。');
                        break;
                    case ErrorType.DUPLICATE:
                        setError('このメールアドレスは既に登録されています。別のメールアドレスを使用するか、ログインしてください。');
                        break;
                    case ErrorType.NETWORK:
                        setError('ネットワークエラーが発生しました。インターネット接続を確認してください。');
                        break;
                    default:
                        setError('新規登録に失敗しました。しばらく時間をおいて再度お試しください。');
                }
            }
            else {
                setError('予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください。');
            }
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs("form", { onSubmit: handleSignup, className: "bg-purple-950/50 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-800/30 p-8 space-y-6", "data-testid": "signup-form", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-amber-200", children: "\u65B0\u898F\u767B\u9332" }), _jsx("p", { className: "mt-2 text-purple-200", children: "\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u4F5C\u6210\u3057\u3066\u3001\u5360\u3044\u306E\u4E16\u754C\u3078\u3088\u3046\u3053\u305D" })] }), error && (_jsx("div", { className: "bg-red-500/10 border border-red-500/50 rounded-lg p-4", "data-testid": "error-message", children: _jsx("p", { className: "text-red-400 text-center", children: error }) })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "text-purple-200 block mb-1 font-medium", children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx("input", { type: "email", id: "email", "data-testid": "email-input", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 bg-white/90 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent", placeholder: "example@email.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "text-purple-200 block mb-1 font-medium", children: "\u30D1\u30B9\u30EF\u30FC\u30C9" }), _jsx("input", { type: "password", id: "password", "data-testid": "password-input", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 bg-white/90 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent", placeholder: "8\u6587\u5B57\u4EE5\u4E0A\u306E\u82F1\u6570\u5B57", required: true, minLength: 8, autoComplete: "new-password" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "text-purple-200 block mb-1 font-medium", children: "\u30D1\u30B9\u30EF\u30FC\u30C9\uFF08\u78BA\u8A8D\uFF09" }), _jsx("input", { type: "password", id: "confirmPassword", "data-testid": "confirm-password-input", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full px-4 py-2 bg-white/90 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent", placeholder: "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u518D\u5165\u529B", required: true, minLength: 8, autoComplete: "new-password" })] })] }), _jsx("button", { type: "submit", "data-testid": "signup-button", className: "w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-100", children: "\u65B0\u898F\u767B\u9332" }), _jsxs("p", { className: "text-center text-purple-300 mt-4", children: ["\u3059\u3067\u306B\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u304A\u6301\u3061\u306E\u65B9\u306F", ' ', _jsx(Link, { to: "/login", className: "text-purple-400 hover:text-purple-300 underline", children: "\u30ED\u30B0\u30A4\u30F3" })] })] }) }) }));
}
