export var ErrorType;
(function (ErrorType) {
    ErrorType["VALIDATION"] = "VALIDATION";
    ErrorType["AUTHENTICATION"] = "AUTHENTICATION";
    ErrorType["AUTHORIZATION"] = "AUTHORIZATION";
    ErrorType["DUPLICATE"] = "DUPLICATE";
    ErrorType["NETWORK"] = "NETWORK";
    ErrorType["SERVER"] = "SERVER";
    ErrorType["UNKNOWN"] = "UNKNOWN";
})(ErrorType || (ErrorType = {}));
export class AppError extends Error {
    constructor(message, type = ErrorType.UNKNOWN, statusCode = 500) {
        super(message);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: type
        });
        Object.defineProperty(this, "statusCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: statusCode
        });
        this.name = 'AppError';
    }
    static isAppError(error) {
        return error instanceof AppError;
    }
}
export class ValidationError extends AppError {
    constructor(message) {
        super(message, ErrorType.VALIDATION, 400);
        this.name = 'ValidationError';
    }
}
export class AuthError extends AppError {
    constructor(message, type = ErrorType.AUTHENTICATION) {
        super(message, type, 401);
        this.name = 'AuthError';
    }
}
export class DuplicateError extends AppError {
    constructor(message) {
        super(message, ErrorType.DUPLICATE, 409);
        this.name = 'DuplicateError';
    }
}
export class NetworkError extends AppError {
    constructor(message) {
        super(message, ErrorType.NETWORK, 503);
        this.name = 'NetworkError';
    }
}
export class ServerError extends AppError {
    constructor(message) {
        super(message, ErrorType.SERVER, 500);
        this.name = 'ServerError';
    }
}
export class ApiError extends Error {
    constructor(type, message, statusCode, details) {
        super(message);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: type
        });
        Object.defineProperty(this, "statusCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: statusCode
        });
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: details
        });
        this.name = 'ApiError';
    }
}
