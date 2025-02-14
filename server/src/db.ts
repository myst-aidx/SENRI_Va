import mongoose from 'mongoose';
import { createLogger } from './utils/logger';

const logger = createLogger('Database');

export async function connectToDatabase(): Promise<typeof mongoose> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/senri_db';
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      logger.info('Connecting to MongoDB...', { uri: mongoUri });
      const connection = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4
      });
      logger.info('MongoDB connected successfully');
      
      // データベース接続テスト
      if (connection.connection.db) {
        const collections = await connection.connection.db.listCollections().toArray();
        logger.info('Available collections:', collections.map(c => c.name));
      }
      
      return connection;
    } catch (error) {
      retryCount++;
      logger.error(`Failed to connect to MongoDB (attempt ${retryCount}/${maxRetries}):`, error);
      
      if (retryCount === maxRetries) {
        logger.error('Max retries reached. Could not connect to MongoDB.');
        throw error;
      }
      
      // 再試行前に待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error('Failed to connect to MongoDB after max retries');
}

export async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    logger.info('Testing database connection...');
    const state = mongoose.connection.readyState;
    logger.info('Connection state:', state);
    
    if (state === 1 && mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      logger.info('Available collections:', collections.map(c => c.name));
      logger.info('Database connection test successful');
      return true;
    } else {
      throw new Error('Database not connected');
    }
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
}

// テスト用のデータベースクリーンアップ関数
export async function cleanupTestDB(): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('cleanupTestDB can only be called in test environment');
  }

  try {
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.collections();
      await Promise.all(collections.map(collection => collection.deleteMany({})));
      logger.info('Test database cleaned up');
    }
  } catch (error) {
    logger.error('Error cleaning up test database:', error);
    throw error;
  }
}

// エクスポート名の変更
export const connectDB = connectToDatabase;
export const testConnection = testDatabaseConnection;
