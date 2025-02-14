import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { createLogger } from '../utils/logger';

const logger = createLogger('CreateTestUser');

async function createTestUser() {
  try {
    // MongoDBに接続
    await mongoose.connect('mongodb://localhost:27017/fortune-telling');
    logger.info('Connected to MongoDB');

    // テストユーザーのパスワード（平文）
    const password = 'Test123456';

    // 既存のテストユーザーを削除
    await User.deleteOne({ email: 'test@example.com' });

    // テストユーザーを作成（保存時にpre-saveミドルウェアによりハッシュ化される）
    const testUser = new User({
      email: 'test@example.com',
      password: password,
      role: 'user',
      isSubscribed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await testUser.save();
    logger.info('Test user created successfully');
  } catch (error) {
    logger.error('Failed to create test user:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}

export default createTestUser; 