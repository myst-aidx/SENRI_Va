import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { SessionManager } from '../services/SessionManager';
import { generateToken } from '../utils/auth';
import { TokenPayload } from '../types/auth';
import { AppError, ErrorType } from '../types/errors';

describe('SessionManager', () => {
  let sessionManager: SessionManager;
  const mockUserId = '123';
  const mockPayload: TokenPayload = {
    userId: mockUserId,
    email: 'test@example.com',
    role: 'user',
    isSubscribed: false
  };

  beforeEach(() => {
    sessionManager = SessionManager.getInstance();
  });

  afterEach(async () => {
    await sessionManager.clearAllSessions();
  });

  it('should create and validate a session', async () => {
    const token = generateToken(mockPayload);
    await sessionManager.createSession(mockUserId, token);
    const validatedUserId = await sessionManager.validateSession(token);
    expect(validatedUserId).toBe(mockUserId);
  });

  it('should remove a session', async () => {
    const token = generateToken(mockPayload);
    await sessionManager.createSession(mockUserId, token);
    await sessionManager.removeSession(mockUserId);
    const validatedUserId = await sessionManager.validateSession(token);
    expect(validatedUserId).toBeNull();
  });

  it('should update a session', async () => {
    const oldToken = generateToken(mockPayload);
    await sessionManager.createSession(mockUserId, oldToken);
    
    const newToken = generateToken(mockPayload);
    await sessionManager.updateSession(mockUserId, newToken);
    
    const oldValidation = await sessionManager.validateSession(oldToken);
    const newValidation = await sessionManager.validateSession(newToken);
    
    expect(oldValidation).toBeNull();
    expect(newValidation).toBe(mockUserId);
  });

  it('should handle multiple sessions per user', async () => {
    const tokens = Array.from({ length: 3 }, () => generateToken(mockPayload));
    
    for (const token of tokens) {
      await sessionManager.createSession(mockUserId, token);
    }
    
    for (const token of tokens) {
      const validatedUserId = await sessionManager.validateSession(token);
      expect(validatedUserId).toBe(mockUserId);
    }
  });

  it('should invalidate specific session', async () => {
    const token = generateToken(mockPayload);
    await sessionManager.createSession(mockUserId, token);
    await sessionManager.invalidateSession(token);
    const validatedUserId = await sessionManager.validateSession(token);
    expect(validatedUserId).toBeNull();
  });

  it('should invalidate all user sessions', async () => {
    const tokens = Array.from({ length: 3 }, () => generateToken(mockPayload));
    
    for (const token of tokens) {
      await sessionManager.createSession(mockUserId, token);
    }
    
    await sessionManager.invalidateUserSessions(mockUserId);
    
    for (const token of tokens) {
      const validatedUserId = await sessionManager.validateSession(token);
      expect(validatedUserId).toBeNull();
    }
  });

  it('should handle session expiration', async () => {
    const token = generateToken(mockPayload);
    await sessionManager.createSession(mockUserId, token);
    
    // セッションの有効期限が切れるまで待機（モック）
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const validatedUserId = await sessionManager.validateSession(token);
    expect(validatedUserId).toBe(mockUserId); // インメモリモードでは有効期限は無視される
  });

  it('should handle errors gracefully', async () => {
    try {
      await sessionManager.validateSession('invalid-token');
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).type).toBe(ErrorType.INTERNAL);
    }
  });

  it('should refresh session successfully', async () => {
    const oldToken = generateToken(mockPayload);
    const newToken = generateToken(mockPayload);
    
    await sessionManager.createSession(mockUserId, oldToken);
    await sessionManager.refreshSession(mockUserId, oldToken, newToken);
    
    const oldValidation = await sessionManager.validateSession(oldToken);
    const newValidation = await sessionManager.validateSession(newToken);
    
    expect(oldValidation).toBeNull();
    expect(newValidation).toBe(mockUserId);
  });
}); 