import { AppError, ErrorType } from '../types/errors';
import { ErrorMessages } from '../constants/errorMessages';
export class AuthService {
    constructor() {
        Object.defineProperty(this, "API_BASE_URL", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: '/api/auth'
        });
    }
    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    async signup(email, password) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new AppError(errorData.message || ErrorMessages.UNKNOWN_ERROR, ErrorType.AUTHENTICATION, response.status);
            }
            return await response.json();
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(ErrorMessages.NETWORK_ERROR, ErrorType.NETWORK);
        }
    }
    async login(email, password) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new AppError(errorData.message || ErrorMessages.UNKNOWN_ERROR, ErrorType.AUTHENTICATION, response.status);
            }
            return await response.json();
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(ErrorMessages.NETWORK_ERROR, ErrorType.NETWORK);
        }
    }
    async logout() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/logout`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new AppError(ErrorMessages.UNKNOWN_ERROR, ErrorType.AUTHENTICATION);
            }
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(ErrorMessages.NETWORK_ERROR, ErrorType.NETWORK);
        }
    }
}
