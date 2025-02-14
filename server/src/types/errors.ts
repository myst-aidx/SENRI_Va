export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE = 'DATABASE',
  INTERNAL = 'INTERNAL',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  DUPLICATE = 'DUPLICATE',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
  SERVER = 'SERVER'
}

export interface ErrorDetails {
  statusCode: number;
  message: string;
  type: ErrorType;
  details?: string[];
}

export class AppError extends Error {
  public statusCode: number;
  public type: ErrorType;
  public details?: string[];

  constructor(options: ErrorDetails) {
    super(options.message);
    this.statusCode = options.statusCode;
    this.type = options.type;
    this.details = options.details;
    Error.captureStackTrace(this, this.constructor);
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: string[]) {
    super({
      statusCode: 400,
      message,
      type: ErrorType.VALIDATION,
      details
    });
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, details?: string[]) {
    super({
      message,
      type: ErrorType.AUTHENTICATION,
      statusCode: 401,
      details
    });
    this.name = 'AuthError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super({
      message,
      type: ErrorType.AUTHORIZATION,
      statusCode: 403
    });
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super({
      statusCode: 404,
      message,
      type: ErrorType.NOT_FOUND
    });
    this.name = 'NotFoundError';
  }
}

export class DuplicateError extends AppError {
  constructor(message: string = 'Duplicate resource found') {
    super({
      statusCode: 409,
      message,
      type: ErrorType.DUPLICATE
    });
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super({
      message,
      type: ErrorType.NETWORK,
      statusCode: 503
    });
    this.name = 'NetworkError';
  }
}

export class ServerError extends AppError {
  constructor(message: string, details?: string[]) {
    super({
      statusCode: 500,
      message,
      type: ErrorType.INTERNAL,
      details
    });
    this.name = 'ServerError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, details?: string[]) {
    super({
      statusCode: 401,
      message,
      type: ErrorType.AUTHENTICATION,
      details
    });
    this.name = 'AuthenticationError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: string[]) {
    super({
      statusCode: 500,
      message,
      type: ErrorType.DATABASE,
      details
    });
    this.name = 'DatabaseError';
  }
}

export interface ApiError {
  message: string;
  type: ErrorType;
  statusCode: number;
  details?: string[];
} 