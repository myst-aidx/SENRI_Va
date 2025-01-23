import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { LogOut } from 'lucide-react';
export default function Header() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = async () => {
        await logout();
        navigate('/');
    };
    // ログインページとサインアップページではヘッダーのログインボタンを表示しない
    const hideAuthButtons = ['/login', '/signup'].includes(location.pathname);
    return (_jsx("header", { className: "bg-purple-900/50 backdrop-blur-sm border-b border-purple-800/30", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx(Link, { to: "/", className: "text-xl font-bold text-white", children: "Fortune Teller" }), _jsx("div", { className: "flex items-center gap-4", children: isAuthenticated ? (_jsxs("button", { onClick: handleLogout, className: "bg-transparent hover:bg-purple-800/30 text-white font-bold py-2 px-4 rounded-lg border border-purple-400 transition-colors flex items-center gap-2", children: [_jsx(LogOut, { className: "w-5 h-5" }), "\u30ED\u30B0\u30A2\u30A6\u30C8"] })) : !hideAuthButtons && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link, { to: "/signup", className: "bg-transparent hover:bg-purple-800/30 text-white font-bold py-2 px-4 rounded-lg border border-purple-400 transition-colors", children: "\u65B0\u898F\u767B\u9332" }), _jsx(Link, { to: "/login", className: "bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors", children: "\u30ED\u30B0\u30A4\u30F3" })] })) })] }) }) }));
}
