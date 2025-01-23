import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { PreferencesManager } from '../../utils/preferences';
import './SettingsPanel.css';
export const SettingsPanel = ({ userId, onClose }) => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [preferences, setPreferences] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const preferencesManager = new PreferencesManager();
    useEffect(() => {
        loadPreferences();
    }, [userId]);
    const loadPreferences = async () => {
        try {
            setIsLoading(true);
            const userPrefs = await preferencesManager.getUserPreferences(userId);
            setPreferences(userPrefs);
            setError(null);
        }
        catch (err) {
            setError('設定の読み込みに失敗しました');
        }
        finally {
            setIsLoading(false);
        }
    };
    const savePreferences = async (updates) => {
        try {
            setIsSaving(true);
            await preferencesManager.updatePreferences(userId, updates);
            setPreferences({ ...preferences, ...updates });
            setError(null);
        }
        catch (err) {
            setError('設定の保存に失敗しました');
        }
        finally {
            setIsSaving(false);
        }
    };
    const resetCategory = async () => {
        try {
            setIsSaving(true);
            const defaultPrefs = preferencesManager.createDefaultPreferences();
            const categoryPrefs = defaultPrefs[activeCategory];
            await savePreferences({ [activeCategory]: categoryPrefs });
        }
        catch (err) {
            setError('設定のリセットに失敗しました');
        }
        finally {
            setIsSaving(false);
        }
    };
    const resetAllPreferences = async () => {
        try {
            setIsSaving(true);
            const defaultPrefs = preferencesManager.createDefaultPreferences();
            await preferencesManager.updatePreferences(userId, defaultPrefs);
            setPreferences(defaultPrefs);
            setError(null);
        }
        catch (err) {
            setError('全設定のリセットに失敗しました');
        }
        finally {
            setIsSaving(false);
        }
    };
    if (isLoading) {
        return _jsx("div", { className: "settings-panel", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    }
    return (_jsxs("div", { className: "settings-panel", children: [_jsxs("div", { className: "settings-header", children: [_jsx("h2", { children: "\u8A2D\u5B9A" }), _jsx("button", { className: "close-button", onClick: onClose, children: "\u9589\u3058\u308B" })] }), error && _jsx("div", { className: "settings-error", children: error }), _jsx("nav", { className: "settings-nav", children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("button", { className: activeCategory === 'general' ? 'active' : '', onClick: () => setActiveCategory('general'), children: "\u4E00\u822C" }) }), _jsx("li", { children: _jsx("button", { className: activeCategory === 'notifications' ? 'active' : '', onClick: () => setActiveCategory('notifications'), children: "\u901A\u77E5" }) }), _jsx("li", { children: _jsx("button", { className: activeCategory === 'display' ? 'active' : '', onClick: () => setActiveCategory('display'), children: "\u8868\u793A" }) }), _jsx("li", { children: _jsx("button", { className: activeCategory === 'privacy' ? 'active' : '', onClick: () => setActiveCategory('privacy'), children: "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC" }) }), _jsx("li", { children: _jsx("button", { className: activeCategory === 'fortune' ? 'active' : '', onClick: () => setActiveCategory('fortune'), children: "\u5360\u3044" }) })] }) }), _jsxs("div", { className: "settings-content", children: [activeCategory === 'general' && (_jsxs("section", { className: "settings-section", children: [_jsx("h3", { children: "\u4E00\u822C\u8A2D\u5B9A" }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u89E3\u91C8\u30B9\u30BF\u30A4\u30EB" }), _jsxs("select", { value: preferences.general.interpretationStyle, onChange: (e) => savePreferences({
                                            general: { ...preferences.general, interpretationStyle: e.target.value }
                                        }), children: [_jsx("option", { value: "detailed", children: "\u8A73\u7D30" }), _jsx("option", { value: "concise", children: "\u7C21\u6F54" }), _jsx("option", { value: "poetic", children: "\u8A69\u7684" })] })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u6587\u5316\u7684\u30B3\u30F3\u30C6\u30AD\u30B9\u30C8" }), _jsxs("select", { value: preferences.general.culturalContext, onChange: (e) => savePreferences({
                                            general: { ...preferences.general, culturalContext: e.target.value }
                                        }), children: [_jsx("option", { value: "japanese", children: "\u65E5\u672C" }), _jsx("option", { value: "western", children: "\u897F\u6D0B" }), _jsx("option", { value: "chinese", children: "\u4E2D\u56FD" })] })] })] })), activeCategory === 'notifications' && (_jsxs("section", { className: "settings-section", children: [_jsx("h3", { children: "\u901A\u77E5\u8A2D\u5B9A" }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u901A\u77E5\u30BF\u30A4\u30DF\u30F3\u30B0" }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.notifications.daily, onChange: (e) => savePreferences({
                                                    notifications: { ...preferences.notifications, daily: e.target.checked }
                                                }) }), "\u6BCE\u65E5\u306E\u904B\u52E2"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.notifications.weekly, onChange: (e) => savePreferences({
                                                    notifications: { ...preferences.notifications, weekly: e.target.checked }
                                                }) }), "\u9031\u9593\u306E\u904B\u52E2"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.notifications.monthly, onChange: (e) => savePreferences({
                                                    notifications: { ...preferences.notifications, monthly: e.target.checked }
                                                }) }), "\u6708\u9593\u306E\u904B\u52E2"] })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u901A\u77E5\u6642\u9593" }), _jsxs("div", { className: "time-range", children: [_jsx("input", { type: "number", min: "0", max: "23", value: preferences.notifications.startHour, onChange: (e) => savePreferences({
                                                    notifications: { ...preferences.notifications, startHour: parseInt(e.target.value) }
                                                }) }), _jsx("span", { children: "\u6642 \uFF5E" }), _jsx("input", { type: "number", min: "0", max: "23", value: preferences.notifications.endHour, onChange: (e) => savePreferences({
                                                    notifications: { ...preferences.notifications, endHour: parseInt(e.target.value) }
                                                }) }), _jsx("span", { children: "\u6642" })] })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u901A\u77E5\u30C1\u30E3\u30F3\u30CD\u30EB" }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.notifications.channels.email, onChange: (e) => savePreferences({
                                                    notifications: {
                                                        ...preferences.notifications,
                                                        channels: { ...preferences.notifications.channels, email: e.target.checked }
                                                    }
                                                }) }), "\u30E1\u30FC\u30EB"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.notifications.channels.browser, onChange: (e) => savePreferences({
                                                    notifications: {
                                                        ...preferences.notifications,
                                                        channels: { ...preferences.notifications.channels, browser: e.target.checked }
                                                    }
                                                }) }), "\u30D6\u30E9\u30A6\u30B6\u901A\u77E5"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.notifications.channels.mobile, onChange: (e) => savePreferences({
                                                    notifications: {
                                                        ...preferences.notifications,
                                                        channels: { ...preferences.notifications.channels, mobile: e.target.checked }
                                                    }
                                                }) }), "\u30E2\u30D0\u30A4\u30EB\u901A\u77E5"] })] })] })), activeCategory === 'display' && (_jsxs("section", { className: "settings-section", children: [_jsx("h3", { children: "\u8868\u793A\u8A2D\u5B9A" }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u30C6\u30FC\u30DE" }), _jsxs("select", { value: preferences.display.theme, onChange: (e) => savePreferences({
                                            display: { ...preferences.display, theme: e.target.value }
                                        }), children: [_jsx("option", { value: "light", children: "\u30E9\u30A4\u30C8" }), _jsx("option", { value: "dark", children: "\u30C0\u30FC\u30AF" }), _jsx("option", { value: "auto", children: "\u30B7\u30B9\u30C6\u30E0\u8A2D\u5B9A\u306B\u5F93\u3046" })] })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u30D5\u30A9\u30F3\u30C8\u30B5\u30A4\u30BA" }), _jsxs("select", { value: preferences.display.fontSize, onChange: (e) => savePreferences({
                                            display: { ...preferences.display, fontSize: e.target.value }
                                        }), children: [_jsx("option", { value: "small", children: "\u5C0F" }), _jsx("option", { value: "medium", children: "\u4E2D" }), _jsx("option", { value: "large", children: "\u5927" })] })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u305D\u306E\u4ED6\u306E\u8868\u793A\u30AA\u30D7\u30B7\u30E7\u30F3" }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.display.showImages, onChange: (e) => savePreferences({
                                                    display: { ...preferences.display, showImages: e.target.checked }
                                                }) }), "\u753B\u50CF\u3092\u8868\u793A"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.display.compactView, onChange: (e) => savePreferences({
                                                    display: { ...preferences.display, compactView: e.target.checked }
                                                }) }), "\u30B3\u30F3\u30D1\u30AF\u30C8\u8868\u793A"] })] })] })), activeCategory === 'privacy' && (_jsxs("section", { className: "settings-section", children: [_jsx("h3", { children: "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u8A2D\u5B9A" }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u5C65\u6B74\u306E\u5171\u6709" }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.privacy.shareHistory, onChange: (e) => savePreferences({
                                                    privacy: { ...preferences.privacy, shareHistory: e.target.checked }
                                                }) }), "\u5360\u3044\u7D50\u679C\u306E\u533F\u540D\u30C7\u30FC\u30BF\u3092\u5171\u6709\u3057\u3066\u7CBE\u5EA6\u5411\u4E0A\u306B\u8CA2\u732E\u3059\u308B"] })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u5206\u6790\u306E\u8A31\u53EF" }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: preferences.privacy.allowAnalytics, onChange: (e) => savePreferences({
                                                    privacy: { ...preferences.privacy, allowAnalytics: e.target.checked }
                                                }) }), "\u5229\u7528\u72B6\u6CC1\u306E\u5206\u6790\u3092\u8A31\u53EF\u3059\u308B"] })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u30C7\u30FC\u30BF\u306E\u4FDD\u5B58\u671F\u9593" }), _jsxs("select", { value: preferences.privacy.storageDuration, onChange: (e) => savePreferences({
                                            privacy: { ...preferences.privacy, storageDuration: e.target.value }
                                        }), children: [_jsx("option", { value: "1month", children: "1\u30F6\u6708" }), _jsx("option", { value: "3months", children: "3\u30F6\u6708" }), _jsx("option", { value: "6months", children: "6\u30F6\u6708" }), _jsx("option", { value: "1year", children: "1\u5E74" }), _jsx("option", { value: "forever", children: "\u6C38\u7D9A\u7684\u306B\u4FDD\u5B58" })] })] })] })), activeCategory === 'fortune' && (_jsxs("section", { className: "settings-section", children: [_jsx("h3", { children: "\u5360\u3044\u8A2D\u5B9A" }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u30C7\u30D5\u30A9\u30EB\u30C8\u306E\u5360\u3044\u7A2E\u985E" }), _jsxs("select", { value: preferences.fortune.defaultType, onChange: (e) => savePreferences({
                                            fortune: { ...preferences.fortune, defaultType: e.target.value }
                                        }), children: [_jsx("option", { value: "tarot", children: "\u30BF\u30ED\u30C3\u30C8" }), _jsx("option", { value: "palmistry", children: "\u624B\u76F8" }), _jsx("option", { value: "numerology", children: "\u6570\u79D8\u8853" }), _jsx("option", { value: "dream", children: "\u5922\u5360\u3044" })] })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h4", { children: "\u30AB\u30B9\u30BF\u30E0\u30AD\u30FC\u30EF\u30FC\u30C9" }), _jsx("div", { className: "keyword-list", children: preferences.fortune.customKeywords.map((keyword, index) => (_jsxs("div", { className: "keyword-item", children: [_jsx("span", { children: keyword }), _jsx("button", { onClick: () => {
                                                        const newKeywords = preferences.fortune.customKeywords.filter((_, i) => i !== index);
                                                        savePreferences({
                                                            fortune: { ...preferences.fortune, customKeywords: newKeywords }
                                                        });
                                                    }, children: "\u524A\u9664" })] }, index))) })] })] }))] }), _jsxs("div", { className: "settings-footer", children: [_jsx("button", { className: "reset-button", onClick: resetCategory, disabled: isSaving, children: "\u3053\u306E\u30AB\u30C6\u30B4\u30EA\u30FC\u3092\u30EA\u30BB\u30C3\u30C8" }), _jsx("button", { className: "reset-all-button", onClick: resetAllPreferences, disabled: isSaving, children: "\u5168\u8A2D\u5B9A\u3092\u30EA\u30BB\u30C3\u30C8" })] })] }));
};
