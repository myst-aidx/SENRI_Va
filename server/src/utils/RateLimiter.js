import Redis from 'ioredis';
import { createLogger } from './logger';
const logger = createLogger('RateLimiter');
export class RateLimiter {
    constructor() {
        Object.defineProperty(this, "redis", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.redis = new Redis();
        this.config = {
            maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15分
            whitelistedIPs: [],
            whitelistedUsers: []
        };
    }
    static getInstance() {
        if (!RateLimiter.instance) {
            RateLimiter.instance = new RateLimiter();
        }
        return RateLimiter.instance;
    }
    getKey(identifier, type = 'ip') {
        return `ratelimit:${type}:${identifier}`;
    }
    async isAllowed(identifier, type = 'ip') {
        try {
            // ホワイトリストのチェック
            if (type === 'ip' && this.config.whitelistedIPs?.includes(identifier)) {
                return true;
            }
            if (type === 'user' && this.config.whitelistedUsers?.includes(identifier)) {
                return true;
            }
            const key = this.getKey(identifier, type);
            const now = Date.now();
            const windowStart = now - this.config.windowMs;
            // 期間内のリクエスト数を取得
            const requests = await this.redis.zcount(key, windowStart, now);
            // 制限を超えていないかチェック
            return requests < this.config.maxRequests;
        }
        catch (error) {
            logger.error('Rate limit check error:', error);
            return true; // エラーの場合は安全のため許可
        }
    }
    async increment(identifier, type = 'ip') {
        try {
            const key = this.getKey(identifier, type);
            const now = Date.now();
            const windowStart = now - this.config.windowMs;
            const multi = this.redis.multi();
            // 期限切れのエントリーを削除
            multi.zremrangebyscore(key, 0, windowStart);
            // 新しいリクエストを追加
            multi.zadd(key, now, `${now}:${Math.random()}`);
            // キーの有効期限を設定
            multi.expire(key, Math.ceil(this.config.windowMs / 1000));
            await multi.exec();
        }
        catch (error) {
            logger.error('Rate limit increment error:', error);
        }
    }
    async reset(identifier, type = 'ip') {
        try {
            const key = this.getKey(identifier, type);
            await this.redis.del(key);
        }
        catch (error) {
            logger.error('Rate limit reset error:', error);
        }
    }
    addToWhitelist(identifier, type = 'ip') {
        if (type === 'ip') {
            this.config.whitelistedIPs?.push(identifier);
        }
        else if (type === 'user') {
            this.config.whitelistedUsers?.push(identifier);
        }
    }
    removeFromWhitelist(identifier, type = 'ip') {
        if (type === 'ip') {
            this.config.whitelistedIPs = this.config.whitelistedIPs?.filter(ip => ip !== identifier);
        }
        else if (type === 'user') {
            this.config.whitelistedUsers = this.config.whitelistedUsers?.filter(user => user !== identifier);
        }
    }
    async disconnect() {
        try {
            await this.redis.disconnect();
        }
        catch (error) {
            logger.error('Redis disconnect error:', error);
        }
    }
}
