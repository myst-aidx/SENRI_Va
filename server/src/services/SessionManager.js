import Redis from 'ioredis';
import { verifyToken } from '../utils/auth';
import { createLogger } from '../utils/logger';
import { AppError, ErrorType } from '../types/errors';
const logger = createLogger('SessionManager');
export class SessionManager {
    constructor() {
        Object.defineProperty(this, "redis", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "sessionPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'session:'
        });
        Object.defineProperty(this, "userSessionPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'user:sessions:'
        });
        Object.defineProperty(this, "sessionExpiry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fallbackStorage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "SESSION_EXPIRY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: parseInt(process.env.SESSION_EXPIRY || '3600', 10)
        });
        Object.defineProperty(this, "MAX_SESSIONS_PER_USER", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: parseInt(process.env.MAX_SESSIONS_PER_USER || '5', 10)
        });
        Object.defineProperty(this, "useInMemory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "inMemoryStore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.fallbackStorage = new Map();
        this.sessionExpiry = parseInt(process.env.SESSION_EXPIRY || '3600', 10);
        this.initializeRedis();
    }
    async initializeRedis() {
        try {
            this.redis = new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                retryStrategy: (times) => {
                    if (times > 3) {
                        console.log('Switching to in-memory storage after Redis connection failures');
                        this.useInMemory = true;
                        return null;
                    }
                    return Math.min(times * 100, 3000);
                }
            });
            this.redis.on('error', (err) => {
                console.error('Redis error:', err);
                if (!this.useInMemory) {
                    console.log('Switching to in-memory storage due to Redis error');
                    this.useInMemory = true;
                }
            });
            await this.redis.ping();
            console.log('Redis connected successfully');
        }
        catch (error) {
            console.error('Failed to connect to Redis:', error);
            this.useInMemory = true;
            console.log('Using in-memory storage as fallback');
        }
    }
    static getInstance() {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }
    async createSession(userId, token) {
        if (this.useInMemory) {
            const payload = await verifyToken(token);
            this.fallbackStorage.set(token, payload);
            return;
        }
        try {
            const sessionKey = this.getSessionKey(token);
            const userSessionKey = this.getUserSessionKey(userId);
            // セッション数の制限チェック
            const userSessions = await this.redis?.smembers(userSessionKey);
            if (userSessions && userSessions.length >= this.MAX_SESSIONS_PER_USER) {
                // 最も古いセッションを削除
                const oldestSession = userSessions[0];
                await this.invalidateSession(oldestSession);
            }
            // セッション情報を保存
            await this.redis?.setex(sessionKey, this.sessionExpiry, userId);
            // ユーザーのセッションリストに追加
            await this.redis?.sadd(userSessionKey, token);
            await this.redis?.expire(userSessionKey, this.sessionExpiry);
            logger.info('Session created:', { userId, token: token.substring(0, 10) + '...' });
        }
        catch (error) {
            logger.error('Error creating session:', error);
            const payload = await verifyToken(token);
            this.fallbackStorage.set(token, payload);
        }
    }
    async validateSession(token) {
        if (!this.redis) {
            logger.error('Redis client is not initialized');
            return null;
        }
        try {
            const sessionKey = this.getSessionKey(token);
            const userId = await this.redis.get(sessionKey);
            if (!userId) {
                logger.debug('Session not found or expired:', { token: token.substring(0, 10) + '...' });
                return null;
            }
            // セッションの有効期限を更新
            await this.redis.expire(sessionKey, this.sessionExpiry);
            await this.redis.expire(this.getUserSessionKey(userId), this.sessionExpiry);
            return userId;
        }
        catch (error) {
            logger.error('Error validating session:', error);
            return null;
        }
    }
    async removeSession(userId) {
        if (!this.redis) {
            logger.error('Redis client is not initialized');
            return;
        }
        try {
            const userSessionKey = this.getUserSessionKey(userId);
            // ユーザーの全てのセッショントークンを取得
            const tokens = await this.redis.smembers(userSessionKey);
            // 各セッションを削除
            const sessionKeys = tokens.map(token => this.getSessionKey(token));
            if (sessionKeys.length > 0) {
                await this.redis.del(...sessionKeys);
            }
            // ユーザーのセッションリストを削除
            await this.redis.del(userSessionKey);
            logger.info('All sessions removed for user:', { userId });
        }
        catch (error) {
            logger.error('Error removing sessions:', error);
            throw error;
        }
    }
    async updateSession(userId, newToken) {
        if (!this.redis) {
            logger.error('Redis client is not initialized');
            return;
        }
        try {
            const userSessionKey = this.getUserSessionKey(userId);
            const sessionKey = this.getSessionKey(newToken);
            // 古いセッションを削除
            const oldTokens = await this.redis.smembers(userSessionKey);
            for (const oldToken of oldTokens) {
                await this.redis.del(this.getSessionKey(oldToken));
            }
            await this.redis.del(userSessionKey);
            // 新しいセッションを作成
            await this.redis.setex(sessionKey, this.sessionExpiry, userId);
            await this.redis.sadd(userSessionKey, newToken);
            await this.redis.expire(userSessionKey, this.sessionExpiry);
            logger.info('Session updated:', { userId, token: newToken.substring(0, 10) + '...' });
        }
        catch (error) {
            logger.error('Error updating session:', error);
            throw error;
        }
    }
    getSessionKey(token) {
        return `${this.sessionPrefix}${token}`;
    }
    getUserSessionKey(userId) {
        return `${this.userSessionPrefix}${userId}`;
    }
    async close() {
        if (!this.redis) {
            logger.error('Redis client is not initialized');
            return;
        }
        try {
            await this.redis.quit();
            logger.info('Redis connection closed');
        }
        catch (error) {
            logger.error('Error closing Redis connection:', error);
            throw error;
        }
    }
    async invalidateSession(token) {
        if (!this.redis) {
            logger.error('Redis client is not initialized');
            return;
        }
        const sessionKey = this.getSessionKey(token);
        const redisClient = this.redis;
        const userId = await redisClient.get(sessionKey);
        if (userId) {
            const userSessionsKey = this.getUserSessionKey(userId);
            await Promise.all([
                redisClient.del(sessionKey),
                redisClient.srem(userSessionsKey, token)
            ]);
        }
    }
    async invalidateUserSessions(userId) {
        if (!this.redis) {
            logger.error('Redis client is not initialized');
            return;
        }
        const userSessionsKey = this.getUserSessionKey(userId);
        const redisClient = this.redis;
        const tokens = await redisClient.smembers(userSessionsKey);
        if (tokens.length > 0) {
            const sessionKeys = tokens.map((token) => this.getSessionKey(token));
            await Promise.all([
                redisClient.del(userSessionsKey),
                ...sessionKeys.map((key) => redisClient.del(key))
            ]);
        }
    }
    async refreshSession(userId, oldToken, newToken) {
        await this.invalidateSession(oldToken);
        await this.createSession(userId, newToken);
    }
    async clearAllSessions() {
        if (!this.redis) {
            logger.error('Redis client is not initialized');
            return;
        }
        try {
            const redisClient = this.redis;
            const keys = await redisClient.keys(`${this.sessionPrefix}*`);
            if (keys.length > 0) {
                await redisClient.del(...keys);
            }
            const userKeys = await redisClient.keys(`${this.userSessionPrefix}*`);
            if (userKeys.length > 0) {
                await redisClient.del(...userKeys);
            }
        }
        catch (error) {
            logger.error('Failed to clear all sessions:', error);
        }
    }
    async disconnect() {
        if (!this.redis) {
            logger.error('Redis client is not initialized');
            return;
        }
        try {
            const redisClient = this.redis;
            await redisClient.disconnect();
        }
        catch (error) {
            logger.error('Failed to disconnect from Redis:', error);
        }
    }
    async setSession(key, value) {
        try {
            if (this.useInMemory) {
                this.inMemoryStore.set(key, value);
                setTimeout(() => this.inMemoryStore.delete(key), this.sessionExpiry * 1000);
            }
            else if (this.redis) {
                await this.redis.set(key, value, 'EX', this.sessionExpiry);
            }
        }
        catch (error) {
            console.error('Session storage error:', error);
            throw new AppError({
                message: 'セッションの保存に失敗しました',
                type: ErrorType.SERVER,
                statusCode: 500
            });
        }
    }
    async getSession(key) {
        try {
            if (this.useInMemory) {
                return this.inMemoryStore.get(key) || null;
            }
            else if (this.redis) {
                return await this.redis.get(key);
            }
            return null;
        }
        catch (error) {
            console.error('Session retrieval error:', error);
            throw new AppError({
                message: 'セッションの取得に失敗しました',
                type: ErrorType.SERVER,
                statusCode: 500
            });
        }
    }
    async deleteSession(key) {
        try {
            if (this.useInMemory) {
                this.inMemoryStore.delete(key);
            }
            else if (this.redis) {
                await this.redis.del(key);
            }
        }
        catch (error) {
            console.error('Session deletion error:', error);
            throw new AppError({
                message: 'セッションの削除に失敗しました',
                type: ErrorType.SERVER,
                statusCode: 500
            });
        }
    }
}
export default SessionManager;
