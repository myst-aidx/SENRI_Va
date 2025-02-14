import { describe, it, expect } from '@jest/globals';
import {
  AppError,
  ValidationError,
  AuthError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
  NetworkError,
  ServerError,
  DuplicateError,
  ErrorType
} from '../types/errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an AppError instance with basic properties', () => {
      const options = {
        statusCode: 400,
        message: 'Test error message',
        type: ErrorType.VALIDATION
      };
      const error = new AppError(options);

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(options.statusCode);
      expect(error.message).toBe(options.message);
      expect(error.type).toBe(options.type);
    });

    it('should create an AppError instance with details', () => {
      const options = {
        statusCode: 400,
        message: 'Test error message',
        type: ErrorType.VALIDATION,
        details: ['Detail 1', 'Detail 2']
      };
      const error = new AppError(options);

      expect(error.details).toEqual(options.details);
    });

    it('should correctly identify AppError instances', () => {
      const error = new AppError({
        statusCode: 400,
        message: 'Test error',
        type: ErrorType.VALIDATION
      });
      expect(AppError.isAppError(error)).toBe(true);
      expect(AppError.isAppError(new Error())).toBe(false);
    });
  });

  describe('ValidationError', () => {
    it('should create a ValidationError instance', () => {
      const message = 'Validation failed';
      const error = new ValidationError(message);

      expect(error).toBeInstanceOf(ValidationError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe(message);
      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('AuthError', () => {
    it('should create an AuthError instance', () => {
      const message = 'Authentication failed';
      const error = new AuthError(message);

      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe(message);
      expect(error.type).toBe(ErrorType.AUTHENTICATION);
      expect(error.name).toBe('AuthError');
    });
  });

  describe('AuthenticationError', () => {
    it('should create an AuthenticationError instance', () => {
      const message = 'Authentication failed';
      const error = new AuthenticationError(message);

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe(message);
      expect(error.type).toBe(ErrorType.AUTHENTICATION);
      expect(error.name).toBe('AuthenticationError');
    });
  });

  describe('AuthorizationError', () => {
    it('should create an AuthorizationError instance', () => {
      const message = 'Authorization failed';
      const error = new AuthorizationError(message);

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe(message);
      expect(error.type).toBe(ErrorType.AUTHORIZATION);
      expect(error.name).toBe('AuthorizationError');
    });
  });

  describe('NotFoundError', () => {
    it('should create a NotFoundError instance', () => {
      const message = 'Resource not found';
      const error = new NotFoundError(message);

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe(message);
      expect(error.type).toBe(ErrorType.NOT_FOUND);
      expect(error.name).toBe('NotFoundError');
    });
  });

  describe('DatabaseError', () => {
    it('should create a DatabaseError instance', () => {
      const message = 'Database operation failed';
      const error = new DatabaseError(message);

      expect(error).toBeInstanceOf(DatabaseError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe(message);
      expect(error.type).toBe(ErrorType.DATABASE);
      expect(error.name).toBe('DatabaseError');
    });
  });

  describe('NetworkError', () => {
    it('should create a NetworkError instance', () => {
      const message = 'Network operation failed';
      const error = new NetworkError(message);

      expect(error).toBeInstanceOf(NetworkError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(503);
      expect(error.message).toBe(message);
      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.name).toBe('NetworkError');
    });
  });

  describe('ServerError', () => {
    it('should create a ServerError instance', () => {
      const message = 'Internal server error';
      const error = new ServerError(message);

      expect(error).toBeInstanceOf(ServerError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe(message);
      expect(error.type).toBe(ErrorType.INTERNAL);
      expect(error.name).toBe('ServerError');
    });
  });

  describe('DuplicateError', () => {
    it('should create a DuplicateError instance', () => {
      const message = 'Duplicate resource found';
      const error = new DuplicateError(message);

      expect(error).toBeInstanceOf(DuplicateError);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe(message);
      expect(error.type).toBe(ErrorType.DUPLICATE);
    });

    it('should use default message if none provided', () => {
      const error = new DuplicateError();
      expect(error.message).toBe('Duplicate resource found');
    });
  });
}); 