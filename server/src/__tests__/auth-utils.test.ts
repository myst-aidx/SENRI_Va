import { describe, it, expect } from '@jest/globals';
import { generateToken, verifyToken, hashPassword, comparePassword } from '../utils/auth';
import { ErrorMessages } from '../constants/errorMessages';
import { TokenPayload } from '../types/auth';
import { ErrorType } from '../types/errors';

describe('Auth Utils', () => {
  const mockPayload: TokenPayload = {
    userId: '123',
    email: 'test@example.com',
    role: 'user',
    isSubscribed: false
  };

  it('should generate and verify a token', async () => {
    const token = generateToken(mockPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = await verifyToken(token);
    expect(decoded).toHaveProperty('userId', mockPayload.userId);
    expect(decoded).toHaveProperty('email', mockPayload.email);
    expect(decoded).toHaveProperty('role', mockPayload.role);
  });

  it('should handle expired tokens', async () => {
    // Note: This test might be flaky due to timing
    // Better to mock jwt.verify for consistent results
    const token = generateToken(mockPayload);
    await new Promise(resolve => setTimeout(resolve, 3600000)); // Wait for 1 hour

    try {
      await verifyToken(token);
      fail('Expected token verification to fail');
    } catch (error: any) {
      expect(error.type).toBe(ErrorType.TOKEN_EXPIRED);
    }
  }, 4000000); // 4000秒のタイムアウトを設定

  it('should handle invalid tokens', async () => {
    try {
      await verifyToken('invalid.token.here');
      fail('Expected token verification to fail');
    } catch (error: any) {
      expect(error.type).toBe(ErrorType.INVALID_TOKEN);
    }
  });

  describe('パスワード管理', () => {
    it('パスワードが正しくハッシュ化されること', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/); // bcryptハッシュのパターン
    });

    it('パスワードの比較が正しく機能すること', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);

      const isInvalid = await comparePassword('wrongPassword', hashedPassword);
      expect(isInvalid).toBe(false);
    });

    it('異なるパスワードで異なるハッシュが生成されること', async () => {
      const password1 = 'testPassword123';
      const password2 = 'testPassword456';

      const hash1 = await hashPassword(password1);
      const hash2 = await hashPassword(password2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('トークン管理', () => {
    it('無効なトークンでエラーが発生すること', () => {
      const invalidToken = 'invalid.token.string';

      expect(() => {
        verifyToken(invalidToken);
      }).toThrow(ErrorMessages.TOKEN_INVALID);
    });

    it('改ざんされたトークンでエラーが発生すること', () => {
      const token = generateToken(mockPayload);
      const [header, payload, signature] = token.split('.');
      const tamperedToken = `${header}.${payload}modified.${signature}`;

      expect(() => {
        verifyToken(tamperedToken);
      }).toThrow(ErrorMessages.TOKEN_INVALID);
    });
  });
}); 