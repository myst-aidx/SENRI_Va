import express from 'express';
import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createInitialAdmin from './src/scripts/createInitialAdmin';
import { User } from './src/models/User';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB接続設定
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/senri_db';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    // サーバー起動時に管理者アカウントを自動作成
    createInitialAdmin();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Userインターフェイスとスキーマの定義
interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  isAdmin: boolean;
  isSubscribed?: boolean;
  subscriptionType?: string;
  subscriptionEndDate?: Date;
  lastLoginAt?: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  isAdmin: { type: Boolean, default: false },
  isSubscribed: { type: Boolean, default: false },
  subscriptionType: { type: String },
  subscriptionEndDate: { type: Date },
  lastLoginAt: { type: Date }
});

// ※パスワードのハッシュ化処理はcreateInitialAdmin関数内で実施するため、pre-saveフックは今回は使用しません

const UserModel = model<IUser>('User', UserSchema);

// ログインAPIエンドポイント（/api/auth/login）
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    // パスワードフィールドはデフォルトで select:false のため、明示的に取得
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('ユーザーが存在しません:', email);
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません。' });
    }
    
    console.log('ユーザー見つかりました:', user.email);
    console.log('Stored password hash:', user.password);
    console.log('Provided password:', password);
    
    // パスワードの検証
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('パスワード検証結果:', isValidPassword);
    if (!isValidPassword) {
      console.log('パスワードが一致しません:', email);
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません。' });
    }
    
    // JWTトークンの生成
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log('Login successful for:', email);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('ログイン処理でエラーが発生:', error);
    res.status(500).json({ message: '内部エラーが発生しました。' });
  }
});

// ※必要に応じてサインアップ等のルートも追加可能

// 管理用ルートの利用
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
}); 