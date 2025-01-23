import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
const defaultSettings = {
    maintenance: {
        enabled: false,
        message: 'システムメンテナンス中です。ご不便をおかけして申し訳ありません。',
    },
    features: {
        tarot: true,
        astrology: true,
        numerology: true,
        palmistry: true,
        dream: true,
        animal: true,
        fourPillars: true,
    },
    subscription: {
        trial: {
            enabled: true,
            durationDays: 7,
        },
        prices: {
            basic: 4980,
            premium: 9800,
        },
    },
    notifications: {
        enabled: true,
        types: {
            email: true,
            push: false,
        },
    },
};
export default function AdminSettings() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [settings, setSettings] = useState(defaultSettings);
    const [saving, setSaving] = useState(false);
    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: 実際のAPIエンドポイントで設定を保存
            // await fetch('/api/admin/settings', {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(settings),
            // });
            await new Promise(resolve => setTimeout(resolve, 1000)); // 保存の模擬
            alert('設定を保存しました。');
        }
        catch (error) {
            console.error('Failed to save settings:', error);
            alert('設定の保存に失敗しました。');
        }
        finally {
            setSaving(false);
        }
    };
    const handleReset = () => {
        if (window.confirm('設定をデフォルトに戻してもよろしいですか？')) {
            setSettings(defaultSettings);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900", children: _jsxs("div", { className: "container mx-auto px-4 py-6 sm:py-8 lg:py-12", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8 lg:mb-12", children: [_jsxs("button", { onClick: () => navigate('/admin'), className: "flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-800/50 text-purple-100 text-sm sm:text-base rounded-lg hover:bg-purple-800 transition-colors", children: [_jsx(ArrowLeft, { size: 16, className: "sm:w-5 sm:h-5" }), "\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u306B\u623B\u308B"] }), _jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-amber-200", children: "\u30B7\u30B9\u30C6\u30E0\u8A2D\u5B9A" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: [_jsxs("div", { className: "bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 sm:p-6", children: [_jsx("h2", { className: "text-lg sm:text-xl font-bold text-purple-100 mb-3 sm:mb-4", children: "\u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\u30E2\u30FC\u30C9" }), _jsxs("div", { className: "space-y-3 sm:space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "maintenance-enabled", checked: settings.maintenance.enabled, onChange: (e) => setSettings({
                                                        ...settings,
                                                        maintenance: {
                                                            ...settings.maintenance,
                                                            enabled: e.target.checked,
                                                        },
                                                    }), className: "w-4 h-4 bg-purple-800 border-purple-700 rounded" }), _jsx("label", { htmlFor: "maintenance-enabled", className: "text-sm sm:text-base text-purple-200", children: "\u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\u30E2\u30FC\u30C9\u3092\u6709\u52B9\u306B\u3059\u308B" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm sm:text-base font-medium text-purple-200 mb-1", children: "\u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\u30E1\u30C3\u30BB\u30FC\u30B8" }), _jsx("textarea", { value: settings.maintenance.message, onChange: (e) => setSettings({
                                                        ...settings,
                                                        maintenance: {
                                                            ...settings.maintenance,
                                                            message: e.target.value,
                                                        },
                                                    }), className: "w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-800/50 border border-purple-700 rounded-lg text-sm sm:text-base text-purple-100 placeholder-purple-400", rows: 3 })] })] })] }), _jsxs("div", { className: "bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 sm:p-6", children: [_jsx("h2", { className: "text-lg sm:text-xl font-bold text-purple-100 mb-3 sm:mb-4", children: "\u6A5F\u80FD\u306E\u6709\u52B9/\u7121\u52B9" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4", children: Object.entries(settings.features).map(([key, value]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: `feature-${key}`, checked: value, onChange: (e) => setSettings({
                                                    ...settings,
                                                    features: {
                                                        ...settings.features,
                                                        [key]: e.target.checked,
                                                    },
                                                }), className: "w-4 h-4 bg-purple-800 border-purple-700 rounded" }), _jsxs("label", { htmlFor: `feature-${key}`, className: "text-sm sm:text-base text-purple-200", children: [key === 'tarot' && 'タロット占い', key === 'astrology' && '星占い', key === 'numerology' && '数秘術', key === 'palmistry' && '手相占い', key === 'dream' && '夢占い', key === 'animal' && '動物占い', key === 'fourPillars' && '四柱推命'] })] }, key))) })] }), _jsxs("div", { className: "bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 sm:p-6", children: [_jsx("h2", { className: "text-lg sm:text-xl font-bold text-purple-100 mb-3 sm:mb-4", children: "\u30B5\u30D6\u30B9\u30AF\u30EA\u30D7\u30B7\u30E7\u30F3\u8A2D\u5B9A" }), _jsxs("div", { className: "space-y-3 sm:space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("input", { type: "checkbox", id: "trial-enabled", checked: settings.subscription.trial.enabled, onChange: (e) => setSettings({
                                                                ...settings,
                                                                subscription: {
                                                                    ...settings.subscription,
                                                                    trial: {
                                                                        ...settings.subscription.trial,
                                                                        enabled: e.target.checked,
                                                                    },
                                                                },
                                                            }), className: "w-4 h-4 bg-purple-800 border-purple-700 rounded" }), _jsx("label", { htmlFor: "trial-enabled", className: "text-sm sm:text-base text-purple-200", children: "\u7121\u6599\u30C8\u30E9\u30A4\u30A2\u30EB\u3092\u6709\u52B9\u306B\u3059\u308B" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "number", value: settings.subscription.trial.durationDays, onChange: (e) => setSettings({
                                                                ...settings,
                                                                subscription: {
                                                                    ...settings.subscription,
                                                                    trial: {
                                                                        ...settings.subscription.trial,
                                                                        durationDays: parseInt(e.target.value),
                                                                    },
                                                                },
                                                            }), className: "w-20 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-800/50 border border-purple-700 rounded text-sm sm:text-base text-purple-100", min: 1, max: 30 }), _jsx("span", { className: "text-sm sm:text-base text-purple-200", children: "\u65E5\u9593" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm sm:text-base font-medium text-purple-200 mb-1", children: "\u30D9\u30FC\u30B7\u30C3\u30AF\u30D7\u30E9\u30F3\u6599\u91D1" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm sm:text-base text-purple-200", children: "\u00A5" }), _jsx("input", { type: "number", value: settings.subscription.prices.basic, onChange: (e) => setSettings({
                                                                ...settings,
                                                                subscription: {
                                                                    ...settings.subscription,
                                                                    prices: {
                                                                        ...settings.subscription.prices,
                                                                        basic: parseInt(e.target.value),
                                                                    },
                                                                },
                                                            }), className: "w-32 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-800/50 border border-purple-700 rounded text-sm sm:text-base text-purple-100", min: 0, step: 100 }), _jsx("span", { className: "text-sm sm:text-base text-purple-200", children: "/\u6708" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm sm:text-base font-medium text-purple-200 mb-1", children: "\u30D7\u30EC\u30DF\u30A2\u30E0\u30D7\u30E9\u30F3\u6599\u91D1" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm sm:text-base text-purple-200", children: "\u00A5" }), _jsx("input", { type: "number", value: settings.subscription.prices.premium, onChange: (e) => setSettings({
                                                                ...settings,
                                                                subscription: {
                                                                    ...settings.subscription,
                                                                    prices: {
                                                                        ...settings.subscription.prices,
                                                                        premium: parseInt(e.target.value),
                                                                    },
                                                                },
                                                            }), className: "w-32 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-800/50 border border-purple-700 rounded text-sm sm:text-base text-purple-100", min: 0, step: 100 }), _jsx("span", { className: "text-sm sm:text-base text-purple-200", children: "/\u6708" })] })] })] })] }), _jsxs("div", { className: "bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 sm:p-6", children: [_jsx("h2", { className: "text-lg sm:text-xl font-bold text-purple-100 mb-3 sm:mb-4", children: "\u901A\u77E5\u8A2D\u5B9A" }), _jsxs("div", { className: "space-y-3 sm:space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "notifications-enabled", checked: settings.notifications.enabled, onChange: (e) => setSettings({
                                                        ...settings,
                                                        notifications: {
                                                            ...settings.notifications,
                                                            enabled: e.target.checked,
                                                        },
                                                    }), className: "w-4 h-4 bg-purple-800 border-purple-700 rounded" }), _jsx("label", { htmlFor: "notifications-enabled", className: "text-sm sm:text-base text-purple-200", children: "\u901A\u77E5\u3092\u6709\u52B9\u306B\u3059\u308B" })] }), settings.notifications.enabled && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "notifications-email", checked: settings.notifications.types.email, onChange: (e) => setSettings({
                                                                ...settings,
                                                                notifications: {
                                                                    ...settings.notifications,
                                                                    types: {
                                                                        ...settings.notifications.types,
                                                                        email: e.target.checked,
                                                                    },
                                                                },
                                                            }), className: "w-4 h-4 bg-purple-800 border-purple-700 rounded" }), _jsx("label", { htmlFor: "notifications-email", className: "text-sm sm:text-base text-purple-200", children: "\u30E1\u30FC\u30EB\u901A\u77E5" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "notifications-push", checked: settings.notifications.types.push, onChange: (e) => setSettings({
                                                                ...settings,
                                                                notifications: {
                                                                    ...settings.notifications,
                                                                    types: {
                                                                        ...settings.notifications.types,
                                                                        push: e.target.checked,
                                                                    },
                                                                },
                                                            }), className: "w-4 h-4 bg-purple-800 border-purple-700 rounded" }), _jsx("label", { htmlFor: "notifications-push", className: "text-sm sm:text-base text-purple-200", children: "\u30D7\u30C3\u30B7\u30E5\u901A\u77E5" })] })] }))] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8", children: [_jsxs("button", { onClick: handleReset, className: "flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600 text-white text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors", children: [_jsx(RefreshCw, { size: 16, className: "sm:w-5 sm:h-5" }), "\u30C7\u30D5\u30A9\u30EB\u30C8\u306B\u623B\u3059"] }), _jsxs("button", { onClick: handleSave, disabled: saving, className: "flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white text-sm sm:text-base rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50", children: [_jsx(Save, { size: 16, className: "sm:w-5 sm:h-5" }), saving ? '保存中...' : '設定を保存'] })] })] }) }));
}
