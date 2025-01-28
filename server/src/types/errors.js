const ErrorType = {
    VALIDATION: 'VALIDATION_ERROR',
    AUTH: 'AUTH_ERROR',
    SERVER: 'SERVER_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    FORBIDDEN: 'FORBIDDEN_ERROR'
};

class AppError extends Error {
    constructor(message, statusCode = 500, type = ErrorType.SERVER) {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400, ErrorType.VALIDATION);
    }
}

class AuthError extends AppError {
    constructor(message) {
        super(message, 401, ErrorType.AUTH);
    }
}

module.exports = {
    ErrorType,
    AppError,
    ValidationError,
    AuthError
};
