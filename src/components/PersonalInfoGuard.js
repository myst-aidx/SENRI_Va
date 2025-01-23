import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { usePersonalInfo } from '../context/PersonalInfoContext';
export default function PersonalInfoGuard({ children }) {
    const { isOnboardingComplete, personalInfo } = usePersonalInfo();
    const location = useLocation();
    // 個人情報入力ページにいる場合は、そのまま表示
    if (location.pathname === '/personal-info') {
        return _jsx(_Fragment, { children: children });
    }
    // 個人情報が未入力の場合は、個人情報入力ページにリダイレクト
    if (!isOnboardingComplete || !personalInfo) {
        return _jsx(Navigate, { to: "/personal-info", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
