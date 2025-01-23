import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppError, ErrorType } from '../types/errors';
import { ErrorMessages } from '../constants/errorMessages';
import { validatePassword, validateEmail } from '../utils/validation';
export const SignupForm = ({ onSuccess }) => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            // 入力値の検証
            if (!email || !password || !confirmPassword) {
                throw new AppError(ErrorMessages.REQUIRED_FIELDS, ErrorType.VALIDATION);
            }
            if (!validateEmail(email)) {
                throw new AppError(ErrorMessages.INVALID_EMAIL, ErrorType.VALIDATION);
            }
            if (!validatePassword(password)) {
                throw new AppError(ErrorMessages.INVALID_PASSWORD, ErrorType.VALIDATION);
            }
            if (password !== confirmPassword) {
                throw new AppError(ErrorMessages.PASSWORD_MISMATCH, ErrorType.VALIDATION);
            }
            // サインアップ処理
            await signup(email, password);
            if (onSuccess) {
                onSuccess();
            }
            else {
                navigate('/dashboard');
            }
        }
        catch (err) {
            console.error('Signup error:', err);
            if (err instanceof AppError) {
                setError(err.message);
            }
            else if (err instanceof Error) {
                // サーバーからのエラーメッセージを解析
                try {
                    const errorData = JSON.parse(err.message);
                    setError(errorData.message || ErrorMessages.UNKNOWN_ERROR);
                }
                catch {
                    setError(err.message || ErrorMessages.UNKNOWN_ERROR);
                }
            }
            else {
                setError(ErrorMessages.UNKNOWN_ERROR);
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 max-w-md mx-auto", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500", disabled: isLoading })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "\u30D1\u30B9\u30EF\u30FC\u30C9" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500", disabled: isLoading })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "\u30D1\u30B9\u30EF\u30FC\u30C9\uFF08\u78BA\u8A8D\uFF09" }), _jsx("input", { id: "confirmPassword", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500", disabled: isLoading })] }), error && (_jsx("div", { className: "text-red-600 text-sm mt-2", role: "alert", children: error })), _jsx("button", { type: "submit", className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50", disabled: isLoading, children: isLoading ? '処理中...' : '新規登録' })] }));
};
export default SignupForm;
