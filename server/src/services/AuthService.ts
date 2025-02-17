import { supabase, db, TABLES } from '../config/supabase';
import { User } from '../types/database';
import { AppError } from '../types/errors';
import { ErrorType } from '../types/errors';
import { generateToken, verifyToken } from '../utils/auth';
import bcrypt from 'bcrypt';

export class AuthService {
  /**
   * ユーザー登録
   */
  async register(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    try {
      // メールアドレスの重複チェック
      const { data: existingUser } = await supabase
        .from(TABLES.USERS)
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new AppError({
          statusCode: 400,
          message: 'Email already exists',
          type: ErrorType.DUPLICATE
        });
      }

      // パスワードのハッシュ化
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // ユーザーの作成
      const newUser = await db.create<User>(TABLES.USERS, {
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role: 'user',
        is_active: true,
        email_verified: false
      });

      // 初期設定の作成
      await db.create(TABLES.USER_PREFERENCES, {
        user_id: newUser.id,
        theme: 'light',
        language: 'ja',
        notification_settings: {
          email: true,
          push: true,
          sms: false
        },
        fortune_preferences: {
          favorite_types: [],
          excluded_topics: []
        }
      });

      return newUser;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        statusCode: 500,
        message: 'Registration failed',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * ログイン
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // ユーザーの検索
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        throw new AppError({
          statusCode: 401,
          message: 'Invalid credentials',
          type: ErrorType.AUTHENTICATION
        });
      }

      // パスワードの検証
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        throw new AppError({
          statusCode: 401,
          message: 'Invalid credentials',
          type: ErrorType.AUTHENTICATION
        });
      }

      // 最終ログイン時刻の更新
      await db.update<User>(TABLES.USERS, user.id, {
        last_login: new Date().toISOString()
      });

      // JWTトークンの生成
      const token = generateToken({ userId: user.id, role: user.role });

      return { user, token };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        statusCode: 500,
        message: 'Login failed',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * パスワードリセット
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw new AppError({
          statusCode: 400,
          message: 'Password reset failed',
          type: ErrorType.VALIDATION
        });
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        statusCode: 500,
        message: 'Password reset failed',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * メールアドレスの検証
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      const decoded = verifyToken(token);
      await db.update<User>(TABLES.USERS, decoded.userId, {
        email_verified: true
      });
    } catch (error) {
      throw new AppError({
        statusCode: 400,
        message: 'Email verification failed',
        type: ErrorType.VALIDATION
      });
    }
  }

  /**
   * ユーザー情報の取得
   */
  async getUserProfile(userId: string): Promise<User> {
    try {
      const user = await db.getById<User>(TABLES.USERS, userId);
      return user;
    } catch (error) {
      throw new AppError({
        statusCode: 404,
        message: 'User not found',
        type: ErrorType.NOT_FOUND
      });
    }
  }

  /**
   * パスワードの更新
   */
  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await db.getById<User>(TABLES.USERS, userId);

      // 現在のパスワードを確認
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        throw new AppError({
          statusCode: 401,
          message: 'Current password is incorrect',
          type: ErrorType.AUTHENTICATION
        });
      }

      // 新しいパスワードのハッシュ化
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      // パスワードの更新
      await db.update<User>(TABLES.USERS, userId, {
        password_hash: newPasswordHash
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        statusCode: 500,
        message: 'Password update failed',
        type: ErrorType.INTERNAL
      });
    }
  }
} 