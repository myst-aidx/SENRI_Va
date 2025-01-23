import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppError, ErrorType } from '../types/errors';
import { ErrorMessages } from '../constants/errorMessages';
import { getSessionInfo, saveSessionInfo, clearSession } from '../auth/AuthService';
export const AuthContext = createContext({
    user: null,
    loading: true,
    error: null,
    signup: async () => { },
    login: async () => { },
    logout: () => { },
    refreshToken: async () => { },
    isAuthenticated: false
});
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const signup = useCallback(async (email, password, confirmPassword) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, confirmPassword }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new AppError(errorData.message || ErrorMessages.UNKNOWN_ERROR, ErrorType.AUTHENTICATION, response.status);
            }
            const data = await response.json();
            setUser(data.user);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(ErrorMessages.NETWORK_ERROR, ErrorType.NETWORK);
        }
    }, []);
    const login = useCallback(async (token) => {
        try {
            saveSessionInfo(token, ''); // refreshTokenは一時的に空文字で
            setIsAuthenticated(true);
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }, []);
    const logout = useCallback(() => {
        try {
            clearSession();
            setIsAuthenticated(false);
        }
        catch (error) {
            console.error('Logout failed:', error);
        }
    }, []);
    const refreshToken = useCallback(async () => {
        // Implementation of refreshToken method
    }, []);
    useEffect(() => {
        const checkAuth = () => {
            try {
                const session = getSessionInfo();
                setIsAuthenticated(!!session);
            }
            catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
            }
            finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);
    const value = {
        user,
        loading,
        error,
        signup,
        login,
        logout,
        refreshToken,
        isAuthenticated
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export default AuthProvider;
