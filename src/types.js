// エラーコードの定義
export const ERROR_CODES = {
    // 共通エラー
    NETWORK_ERROR: 'NETWORK_ERROR',
    AI_ERROR: 'AI_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    // 数秘術のエラー
    INVALID_BIRTHDATE: 'INVALID_BIRTHDATE',
    INVALID_NAME: 'INVALID_NAME',
    // タロットのエラー
    INVALID_CARD: 'INVALID_CARD',
    INVALID_SPREAD: 'INVALID_SPREAD',
    // 手相のエラー
    INVALID_IMAGE: 'INVALID_IMAGE',
    IMAGE_PROCESSING_ERROR: 'IMAGE_PROCESSING_ERROR',
    // 夢占いのエラー
    INVALID_CONTENT: 'INVALID_CONTENT',
    CONTENT_TOO_LONG: 'CONTENT_TOO_LONG'
};
// 基本のエラークラス
export class FortuneError extends Error {
    constructor(message, code) {
        super(message);
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: code
        });
        this.name = 'FortuneError';
    }
}
// 数秘術のエラークラス
export class NumerologyError extends FortuneError {
    constructor(message, code) {
        super(message, code);
        this.name = 'NumerologyError';
    }
}
// タロットのエラークラス
export class TarotError extends FortuneError {
    constructor(message, code) {
        super(message, code);
        this.name = 'TarotError';
    }
}
// 手相のエラークラス
export class PalmError extends FortuneError {
    constructor(message, code) {
        super(message, code);
        this.name = 'PalmError';
    }
}
// 夢占いのエラークラス
export class DreamError extends FortuneError {
    constructor(message, code) {
        super(message, code);
        this.name = 'DreamError';
    }
}
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["TEST_USER"] = "test_user";
    UserRole["USER"] = "user";
    UserRole["GUEST"] = "guest";
})(UserRole || (UserRole = {}));
