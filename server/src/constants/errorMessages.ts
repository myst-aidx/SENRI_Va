import { ErrorType } from '../types/errors';

interface ErrorMessageType {
    ja: string;
    en: string;
}

interface ErrorMessagesType {
    [key: string]: ErrorMessageType;
}

const ErrorMessages: ErrorMessagesType = {
    [ErrorType.VALIDATION]: {
        ja: "入力内容が正しくありません。",
        en: "Invalid input."
    },
    [ErrorType.AUTHENTICATION]: {
        ja: "認証に失敗しました。",
        en: "Authentication failed."
    },
    [ErrorType.AUTHORIZATION]: {
        ja: "アクセス権限がありません。",
        en: "Access denied."
    },
    [ErrorType.NOT_FOUND]: {
        ja: "リソースが見つかりません。",
        en: "Resource not found."
    },
    [ErrorType.DUPLICATE]: {
        ja: "リソースが既に存在します。",
        en: "Resource already exists."
    },
    [ErrorType.NETWORK]: {
        ja: "ネットワークエラーが発生しました。",
        en: "Network error occurred."
    },
    [ErrorType.SERVER]: {
        ja: "サーバーエラーが発生しました。",
        en: "Internal server error occurred."
    },
    [ErrorType.UNKNOWN]: {
        ja: "予期せぬエラーが発生しました。",
        en: "An unexpected error occurred."
    }
};

const getErrorMessage = (type: ErrorType, language: 'ja' | 'en' = 'ja'): string => {
    return ErrorMessages[type][language];
};

export { 
    ErrorMessages,
    getErrorMessage,
    ErrorMessageType,
    ErrorMessagesType
}; 