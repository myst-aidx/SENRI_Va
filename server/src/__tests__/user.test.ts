import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { connectToDatabase, disconnectFromDatabase, cleanupTestDB } from '../db';
import { User } from '../models/User';
import { AppError, ErrorType } from '../types/errors';

describe('User Model', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    await cleanupTestDB();
  });

  it('should create a new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User'
    };

    const user = await User.create(userData);
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
    expect(user.password).not.toBe(userData.password); // パスワードがハッシュ化されていることを確認
  });

  it('should fail to create user with invalid email', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'Password123!',
      name: 'Test User'
    };

    try {
      await User.create(userData);
      fail('Expected validation error');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).type).toBe(ErrorType.VALIDATION);
    }
  });

  it('should fail to create user with short password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'short',
      name: 'Test User'
    };

    try {
      await User.create(userData);
      fail('Expected validation error');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).type).toBe(ErrorType.VALIDATION);
    }
  });

  it('should not allow duplicate emails', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User'
    };

    await User.create(userData);

    try {
      await User.create(userData);
      fail('Expected duplicate error');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).type).toBe(ErrorType.DUPLICATE);
    }
  });

  it('should update user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User'
    };

    const user = await User.create(userData);
    const updatedName = 'Updated User';
    
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name: updatedName },
      { new: true }
    );

    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe(updatedName);
  });

  it('should delete user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User'
    };

    const user = await User.create(userData);
    await User.findByIdAndDelete(user._id);
    
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });

  it('should handle non-existent user', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011';
    
    try {
      await User.findByIdAndUpdate(
        nonExistentId,
        { name: 'Updated Name' },
        { new: true }
      );
      fail('Expected not found error');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).type).toBe(ErrorType.NOT_FOUND);
    }
  });

  it('should validate password format', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'weak',
      name: 'Test User'
    };

    try {
      await User.create(userData);
      fail('Expected validation error for weak password');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).type).toBe(ErrorType.VALIDATION);
    }
  });

  it('should validate email format', async () => {
    const userData = {
      email: 'invalid.email',
      password: 'Password123!',
      name: 'Test User'
    };

    try {
      await User.create(userData);
      fail('Expected validation error for invalid email');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).type).toBe(ErrorType.VALIDATION);
    }
  });
}); 