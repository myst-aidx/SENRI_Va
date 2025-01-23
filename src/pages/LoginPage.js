import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginRequest } from '../auth/AuthService';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();
    const prevAuthRef = useRef(isAuthenticated);
    // 認証状態の監視と自動リダイレクト
    useEffect(() => {
        // 認証状態が false から true に変更された場合のみリダイレクト
        if (!prevAuthRef.current && isAuthenticated) {
            console.log('Auth state changed from false to true, redirecting to /fortune');
            navigate('/fortune', { replace: true });
        }
        // 現在の認証状態を保存
        prevAuthRef.current = isAuthenticated;
    }, [isAuthenticated, navigate]);
    // 通常のログイン処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await loginRequest(email, password);
            await login(response.token);
        }
        catch (err) {
            setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
            console.error('Login error:', err);
        }
    };
    // 強制ログイン処理（デバッグログ追加）
    const handleForceLogin = async () => {
        console.log('Force Login - Start');
        try {
            // デバッグユーザー情報を設定
            const debugUser = {
                id: 'debug_user',
                email: 'debug@example.com',
                role: 'USER',
                isSubscribed: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            console.log('Force Login - Setting debug user:', debugUser);
            // AuthContextのlogin関数を使用
            await login('debug_mode_token');
            console.log('Force Login - Login successful');
            // エラーをクリア
            setError('');
        }
        catch (err) {
            console.error('Force Login - Error:', err);
            setError('強制ログインに失敗しました。');
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-900", children: _jsxs("div", { className: "max-w-md w-full space-y-8 p-8", children: [_jsx("h2", { className: "text-center text-3xl font-extrabold text-white", children: "\u30ED\u30B0\u30A4\u30F3" }), error && (_jsx("div", { className: "bg-red-500 text-white p-3 rounded", children: error })), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [_jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm", placeholder: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9", autoComplete: "email" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm", placeholder: "\u30D1\u30B9\u30EF\u30FC\u30C9", autoComplete: "current-password" }), _jsx("button", { type: "submit", className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: "\u30ED\u30B0\u30A4\u30F3" })] }), _jsx("button", { onClick: handleForceLogin, className: "mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500", children: "\u5F37\u5236\u30ED\u30B0\u30A4\u30F3\uFF08\u30C7\u30D0\u30C3\u30B0\u7528\uFF09" })] }) }));
}
