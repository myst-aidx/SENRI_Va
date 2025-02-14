// Jest のグローバル設定
jest.setTimeout(30000); // タイムアウトを30秒に設定

// Mongoose の設定
process.env.MONGOOSE_TIMEOUT = '30000';
process.env.MONGOOSE_BUFFER_TIMEOUT = '30000';

// 環境変数の設定
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/senri_test_db'; 