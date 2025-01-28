import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';
export class SessionManager {
    constructor(sessionExpiry = 3600) {
        Object.defineProperty(this, "redis", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
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
            value: 'user-sessions:'
        });
        Object.defineProperty(this, "sessionExpiry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.sessionExpiry = sessionExpiry;
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });
        this.redis.on('error', (error) => {
            logger.error('Redis connection error:', error);
        });
        this.redis.on('connect', () => {
            logger.info('Connected to Redis');
        });
    }
    async createSession(userId) {
        const sessionId = uuidv4();
        const sessionKey = this.getSessionKey(sessionId);
        const userSessionKey = this.getUserSessionKey(userId);
        try {
            // セッションの作成
            await this.redis.set(sessionKey, userId, 'EX', this.sessionExpiry);
            // ユーザーのセッション一覧に追加
            await this.redis.sadd(userSessionKey, sessionId);
            await this.redis.expire(userSessionKey, this.sessionExpiry);
            logger.info('Session created:', { userId, sessionId });
            return sessionId;
        }
        catch (error) {
            logger.error('Error creating session:', error);
            throw error;
        }
    }
    async validateSession(sessionId) {
        const sessionKey = this.getSessionKey(sessionId);
        try {
            const userId = await this.redis.get(sessionKey);
            if (!userId) {
                return null;
            }
            // セッションの有効期限を更新
            await this.redis.expire(sessionKey, this.sessionExpiry);
            const userSessionKey = this.getUserSessionKey(userId);
            await this.redis.expire(userSessionKey, this.sessionExpiry);
            return userId;
        }
        catch (error) {
            logger.error('Error validating session:', error);
            return null;
        }
    }
    async removeSession(sessionId) {
        const sessionKey = this.getSessionKey(sessionId);
        try {
            const userId = await this.redis.get(sessionKey);
            if (userId) {
                const userSessionKey = this.getUserSessionKey(userId);
                await this.redis.srem(userSessionKey, sessionId);
            }
            await this.redis.del(sessionKey);
            logger.info('Session removed:', { sessionId });
        }
        catch (error) {
            logger.error('Error removing session:', error);
            throw error;
        }
    }
    async removeAllSessions(userId) {
        const userSessionKey = this.getUserSessionKey(userId);
        try {
            const sessions = await this.redis.smembers(userSessionKey);
            const pipeline = this.redis.pipeline();
            sessions.forEach(sessionId => {
                pipeline.del(this.getSessionKey(sessionId));
            });
            pipeline.del(userSessionKey);
            await pipeline.exec();
            logger.info('All sessions removed for user:', { userId });
        }
        catch (error) {
            logger.error('Error removing all sessions:', error);
            throw error;
        }
    }
    getSessionKey(sessionId) {
        return `${this.sessionPrefix}${sessionId}`;
    }
    getUserSessionKey(userId) {
        return `${this.userSessionPrefix}${userId}`;
    }
}
