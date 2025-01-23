export class PreferencesManager {
    constructor() {
        Object.defineProperty(this, "STORAGE_KEY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'fortune_app_preferences'
        });
        Object.defineProperty(this, "preferences", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.loadPreferences();
    }
    // デフォルト設定を生成
    createDefaultPreferences() {
        return {
            general: {
                interpretationStyle: 'detailed',
                culturalContext: 'japanese'
            },
            notifications: {
                daily: true,
                weekly: true,
                monthly: true,
                startHour: 9,
                endHour: 21,
                channels: {
                    email: false,
                    browser: true,
                    mobile: false
                }
            },
            display: {
                theme: 'auto',
                fontSize: 'medium',
                showImages: true,
                compactView: false
            },
            privacy: {
                shareHistory: false,
                allowAnalytics: true,
                storageDuration: '6months'
            },
            fortune: {
                defaultType: 'tarot',
                customKeywords: []
            }
        };
    }
    // 設定を保存
    savePreferences() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.preferences.entries())));
        }
        catch (error) {
            console.error('Failed to save preferences:', error);
            throw new Error('設定の保存に失敗しました');
        }
    }
    // 設定を読み込み
    loadPreferences() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.preferences = new Map(JSON.parse(stored));
            }
        }
        catch (error) {
            console.error('Failed to load preferences:', error);
            throw new Error('設定の読み込みに失敗しました');
        }
    }
    // ユーザーの設定を取得
    getUserPreferences(userId) {
        if (!this.preferences.has(userId)) {
            this.preferences.set(userId, this.createDefaultPreferences());
            this.savePreferences();
        }
        return this.preferences.get(userId);
    }
    // 設定を更新
    async updatePreferences(userId, updates) {
        try {
            const current = this.getUserPreferences(userId);
            const updated = {
                ...current,
                ...updates,
                general: { ...current.general, ...updates.general },
                notifications: { ...current.notifications, ...updates.notifications },
                display: { ...current.display, ...updates.display },
                privacy: { ...current.privacy, ...updates.privacy },
                fortune: { ...current.fortune, ...updates.fortune }
            };
            this.preferences.set(userId, updated);
            this.savePreferences();
        }
        catch (error) {
            console.error('Failed to update preferences:', error);
            throw new Error('設定の更新に失敗しました');
        }
    }
    // 通知設定に基づいて通知を送るべきかを判断
    shouldNotify(userId, type) {
        const prefs = this.getUserPreferences(userId);
        if (!prefs.notifications[type])
            return false;
        const now = new Date();
        const hour = now.getHours();
        return hour >= prefs.notifications.startHour && hour <= prefs.notifications.endHour;
    }
    // 解釈オプションを生成
    getInterpretationOptions(userId) {
        const prefs = this.getUserPreferences(userId);
        return {
            style: prefs.general.interpretationStyle,
            context: prefs.general.culturalContext
        };
    }
}
