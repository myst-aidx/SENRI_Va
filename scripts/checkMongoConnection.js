import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkConnection() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/senri_db';
    console.log('Connecting to MongoDB...', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
    
    // 利用可能なコレクションを表示
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // 接続テスト
    const stats = await mongoose.connection.db.stats();
    console.log('Database stats:', stats);
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

checkConnection();
