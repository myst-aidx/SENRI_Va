import Redis from 'ioredis';
import { verifyToken } from '../utils/auth';
import { createLogger } from '../utils/logger';
import { TokenPayload } from '../types/auth';
import { AppError, ErrorType } from '../types/errors';

const logger = createLogger('SessionManager');

export class SessionManager {
  private static instance: SessionManager;
  private redis: Redis | null = null;
  private readonly sessionPrefix = 'session:';
  private readonly userSessionPrefix = 'user:sessions:';
  private readonly sessionExpiry: number;
  private fallbackStorage: Map<string, TokenPayload>;
  private readonly SESSION_EXPIRY = parseInt(process.env.SESSION_EXPIRY || '3600', 10);
  private readonly MAX_SESSIONS_PER_USER = parseInt(process.env.MAX_SESSIONS_PER_USER || '5', 10);
  private useInMemory: boolean = false;
  private inMemoryStore: Map<string, string> = new Map();

  private constructor() {
    this.fallbackStorage = new Map();
    this.sessionExpiry = parseInt(process.env.SESSION_EXPIRY || '3600', 10);
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        retryStrategy: (times: number) => {
          if (times > 3) {
            console.log('Switching to in-memory storage after Redis connection failures');
            this.useInMemory = true;
            return null;
          }
          return Math.min(times * 100, 3000);
        }
      });

      this.redis.on('error', (err: Error) => {
        console.error('Redis error:', err);
        if (!this.useInMemory) {
          console.log('Switching to in-memory storage due to Redis error');
          this.useInMemory = true;
        }
      });

      await this.redis.ping();
      console.log('Redis connected successfully');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      this.useInMemory = true;
      console.log('Using in-memory storage as fallback');
    }
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public async createSession(userId: string, token: string): Promise<void> {
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
    } catch (error) {
      logger.error('Error creating session:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to create session',
        type: ErrorType.INTERNAL
      });
    }
  }

  public async validateSession(token: string): Promise<string | null> {
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
    } catch (error) {
      logger.error('Error validating session:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to validate session',
        type: ErrorType.INTERNAL
      });
    }
  }

  public async removeSession(userId: string): Promise<void> {
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
    } catch (error) {
      logger.error('Error removing sessions:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to remove sessions',
        type: ErrorType.INTERNAL
      });
    }
  }

  public async updateSession(userId: string, newToken: string): Promise<void> {
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
    } catch (error) {
      logger.error('Error updating session:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to update session',
        type: ErrorType.INTERNAL
      });
    }
  }

  private getSessionKey(token: string): string {
    return `${this.sessionPrefix}${token}`;
  }

  private getUserSessionKey(userId: string): string {
    return `${this.userSessionPrefix}${userId}`;
  }

  public async close(): Promise<void> {
    if (!this.redis) {
      logger.error('Redis client is not initialized');
      return;
    }

    try {
      await this.redis.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to close Redis connection',
        type: ErrorType.INTERNAL
      });
    }
  }

  async invalidateSession(token: string): Promise<void> {
    if (!this.redis) {
      logger.error('Redis client is not initialized');
      return;
    }

    try {
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
    } catch (error) {
      logger.error('Error invalidating session:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to invalidate session',
        type: ErrorType.INTERNAL
      });
    }
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    if (!this.redis) {
      logger.error('Redis client is not initialized');
      return;
    }

    try {
      const userSessionsKey = this.getUserSessionKey(userId);
      const redisClient = this.redis;
      const tokens: string[] = await redisClient.smembers(userSessionsKey);

      if (tokens.length > 0) {
        const sessionKeys: string[] = tokens.map((token: string) => this.getSessionKey(token));
        await Promise.all([
          redisClient.del(userSessionsKey),
          ...sessionKeys.map((key: string) => redisClient.del(key))
        ]);
      }
    } catch (error) {
      logger.error('Error invalidating user sessions:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to invalidate user sessions',
        type: ErrorType.INTERNAL
      });
    }
  }

  async refreshSession(userId: string, oldToken: string, newToken: string): Promise<void> {
    await this.invalidateSession(oldToken);
    await this.createSession(userId, newToken);
  }

  async clearAllSessions(): Promise<void> {
    if (!this.redis) {
      logger.error('Redis client is not initialized');
      return;
    }

    try {
      const keys = await this.redis.keys(`${this.sessionPrefix}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }

      const userKeys = await this.redis.keys(`${this.userSessionPrefix}*`);
      if (userKeys.length > 0) {
        await this.redis.del(...userKeys);
      }

      logger.info('All sessions cleared');
    } catch (error) {
      logger.error('Error clearing all sessions:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to clear all sessions',
        type: ErrorType.INTERNAL
      });
    }
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.quit();
        this.redis = null;
        logger.info('Redis connection closed');
      } catch (error) {
        logger.error('Error disconnecting from Redis:', error);
        throw new AppError({
          statusCode: 500,
          message: 'Failed to disconnect from Redis',
          type: ErrorType.INTERNAL
        });
      }
    }
  }

  public async setSession(key: string, value: string): Promise<void> {
    if (this.useInMemory) {
      this.inMemoryStore.set(key, value);
      return;
    }

    try {
      await this.redis?.setex(key, this.sessionExpiry, value);
    } catch (error) {
      logger.error('Error setting session:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to set session',
        type: ErrorType.INTERNAL
      });
    }
  }

  public async getSession(key: string): Promise<string | null> {
    if (this.useInMemory) {
      return this.inMemoryStore.get(key) || null;
    }

    try {
      return await this.redis?.get(key) || null;
    } catch (error) {
      logger.error('Error getting session:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to get session',
        type: ErrorType.INTERNAL
      });
    }
  }

  public async deleteSession(key: string): Promise<void> {
    if (this.useInMemory) {
      this.inMemoryStore.delete(key);
      return;
    }

    try {
      await this.redis?.del(key);
    } catch (error) {
      logger.error('Error deleting session:', error);
      throw new AppError({
        statusCode: 500,
        message: 'Failed to delete session',
        type: ErrorType.INTERNAL
      });
    }
  }
}

export default SessionManager; 