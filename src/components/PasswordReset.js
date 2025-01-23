import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { requestPasswordReset, validateResetToken, resetPassword } from '../auth/AuthService';
import { toast } from 'react-toastify';
export const PasswordReset = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [formState, setFormState] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    useEffect(() => {
        const checkToken = async () => {
            if (token) {
                try {
                    const isValid = await validateResetToken(token);
                    setTokenValid(isValid);
                }
                catch (err) {
                    console.error('Token validation failed:', err);
                    setTokenValid(false);
                }
            }
        };
        if (token) {
            checkToken();
        }
    }, [token]);
    const validateForm = () => {
        const newErrors = {};
        if (!token && !formState.email) {
            newErrors.email = 'メールアドレスを入力してください';
        }
        else if (!token && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            newErrors.email = '有効なメールアドレスを入力してください';
        }
        if (token) {
            if (!formState.newPassword) {
                newErrors.newPassword = '新しいパスワードを入力してください';
            }
            else if (formState.newPassword.length < 8) {
                newErrors.newPassword = 'パスワードは8文字以上である必要があります';
            }
            if (!formState.confirmPassword) {
                newErrors.confirmPassword = 'パスワードを確認してください';
            }
            else if (formState.newPassword !== formState.confirmPassword) {
                newErrors.confirmPassword = 'パスワードが一致しません';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        setLoading(true);
        try {
            if (token) {
                // パスワードのリセット
                await resetPassword(token, formState.newPassword);
                toast.success('パスワードが正常に更新されました');
                navigate('/login');
            }
            else {
                // リセットリンクの送信
                await requestPasswordReset(formState.email);
                toast.success('パスワードリセットのリンクをメールで送信しました');
            }
        }
        catch (err) {
            console.error('Password reset failed:', err);
            setErrors({
                general: err instanceof Error ? err.message : 'パスワードのリセットに失敗しました'
            });
            toast.error('エラーが発生しました');
        }
        finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
        // 入力時にエラーをクリア
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    if (token && !tokenValid) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 flex items-center justify-center px-4", children: _jsx("div", { className: "max-w-md w-full bg-white rounded-lg shadow-xl p-8", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "\u7121\u52B9\u306A\u30EA\u30F3\u30AF" }), _jsx("p", { className: "text-gray-600 mb-6", children: "\u3053\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u30EA\u30BB\u30C3\u30C8\u30EA\u30F3\u30AF\u306F\u7121\u52B9\u3067\u3042\u308B\u304B\u3001\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\u3002" }), _jsx("button", { onClick: () => navigate('/password-reset'), className: "w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors", children: "\u65B0\u3057\u3044\u30EA\u30BB\u30C3\u30C8\u30EA\u30F3\u30AF\u3092\u8981\u6C42" })] }) }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 flex items-center justify-center px-4", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-xl p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: token ? 'パスワードの再設定' : 'パスワードリセット' }), _jsx("p", { className: "text-gray-600 mt-2", children: token
                                ? '新しいパスワードを入力してください'
                                : 'パスワードリセットのリンクをメールで送信します' })] }), errors.general && (_jsx("div", { className: "mb-4 p-3 bg-red-100 text-red-700 rounded-lg", children: errors.general })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [!token && (_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx("input", { type: "email", id: "email", name: "email", value: formState.email, onChange: handleChange, className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" }), errors.email && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email }))] })), token && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "newPassword", className: "block text-sm font-medium text-gray-700", children: "\u65B0\u3057\u3044\u30D1\u30B9\u30EF\u30FC\u30C9" }), _jsx("input", { type: "password", id: "newPassword", name: "newPassword", value: formState.newPassword, onChange: handleChange, className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" }), errors.newPassword && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.newPassword }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "\u30D1\u30B9\u30EF\u30FC\u30C9\u306E\u78BA\u8A8D" }), _jsx("input", { type: "password", id: "confirmPassword", name: "confirmPassword", value: formState.confirmPassword, onChange: handleChange, className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" }), errors.confirmPassword && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.confirmPassword }))] })] })), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50", children: loading
                                ? (token ? 'パスワードを更新中...' : 'リンクを送信中...')
                                : (token ? 'パスワードを更新' : 'リセットリンクを送信') })] })] }) }));
};
