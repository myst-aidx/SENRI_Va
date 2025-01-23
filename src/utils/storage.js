// ストレージのキー
const STORAGE_KEY = 'fortune_readings';
// 結果を保存
export function saveReading(reading) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored
            ? JSON.parse(stored)
            : { readings: [], lastUpdated: new Date().toISOString() };
        // 新しい結果を追加
        data.readings.unshift(reading);
        // 最大100件まで保存
        if (data.readings.length > 100) {
            data.readings = data.readings.slice(0, 100);
        }
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    catch (error) {
        console.error('結果の保存に失敗しました:', error);
        throw new Error('結果の保存に失敗しました');
    }
}
// 保存された結果を取得
export function getReadings() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored)
            return [];
        const data = JSON.parse(stored);
        return data.readings;
    }
    catch (error) {
        console.error('保存された結果の取得に失敗しました:', error);
        return [];
    }
}
// 特定の種類の結果のみを取得
export function getReadingsByType(type) {
    return getReadings().filter(reading => reading.type === type);
}
// 結果を削除
export function deleteReading(timestamp) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored)
            return;
        const data = JSON.parse(stored);
        data.readings = data.readings.filter(reading => reading.timestamp !== timestamp);
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    catch (error) {
        console.error('結果の削除に失敗しました:', error);
        throw new Error('結果の削除に失敗しました');
    }
}
// 全ての結果を削除
export function clearReadings() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    }
    catch (error) {
        console.error('結果の全削除に失敗しました:', error);
        throw new Error('結果の全削除に失敗しました');
    }
}
/**
 * 占い履歴のストレージ管理クラス
 */
export class FortuneHistoryStorage {
    constructor() {
        Object.defineProperty(this, "STORAGE_KEY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'fortune_histories'
        });
    }
    /**
     * 全ての履歴を保存
     */
    async saveHistories(histories) {
        try {
            const data = JSON.stringify(Array.from(histories.entries()));
            localStorage.setItem(this.STORAGE_KEY, data);
        }
        catch (error) {
            console.error('履歴の保存に失敗しました:', error);
            throw error;
        }
    }
    /**
     * 全ての履歴を読み込み
     */
    async loadHistories() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data)
                return new Map();
            const entries = JSON.parse(data);
            return new Map(entries);
        }
        catch (error) {
            console.error('履歴の読み込みに失敗しました:', error);
            return new Map();
        }
    }
    /**
     * 特定ユーザーの履歴を保存
     */
    async saveUserHistory(userId, history) {
        try {
            const histories = await this.loadHistories();
            histories.set(userId, history);
            await this.saveHistories(histories);
        }
        catch (error) {
            console.error(`ユーザー ${userId} の履歴の保存に失敗しました:`, error);
            throw error;
        }
    }
    /**
     * 特定ユーザーの履歴を削除
     */
    async deleteUserHistory(userId) {
        try {
            const histories = await this.loadHistories();
            histories.delete(userId);
            await this.saveHistories(histories);
        }
        catch (error) {
            console.error(`ユーザー ${userId} の履歴の削除に失敗しました:`, error);
            throw error;
        }
    }
    /**
     * 全ての履歴を削除
     */
    async clearAllHistories() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        }
        catch (error) {
            console.error('履歴の全削除に失敗しました:', error);
            throw error;
        }
    }
}
