import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { connectToDatabase, disconnectFromDatabase } from '../db';
import { AuthController } from '../controllers/AuthController';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { RateLimiter } from '../utils/RateLimiter';
import { SessionManager } from '../services/SessionManager';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types/user';

// RateLimiterのモック
jest.mock('../utils/RateLimiter', () => ({
  RateLimiter: {
    getInstance: () => ({
      isAllowed: () => Promise.resolve(true),
      increment: () => Promise.resolve()
    })
  }
}));

// SessionManagerのモック
jest.mock('../services/SessionManager', () => ({
  SessionManager: {
    getInstance: () => ({
      createSession: () => Promise.resolve(),
      validateSession: () => Promise.resolve(true),
      removeSession: () => Promise.resolve(),
      updateSession: () => Promise.resolve()
    })
  }
}));

describe('Admin Authentication', () => {
  let authController: AuthController;

  beforeAll(async () => {
    await connectToDatabase();
    authController = AuthController.getInstance();

    // テストデータベースをクリーンアップ
    await User.deleteMany({});

    // 管理者ユーザーを作成
    const admin = new User({
      email: 'admin@senri.com',
      password: 'admin123', // パスワードは自動的にハッシュ化される
      name: '管理者',
      role: UserRole.ADMIN,
      isAdmin: true,
      isSubscribed: true,
      subscriptionType: 'premium',
      subscriptionEndDate: new Date('2025-12-31')
    });

    await admin.save();
  });

  afterAll(async () => {
    // テストデータベースをクリーンアップ
    await User.deleteMany({});
    await disconnectFromDatabase();
  });

  it('should login as admin successfully', async () => {
    // モックリクエストとレスポンスの作成
    const mockRequest = {
      body: {
        email: 'admin@senri.com',
        password: 'admin123'
      }
    } as Request;

    let responseData: any = {};
    const mockResponse = {
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        responseData = data;
        return this;
      },
      statusCode: 0
    } as Response;

    // ログイン実行
    await authController.login(mockRequest, mockResponse);

    // レスポンスの検証
    expect(mockResponse.statusCode).toBe(200);
    expect(responseData).toHaveProperty('token');
    expect(responseData).toHaveProperty('user');
    expect(responseData.user.email).toBe('admin@senri.com');
    expect(responseData.user.isAdmin).toBe(true);
  });
}); 