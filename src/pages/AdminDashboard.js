import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, Activity, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        users: {
            total: 0,
            active: 0,
            premium: 0,
            basic: 0,
            test: 0
        },
        revenue: {
            total: 0,
            monthly: 0,
            annual: 0
        },
        activity: {
            daily: 0,
            weekly: 0,
            monthly: 0
        }
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // TODO: 実際のAPIエンドポイントから統計データを取得
        const fetchStats = async () => {
            try {
                // const response = await fetch('/api/admin/stats');
                // const data = await response.json();
                // setStats(data);
                setLoading(false);
            }
            catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900", children: _jsxs("div", { className: "container mx-auto px-4 py-6 sm:py-8 lg:py-12", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-12", children: [_jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-amber-200", children: "\u7BA1\u7406\u8005\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9" }), _jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4", children: [_jsxs("span", { className: "text-sm sm:text-base text-purple-200", children: [user?.email, " (\u7BA1\u7406\u8005)"] }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-800/50 text-purple-100 text-sm sm:text-base rounded-lg hover:bg-purple-800 transition-colors", children: [_jsx(LogOut, { size: 16, className: "sm:w-5 sm:h-5" }), "\u30ED\u30B0\u30A2\u30A6\u30C8"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-12", children: [_jsxs("div", { className: "bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 sm:p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-3 sm:mb-4", children: [_jsx("h3", { className: "text-base sm:text-lg font-medium text-purple-200", children: "\u30E6\u30FC\u30B6\u30FC\u7D71\u8A08" }), _jsx(Users, { className: "text-purple-400 w-5 h-5 sm:w-6 sm:h-6" })] }), _jsxs("div", { className: "space-y-1.5 sm:space-y-2", children: [_jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u7DCF\u30E6\u30FC\u30B6\u30FC\u6570: ", _jsx("span", { className: "text-xl sm:text-2xl font-bold", children: stats.users.total })] }), _jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u30A2\u30AF\u30C6\u30A3\u30D6\u30E6\u30FC\u30B6\u30FC: ", stats.users.active] }), _jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u30D7\u30EC\u30DF\u30A2\u30E0: ", stats.users.premium] }), _jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u30D9\u30FC\u30B7\u30C3\u30AF: ", stats.users.basic] }), _jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u30C6\u30B9\u30C8\u30E6\u30FC\u30B6\u30FC: ", stats.users.test] })] })] }), _jsxs("div", { className: "bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 sm:p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-3 sm:mb-4", children: [_jsx("h3", { className: "text-base sm:text-lg font-medium text-purple-200", children: "\u53CE\u76CA" }), _jsx(CreditCard, { className: "text-purple-400 w-5 h-5 sm:w-6 sm:h-6" })] }), _jsxs("div", { className: "space-y-1.5 sm:space-y-2", children: [_jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u7DCF\u53CE\u76CA: ", _jsxs("span", { className: "text-xl sm:text-2xl font-bold", children: ["\u00A5", stats.revenue.total.toLocaleString()] })] }), _jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u6708\u9593\u53CE\u76CA: \u00A5", stats.revenue.monthly.toLocaleString()] }), _jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u5E74\u9593\u53CE\u76CA: \u00A5", stats.revenue.annual.toLocaleString()] })] })] }), _jsxs("div", { className: "bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 sm:p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-3 sm:mb-4", children: [_jsx("h3", { className: "text-base sm:text-lg font-medium text-purple-200", children: "\u30A2\u30AF\u30C6\u30A3\u30D3\u30C6\u30A3" }), _jsx(Activity, { className: "text-purple-400 w-5 h-5 sm:w-6 sm:h-6" })] }), _jsxs("div", { className: "space-y-1.5 sm:space-y-2", children: [_jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u672C\u65E5\u306E\u30A2\u30AF\u30BB\u30B9: ", stats.activity.daily] }), _jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u9031\u9593\u30A2\u30AF\u30BB\u30B9: ", stats.activity.weekly] }), _jsxs("p", { className: "text-purple-200 text-sm sm:text-base", children: ["\u6708\u9593\u30A2\u30AF\u30BB\u30B9: ", stats.activity.monthly] })] })] }), _jsxs("div", { className: "bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 sm:p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-3 sm:mb-4", children: [_jsx("h3", { className: "text-base sm:text-lg font-medium text-purple-200", children: "\u30B7\u30B9\u30C6\u30E0\u8A2D\u5B9A" }), _jsx(Settings, { className: "text-purple-400 w-5 h-5 sm:w-6 sm:h-6" })] }), _jsxs("div", { className: "space-y-2 sm:space-y-4", children: [_jsx("button", { onClick: () => navigate('/admin/users'), className: "w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-800/50 text-purple-100 text-sm sm:text-base rounded-lg hover:bg-purple-800 transition-colors", children: "\u30E6\u30FC\u30B6\u30FC\u7BA1\u7406" }), _jsx("button", { onClick: () => navigate('/admin/settings'), className: "w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-800/50 text-purple-100 text-sm sm:text-base rounded-lg hover:bg-purple-800 transition-colors", children: "\u30B7\u30B9\u30C6\u30E0\u8A2D\u5B9A" })] })] })] }), _jsxs("div", { className: "bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 sm:p-6", children: [_jsx("h2", { className: "text-lg sm:text-xl font-bold text-purple-100 mb-3 sm:mb-4", children: "\u6700\u8FD1\u306E\u30A2\u30AF\u30C6\u30A3\u30D3\u30C6\u30A3" }), loading ? (_jsx("p", { className: "text-sm sm:text-base text-purple-200", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." })) : (_jsx("div", { className: "space-y-3 sm:space-y-4", children: _jsx("p", { className: "text-sm sm:text-base text-purple-200", children: "\u30A2\u30AF\u30C6\u30A3\u30D3\u30C6\u30A3\u30ED\u30B0\u306F\u307E\u3060\u5B9F\u88C5\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002" }) }))] })] }) }));
}
