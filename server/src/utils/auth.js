import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError, ErrorType } from '../types/errors';
import { ErrorMessages } from '../constants/errorMessages';
import { createLogger } from '../utils/logger';
const logger = createLogger('auth');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';
const SALT_ROUNDS = 10;
export const generateToken = (payload) => {
    try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    }
    catch (error) {
        logger.error('Token generation error:', error);
        throw new Error('Failed to generate token');
    }
};
export const generateRefreshToken = (userId) => {
    try {
        return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    }
    catch (error) {
        logger.error('Refresh token generation error:', error);
        throw new Error('Failed to generate refresh token');
    }
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError({
                statusCode: 401,
                message: ErrorMessages.TOKEN_EXPIRED,
                type: ErrorType.TOKEN_EXPIRED
            });
        }
        throw new AppError({
            statusCode: 401,
            message: ErrorMessages.TOKEN_INVALID,
            type: ErrorType.INVALID_TOKEN
        });
    }
};
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    }
    catch (error) {
        throw new AppError({
            statusCode: 401,
            message: ErrorMessages.TOKEN_INVALID,
            type: ErrorType.INVALID_TOKEN
        });
    }
};
export const hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    }
    catch (error) {
        throw new AppError({
            statusCode: 401,
            message: ErrorMessages.TOKEN_INVALID,
            type: ErrorType.INVALID_TOKEN
        });
    }
};
