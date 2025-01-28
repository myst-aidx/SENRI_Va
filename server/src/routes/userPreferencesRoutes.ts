import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { UserPreferences } from '../models/UserPreferences';
import { AppError, ErrorType, ValidationError } from '../types/errors';
import { ErrorMessages } from '../constants/errorMessages';
import { UserPreferencesController } from '../controllers/UserPreferencesController';

const router = express.Router();

// ユーザー設定の取得
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const preferences = await UserPreferences.findOne({ userId });

        if (!preferences) {
            return res.json({
                theme: 'dark',
                language: 'ja',
                notifications: true
            });
        }

        res.json(preferences);
    } catch (error) {
        throw new AppError({
            statusCode: 500,
            message: ErrorMessages[ErrorType.SERVER].ja,
            type: ErrorType.SERVER
        });
    }
});

// ユーザー設定の更新
interface UpdatePreferencesBody {
    theme?: 'light' | 'dark';
    language?: 'ja' | 'en';
    notifications?: boolean;
}

router.put('/', authenticateToken, async (req: Request<{}, {}, UpdatePreferencesBody>, res: Response) => {
    try {
        const userId = req.user.id;
        const { theme, language, notifications } = req.body;

        // 入力値の検証
        if (theme && !['light', 'dark'].includes(theme)) {
            throw new ValidationError(
                ErrorMessages[ErrorType.VALIDATION].ja,
                ['無効なテーマが指定されました']
            );
        }

        if (language && !['ja', 'en'].includes(language)) {
            throw new ValidationError(
                ErrorMessages[ErrorType.VALIDATION].ja,
                ['無効な言語が指定されました']
            );
        }

        if (notifications !== undefined && typeof notifications !== 'boolean') {
            throw new ValidationError(
                ErrorMessages[ErrorType.VALIDATION].ja,
                ['通知設定は真偽値で指定してください']
            );
        }

        const preferences = await UserPreferences.findOneAndUpdate(
            { userId },
            {
                $set: {
                    theme: theme || 'dark',
                    language: language || 'ja',
                    notifications: notifications ?? true
                }
            },
            { upsert: true, new: true }
        );

        res.json({
            message: '設定を更新しました',
            preferences
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError({
            statusCode: 500,
            message: ErrorMessages[ErrorType.SERVER].ja,
            type: ErrorType.SERVER
        });
    }
});

// 占い設定の更新
router.put('/fortune', authenticateToken, UserPreferencesController.updateFortunePreferences);

// AIチャット設定の更新
router.put('/ai-chat', authenticateToken, UserPreferencesController.updateAIChatPreferences);

// 表示設定の更新
router.put('/display', authenticateToken, UserPreferencesController.updateDisplayPreferences);

// プライバシー設定の更新
router.put('/privacy', authenticateToken, UserPreferencesController.updatePrivacySettings);

export default router; 