import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { UserRole } from '../types/user';
export default function ProtectedRoute({ children, requiredRole = UserRole.USER, requireSubscription = false, }) {
    const { isAuthenticated, user, checkPermission } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    if (!checkPermission(requiredRole)) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    if (requireSubscription && !user?.isSubscribed && user?.role !== UserRole.TEST_USER) {
        return _jsx(Navigate, { to: "/subscription", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
