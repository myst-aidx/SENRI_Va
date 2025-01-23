import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, "data-testid": "login-form", className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, "data-testid": "email-input", "aria-label": "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9", "aria-required": "true", className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "\u30D1\u30B9\u30EF\u30FC\u30C9" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, "data-testid": "password-input", "aria-label": "\u30D1\u30B9\u30EF\u30FC\u30C9", "aria-required": "true", className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" })] }), error && (_jsx("div", { "data-testid": "error-message", role: "alert", "aria-live": "polite", className: "text-red-600 text-sm", children: error })), _jsx("button", { type: "submit", disabled: isLoading, "data-testid": "submit-button", "aria-busy": isLoading, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50", children: isLoading ? 'ログイン中...' : 'ログイン' })] }));
}
