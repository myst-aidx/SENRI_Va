import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
export const ProtectedRoute = ({ children }) => {
    // 認証チェックを一時的に無効化
    return _jsx(_Fragment, { children: children });
};
export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return _jsx(LoadingSpinner, {});
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
