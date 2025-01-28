const jwt = require('jsonwebtoken');
const { createLogger } = require('../utils/logger');
const { ErrorType } = require('../types/errors');

const logger = createLogger('Auth');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: '認証が必要です',
            type: ErrorType.AUTH
        });
    }

    try {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jwt.verify(token, secret);
        req.user = {
            id: decoded.userId,
            email: decoded.email
        };
        next();
    } catch (error) {
        logger.error('Token verification error:', error);
        return res.status(403).json({
            message: 'トークンが無効です',
            type: ErrorType.AUTH
        });
    }
};

module.exports = {
    authenticateToken
};
