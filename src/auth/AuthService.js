import { jwtDecode } from 'jwt-decode';
import { AUTH_CONSTANTS } from '../constants/auth';
import { ErrorType } from '../types/error';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30分
const SESSION_KEY = 'session_info';
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5分前にリフレッシュ
// セッション情報を保存
export function saveSessionInfo(token, refreshToken) {
    const sessionInfo = {
        token,
        refreshToken,
        expiresAt: new Date(Date.now() + AUTH_CONSTANTS.SESSION.DURATION).toISOString(),
        lastActivity: new Date().toISOString(),
        lastInteraction: new Date() // Initialize lastInteraction
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionInfo));
}
// セッション情報を取得
export function getSessionInfo() {
    try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (!stored)
            return null;
        return JSON.parse(stored);
    }
    catch (error) {
        console.error('Failed to parse session info:', error);
        clearSession();
        return null;
    }
}
// セッションの有効性をチェック
function isSessionValid() {
    const sessionInfo = getSessionInfo();
    if (!sessionInfo)
        return false;
    const now = Date.now();
    const isExpired = now >= new Date(sessionInfo.expiresAt).getTime(); //Fixed: getTime() should be called on Date object
    const isInactive = now - new Date(sessionInfo.lastActivity).getTime() > SESSION_TIMEOUT; //Fixed: getTime() should be called on Date object
    return !isExpired && !isInactive;
}
// リフレッシュが必要かチェック
function needsRefresh() {
    const sessionInfo = getSessionInfo();
    if (!sessionInfo)
        return false;
    const now = Date.now();
    return new Date(sessionInfo.expiresAt).getTime() - now <= REFRESH_THRESHOLD; //Fixed: getTime() should be called on Date object
}
// セッションの最終アクティビティを更新
function updateLastActivity() {
    const sessionInfo = getSessionInfo();
    if (sessionInfo) {
        sessionInfo.lastActivity = new Date().toISOString();
        sessionInfo.lastInteraction = new Date(); // Update lastInteraction
        try {
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionInfo));
        }
        catch (error) {
            console.error('Failed to update last activity:', error);
        }
    }
}
// セッションをクリア
export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}
export class ApiError extends Error {
    constructor(statusCode, message, type) {
        super(message);
        Object.defineProperty(this, "statusCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: statusCode
        });
        Object.defineProperty(this, "message", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: message
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: type
        });
        this.name = 'ApiError';
    }
}
export const handleError = (error) => {
    if (error instanceof ApiError) {
        return error;
    }
    return new ApiError(500, AUTH_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR, ErrorType.SERVER_ERROR);
};
export async function loginRequest(email, password) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ログインに失敗しました');
    }
    const data = await response.json();
    if (!data.token) {
        throw new Error('認証トークンが受信できませんでした');
    }
    return data;
}
export async function signupRequest(email, password) {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(response.status, errorData.message || AUTH_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR, ErrorType.SERVER_ERROR);
    }
    const data = await response.json();
    // セッション情報を保存
    saveSessionInfo(data.token, data.refreshToken);
    return {
        token: data.token,
        refreshToken: data.refreshToken,
        user: {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            isSubscribed: data.user.isSubscribed,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt
        }
    };
}
export async function refreshTokenRequest() {
    const sessionInfo = getSessionInfo();
    if (!sessionInfo?.refreshToken) {
        throw new ApiError(400, AUTH_CONSTANTS.ERROR_MESSAGES.REFRESH_TOKEN_MISSING, ErrorType.REFRESH_TOKEN_MISSING);
    }
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: sessionInfo.refreshToken }),
    });
    if (!response.ok) {
        await handleError(await response.json());
    }
    const data = await response.json();
    saveSessionInfo(data.token, data.refreshToken);
    return {
        token: data.token,
        refreshToken: data.refreshToken,
    };
}
export async function logoutRequest(token) {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(response.status, errorData.message || AUTH_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR, ErrorType.SERVER_ERROR);
    }
}
export function getCurrentUserFromToken(token) {
    try {
        if (!isSessionValid()) {
            clearSession();
            throw new ApiError(401, AUTH_CONSTANTS.ERROR_MESSAGES.SESSION_EXPIRED, ErrorType.SESSION_EXPIRED);
        }
        const decoded = jwtDecode(token);
        updateLastActivity();
        if (needsRefresh()) {
            refreshTokenRequest().catch(console.error);
        }
        return {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            isSubscribed: decoded.isSubscribed,
            subscriptionPlan: decoded.subscriptionPlan,
            createdAt: new Date(decoded.iat * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        return null;
    }
}
// セッションの有効性を確認
export async function validateSession(token) {
    try {
        if (!isSessionValid()) {
            clearSession();
            return false;
        }
        const response = await fetch(`${API_URL}/api/auth/validate`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            updateLastActivity();
            return true;
        }
        clearSession();
        return false;
    }
    catch {
        clearSession();
        return false;
    }
}
// パスワードリセットメールの送信
export async function requestPasswordReset(email) {
    const response = await fetch(`${API_URL}/api/auth/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if (!response.ok) {
        await handleError(await response.json());
    }
}
// リセットトークンの検証
export async function validateResetToken(token) {
    try {
        const response = await fetch(`${API_URL}/api/auth/password-reset/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        return response.ok;
    }
    catch {
        return false;
    }
}
// パスワードの更新
export async function resetPassword(token, newPassword) {
    const response = await fetch(`${API_URL}/api/auth/password-reset/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
    });
    if (!response.ok) {
        await handleError(await response.json());
    }
}
export const refreshSession = async (token) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('セッションの更新に失敗しました。');
        }
        const data = await response.json();
        return data.token;
    }
    catch (error) {
        console.error('Session refresh error:', error);
        throw error;
    }
};
