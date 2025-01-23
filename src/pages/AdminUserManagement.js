import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Edit, Trash2, ArrowLeft, Shield, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { UserRole } from '../types/user';
export default function AdminUserManagement() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    useEffect(() => {
        // TODO: 実際のAPIエンドポイントからユーザーデータを取得
        const fetchUsers = async () => {
            try {
                // const response = await fetch('/api/admin/users');
                // const data = await response.json();
                // setUsers(data);
                setLoading(false);
            }
            catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('このユーザーを削除してもよろしいですか？')) {
            return;
        }
        try {
            // TODO: 実際のAPIエンドポイントでユーザー削除を実装
            // await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
            setUsers(users.filter(u => u.id !== userId));
        }
        catch (error) {
            console.error('Failed to delete user:', error);
        }
    };
    const handleUpdateUser = async (updatedUser) => {
        try {
            // TODO: 実際のAPIエンドポイントでユーザー更新を実装
            // await fetch(`/api/admin/users/${updatedUser.id}`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(updatedUser),
            // });
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setShowEditModal(false);
        }
        catch (error) {
            console.error('Failed to update user:', error);
        }
    };
    const handleToggleSubscription = async (userId, isSubscribed) => {
        try {
            // TODO: 実際のAPIエンドポイントでサブスクリプション状態の更新を実装
            // await fetch(`/api/admin/users/${userId}/subscription`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ isSubscribed }),
            // });
            setUsers(users.map(u => u.id === userId ? { ...u, isSubscribed } : u));
        }
        catch (error) {
            console.error('Failed to update subscription:', error);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900", children: _jsxs("div", { className: "container mx-auto px-4 py-6 sm:py-8 lg:py-12", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8 lg:mb-12", children: [_jsxs("button", { onClick: () => navigate('/admin'), className: "flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-800/50 text-purple-100 text-sm sm:text-base rounded-lg hover:bg-purple-800 transition-colors", children: [_jsx(ArrowLeft, { size: 16, className: "sm:w-5 sm:h-5" }), "\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u306B\u623B\u308B"] }), _jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-amber-200", children: "\u30E6\u30FC\u30B6\u30FC\u7BA1\u7406" })] }), loading ? (_jsx("div", { className: "text-center py-6 sm:py-8", children: _jsx("p", { className: "text-sm sm:text-base text-purple-200", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." }) })) : (_jsx("div", { className: "bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 sm:p-6", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[800px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-purple-700/50", children: [_jsx("th", { className: "px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-purple-200", children: "ID" }), _jsx("th", { className: "px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-purple-200", children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx("th", { className: "px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-purple-200", children: "\u30ED\u30FC\u30EB" }), _jsx("th", { className: "px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-purple-200", children: "\u30B5\u30D6\u30B9\u30AF\u30EA\u30D7\u30B7\u30E7\u30F3" }), _jsx("th", { className: "px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-purple-200", children: "\u4F5C\u6210\u65E5" }), _jsx("th", { className: "px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm text-purple-200", children: "\u30A2\u30AF\u30B7\u30E7\u30F3" })] }) }), _jsx("tbody", { children: users.map(user => (_jsxs("tr", { className: "border-b border-purple-700/30", children: [_jsx("td", { className: "px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-purple-200", children: user.id }), _jsx("td", { className: "px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-purple-200", children: user.email }), _jsx("td", { className: "px-3 sm:px-4 py-2 sm:py-3", children: _jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm ${user.role === UserRole.ADMIN
                                                        ? 'bg-red-500/20 text-red-300'
                                                        : user.role === UserRole.TEST_USER
                                                            ? 'bg-yellow-500/20 text-yellow-300'
                                                            : 'bg-blue-500/20 text-blue-300'}`, children: [user.role === UserRole.ADMIN && _jsx(Shield, { size: 12, className: "sm:w-4 sm:h-4" }), user.role === UserRole.TEST_USER && _jsx(UserIcon, { size: 12, className: "sm:w-4 sm:h-4" }), user.role === UserRole.USER && _jsx(UserCheck, { size: 12, className: "sm:w-4 sm:h-4" }), user.role] }) }), _jsx("td", { className: "px-3 sm:px-4 py-2 sm:py-3", children: _jsxs("button", { onClick: () => handleToggleSubscription(user.id, !user.isSubscribed), className: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm ${user.isSubscribed
                                                        ? 'bg-green-500/20 text-green-300'
                                                        : 'bg-gray-500/20 text-gray-300'}`, children: [user.isSubscribed ? _jsx(UserCheck, { size: 12, className: "sm:w-4 sm:h-4" }) : _jsx(UserX, { size: 12, className: "sm:w-4 sm:h-4" }), user.isSubscribed ? '有効' : '無効'] }) }), _jsx("td", { className: "px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-purple-200", children: new Date(user.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-3 sm:px-4 py-2 sm:py-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-1 sm:gap-2", children: [_jsx("button", { onClick: () => handleEditUser(user), className: "p-1 text-purple-300 hover:text-purple-100 transition-colors", children: _jsx(Edit, { size: 16, className: "sm:w-[18px] sm:h-[18px]" }) }), _jsx("button", { onClick: () => handleDeleteUser(user.id), className: "p-1 text-purple-300 hover:text-red-400 transition-colors", children: _jsx(Trash2, { size: 16, className: "sm:w-[18px] sm:h-[18px]" }) })] }) })] }, user.id))) })] }) }) })), showEditModal && selectedUser && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-purple-900 border border-purple-700 rounded-xl p-4 sm:p-6 w-full max-w-md", children: [_jsx("h2", { className: "text-lg sm:text-xl font-bold text-purple-100 mb-3 sm:mb-4", children: "\u30E6\u30FC\u30B6\u30FC\u7DE8\u96C6" }), _jsxs("form", { onSubmit: (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const updatedUser = {
                                        ...selectedUser,
                                        email: formData.get('email'),
                                        role: formData.get('role'),
                                        isSubscribed: formData.get('isSubscribed') === 'true',
                                    };
                                    handleUpdateUser(updatedUser);
                                }, className: "space-y-3 sm:space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm sm:text-base font-medium text-purple-200 mb-1", children: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" }), _jsx("input", { type: "email", name: "email", defaultValue: selectedUser.email, className: "w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-800/50 border border-purple-700 rounded-lg text-sm sm:text-base text-purple-100 placeholder-purple-400", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm sm:text-base font-medium text-purple-200 mb-1", children: "\u30ED\u30FC\u30EB" }), _jsxs("select", { name: "role", defaultValue: selectedUser.role, className: "w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-800/50 border border-purple-700 rounded-lg text-sm sm:text-base text-purple-100", children: [_jsx("option", { value: UserRole.USER, children: "\u30E6\u30FC\u30B6\u30FC" }), _jsx("option", { value: UserRole.TEST_USER, children: "\u30C6\u30B9\u30C8\u30E6\u30FC\u30B6\u30FC" }), _jsx("option", { value: UserRole.ADMIN, children: "\u7BA1\u7406\u8005" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm sm:text-base font-medium text-purple-200 mb-1", children: "\u30B5\u30D6\u30B9\u30AF\u30EA\u30D7\u30B7\u30E7\u30F3" }), _jsxs("select", { name: "isSubscribed", defaultValue: String(selectedUser.isSubscribed), className: "w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-800/50 border border-purple-700 rounded-lg text-sm sm:text-base text-purple-100", children: [_jsx("option", { value: "true", children: "\u6709\u52B9" }), _jsx("option", { value: "false", children: "\u7121\u52B9" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 sm:gap-4", children: [_jsx("button", { type: "button", onClick: () => setShowEditModal(false), className: "px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-purple-200 hover:text-purple-100 transition-colors", children: "\u30AD\u30E3\u30F3\u30BB\u30EB" }), _jsx("button", { type: "submit", className: "px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-sm sm:text-base text-purple-100 rounded-lg hover:bg-purple-500 transition-colors", children: "\u4FDD\u5B58" })] })] })] }) }))] }) }));
}
