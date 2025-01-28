const { User } = require('../models/User');
const { createLogger } = require('../utils/logger');
const { ErrorType, AuthError } = require('../types/errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const logger = createLogger('AuthController');

class AuthController {
  constructor() {
    if (AuthController.instance) {
      return AuthController.instance;
    }
    AuthController.instance = this;
  }

  static getInstance() {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  async signup(req, res) {
    try {
      const { email, password, name } = req.body;

      // ユーザーの重複チェック
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AuthError('このメールアドレスは既に登録されています。');
      }

      // パスワードのハッシュ化
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // ユーザーの作成
      const user = new User({
        email,
        password: hashedPassword,
        name
      });

      await user.save();

      // JWTトークンの生成
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'ユーザー登録が完了しました。',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      logger.error('Signup error:', error);
      throw error;
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // ユーザーの存在確認
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthError('メールアドレスまたはパスワードが正しくありません。');
      }

      // パスワードの検証
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new AuthError('メールアドレスまたはパスワードが正しくありません。');
      }

      // 最終ログイン日時の更新
      user.lastLoginAt = new Date();
      await user.save();

      // JWTトークンの生成
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          subscriptionPlan: user.subscriptionPlan
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async logout(req, res) {
    try {
      // クライアント側でトークンを削除するため、
      // サーバー側では特に処理は必要ありません
      res.json({ message: 'ログアウトしました。' });
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      if (!token) {
        throw new AuthError('トークンが提供されていません。');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new AuthError('ユーザーが見つかりません。');
      }

      return {
        valid: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          subscriptionPlan: user.subscriptionPlan
        }
      };
    } catch (error) {
      logger.error('Token verification error:', error);
      throw new AuthError('トークンが無効です。');
    }
  }
}

module.exports = {
  AuthController
};
