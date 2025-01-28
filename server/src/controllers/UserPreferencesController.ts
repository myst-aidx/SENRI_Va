import { Request, Response } from 'express';
import { UserPreferences } from '../models/UserPreferences';
import { AppError, ErrorType, ValidationError } from '../types/errors';
import { ErrorMessages } from '../constants/errorMessages';
import { createLogger } from '../utils/logger';

const logger = createLogger('UserPreferencesController');

export class UserPreferencesController {
  // ユーザー設定の取得
  static async getPreferences(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const preferences = await UserPreferences.findOne({ userId });
      if (!preferences) {
        return res.status(404).json({
          success: false,
          message: 'ユーザー設定が見つかりません'
        });
      }

      res.status(200).json({
        success: true,
        preferences
      });
    } catch (error) {
      console.error('Error getting user preferences:', error);
      res.status(500).json({
        success: false,
        message: 'ユーザー設定の取得に失敗しました'
      });
    }
  }

  // ユーザー設定の作成または更新
  static async updatePreferences(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const updates = req.body;

      const preferences = await UserPreferences.findOneAndUpdate(
        { userId },
        { $set: updates },
        { new: true, upsert: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        preferences
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      res.status(500).json({
        success: false,
        message: 'ユーザー設定の更新に失敗しました'
      });
    }
  }

  // 占い設定の更新
  static async updateFortunePreferences(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { fortuneType, autoSave, showDetails } = req.body;

      // 入力値の検証
      if (fortuneType && !['tarot', 'astrology', 'numerology'].includes(fortuneType)) {
        throw new ValidationError(
          ErrorMessages[ErrorType.VALIDATION].ja,
          ['無効な占いタイプが指定されました']
        );
      }

      const preferences = await UserPreferences.findOneAndUpdate(
        { userId },
        {
          $set: {
            'fortune.type': fortuneType,
            'fortune.autoSave': autoSave ?? true,
            'fortune.showDetails': showDetails ?? true
          }
        },
        { upsert: true, new: true }
      );

      res.json({
        message: '占い設定を更新しました',
        preferences
      });
    } catch (error) {
      logger.error('占い設定の更新に失敗しました', { error });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        statusCode: 500,
        message: ErrorMessages[ErrorType.SERVER].ja,
        type: ErrorType.SERVER
      });
    }
  }

  // AIチャット設定の更新
  static async updateAIChatPreferences(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { autoComplete, suggestQuestions, saveHistory } = req.body;

      const preferences = await UserPreferences.findOneAndUpdate(
        { userId },
        {
          $set: {
            'aiChat.autoComplete': autoComplete ?? true,
            'aiChat.suggestQuestions': suggestQuestions ?? true,
            'aiChat.saveHistory': saveHistory ?? true
          }
        },
        { upsert: true, new: true }
      );

      res.json({
        message: 'AIチャット設定を更新しました',
        preferences
      });
    } catch (error) {
      logger.error('AIチャット設定の更新に失敗しました', { error });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        statusCode: 500,
        message: ErrorMessages[ErrorType.SERVER].ja,
        type: ErrorType.SERVER
      });
    }
  }

  // 表示設定の更新
  static async updateDisplayPreferences(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { fontSize, colorScheme, animationEnabled } = req.body;

      // 入力値の検証
      if (fontSize && !['small', 'medium', 'large'].includes(fontSize)) {
        throw new ValidationError(
          ErrorMessages[ErrorType.VALIDATION].ja,
          ['無効なフォントサイズが指定されました']
        );
      }

      if (colorScheme && !['light', 'dark', 'auto'].includes(colorScheme)) {
        throw new ValidationError(
          ErrorMessages[ErrorType.VALIDATION].ja,
          ['無効なカラースキームが指定されました']
        );
      }

      const preferences = await UserPreferences.findOneAndUpdate(
        { userId },
        {
          $set: {
            'display.fontSize': fontSize || 'medium',
            'display.colorScheme': colorScheme || 'auto',
            'display.animationEnabled': animationEnabled ?? true
          }
        },
        { upsert: true, new: true }
      );

      res.json({
        message: '表示設定を更新しました',
        preferences
      });
    } catch (error) {
      logger.error('表示設定の更新に失敗しました', { error });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        statusCode: 500,
        message: ErrorMessages[ErrorType.SERVER].ja,
        type: ErrorType.SERVER
      });
    }
  }

  // プライバシー設定の更新
  static async updatePrivacySettings(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { dataSharing, activityTracking, marketingEmails } = req.body;

      const preferences = await UserPreferences.findOneAndUpdate(
        { userId },
        {
          $set: {
            'privacy.dataSharing': dataSharing ?? false,
            'privacy.activityTracking': activityTracking ?? false,
            'privacy.marketingEmails': marketingEmails ?? false
          }
        },
        { upsert: true, new: true }
      );

      res.json({
        message: 'プライバシー設定を更新しました',
        preferences
      });
    } catch (error) {
      logger.error('プライバシー設定の更新に失敗しました', { error });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        statusCode: 500,
        message: ErrorMessages[ErrorType.SERVER].ja,
        type: ErrorType.SERVER
      });
    }
  }
} 