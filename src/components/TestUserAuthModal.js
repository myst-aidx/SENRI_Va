import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { toast } from 'react-toastify';
import { generateTestUserToken } from '../utils/testAuth';
export default function TestUserAuthModal({ onClose }) {
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();
    const validatePassword = (pass) => {
        // 8桁の数字とアルファベットの組み合わせを要求
        const hasNumber = /\d/.test(pass);
        const hasLetter = /[a-zA-Z]/.test(pass);
        const isEightChars = pass.length === 8;
        return hasNumber && hasLetter && isEightChars;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!validatePassword(password)) {
            setError('パスワードは8桁の数字とアルファベットの組み合わせである必要があります');
            return;
        }
        setIsProcessing(true);
        try {
            const token = await generateTestUserToken(password);
            if (!token) {
                throw new Error('認証に失敗しました');
            }
            // テストユーザーとしてログイン
            await login('test@example.com', token);
            toast.success('テストユーザーとしてログインしました');
            navigate('/fortune');
            onClose();
        }
        catch (err) {
            console.error('Test user authentication failed:', err);
            setError('認証に失敗しました。正しいパスワードを入力してください。');
            toast.error('認証に失敗しました');
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-md relative", children: [_jsx("button", { onClick: onClose, className: "absolute top-2 right-2 text-gray-500 hover:text-gray-700", children: "\u00D7" }), _jsxs("div", { className: "text-center mb-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: "\u30C6\u30B9\u30C8\u30E6\u30FC\u30B6\u30FC\u8A8D\u8A3C" }), _jsx("p", { className: "text-gray-600 text-sm", children: "\u30C6\u30B9\u30C8\u30E6\u30FC\u30B6\u30FC\u7528\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044" }), _jsx("p", { className: "text-gray-500 text-xs mt-1", children: "\u203B8\u6841\u306E\u6570\u5B57\u3068\u30A2\u30EB\u30D5\u30A1\u30D9\u30C3\u30C8\u306E\u7D44\u307F\u5408\u308F\u305B" })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("div", { className: "mb-4", children: _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 text-gray-900", placeholder: "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B", maxLength: 8 }) }), error && (_jsx("div", { className: "mb-4 text-red-500 text-sm text-center", children: error })), _jsx("button", { type: "submit", disabled: isProcessing, className: `w-full py-2 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`, children: isProcessing ? '認証中...' : '認証する' })] })] }) }));
}
