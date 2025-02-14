import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

async function createInitialAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/senri_db';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');

    // 管理者アカウントの設定
    const adminEmail = 'admin@senri.com';
    const adminPassword = 'admin123';

    // パスワードのハッシュ化
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 既に管理者が存在していないかチェック
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('管理者アカウントは既に存在します:', existingAdmin.email);
      await mongoose.disconnect();
      return;
    }

    // 管理者ユーザーの作成
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      name: '管理者',
      role: 'admin',
      isAdmin: true,
      isSubscribed: true,
      subscriptionType: 'premium',
      subscriptionEndDate: new Date('2025-12-31')
    });

    await admin.save();
    console.log('管理者アカウントを作成しました');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
  } catch (error) {
    console.error('管理者アカウントの作成に失敗しました:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// スクリプトが直接実行された場合に関数を実行
if (require.main === module) {
  createInitialAdmin()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export default createInitialAdmin;