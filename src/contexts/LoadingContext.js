import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
const LoadingContext = createContext(null);
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef();
    const setLoading = useCallback((loading) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsLoading(loading);
    }, []);
    const withLoading = useCallback(async (promise) => {
        setIsLoading(true);
        // 10秒後に強制的にローディングを解除
        timeoutRef.current = setTimeout(() => {
            setIsLoading(false);
        }, 10000);
        try {
            const result = await promise;
            setIsLoading(false);
            return result;
        }
        catch (error) {
            setIsLoading(false);
            throw error;
        }
        finally {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, []);
    // コンポーネントのアンマウント時にタイマーをクリア
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return (_jsxs(LoadingContext.Provider, { value: { isLoading, setLoading, withLoading }, children: [children, isLoading && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500" }) }))] }));
};
export default LoadingProvider;
