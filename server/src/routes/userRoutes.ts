import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { authenticateToken } from '../middleware/auth';
import { AppError, ErrorType, ValidationError, NotFoundError, DatabaseError } from '../types/errors';
import { ErrorMessages } from '../constants/errorMessages';
import bcrypt from 'bcryptjs';

const router = express.Router();

// 画像バリデーション用の定数
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Base64画像のバリデーション関数
interface ImageValidationResult {
    isValid: boolean;
    error?: string;
}

const validateImage = (base64Image: string): ImageValidationResult => {
    if (!base64Image.startsWith('data:image/')) {
        return { isValid: false, error: '無効な画像形式です' };
    }

    const sizeInBytes = Buffer.from(base64Image.split(',')[1], 'base64').length;
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (sizeInBytes > maxSizeInBytes) {
        return { isValid: false, error: '画像サイズが大きすぎます（最大5MB）' };
    }

    return { isValid: true };
};

// 全ユーザー削除（開発用）
router.get('/db/reset', async (req: Request, res: Response) => {
    try {
        await User.deleteMany({}); // 全ユーザーを削除

        // 管理者ユーザーを作成（統一：admin@senri.com / admin123）
        const admin = new User({
            email: 'admin@senri.com',
            password: 'admin123',
            name: '管理者',
            role: 'admin',
            isSubscribed: true,
            subscriptionType: 'premium',
            subscriptionEndDate: new Date('2025-12-31')
        });

        await admin.save();
        
        res.json({
            message: 'Database reset successful',
            adminCredentials: {
                email: 'admin@senri.com',
                password: 'admin123'
            }
        });
    } catch (error) {
        console.error('Error resetting database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DBの全ユーザー情報を取得（管理者用）
router.get('/db/all', async (req: Request, res: Response) => {
    try {
        const users = await User.find({});
        res.json({
            total: users.length,
            users: users.map(user => ({
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }))
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ユーザーを削除（管理者用）
router.delete('/db/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 全ユーザー情報を取得（管理者用）
router.get('/all', authenticateToken, async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, { password: 0 }); // パスワードは除外
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ユーザー情報の取得
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user.id, { password: 0 });
        if (!user) {
            throw new AppError({
                statusCode: 404,
                message: ErrorMessages[ErrorType.NOT_FOUND].ja,
                type: ErrorType.NOT_FOUND
            });
        }
        res.json(user);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new DatabaseError(ErrorMessages[ErrorType.SERVER].ja);
    }
});

// ユーザー情報の更新
interface UpdateUserBody {
    name: string;
    birthDate: string;
    gender: string;
    profileImage?: string;
}

router.put('/me', authenticateToken, async (req: Request<{}, {}, UpdateUserBody>, res: Response) => {
    try {
        const { name, birthDate, gender, profileImage } = req.body;

        // 入力値の検証
        if (!name || !birthDate || !gender) {
            throw new ValidationError(
                ErrorMessages[ErrorType.VALIDATION].ja,
                ['必須項目が入力されていません']
            );
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            throw new AppError({
                statusCode: 404,
                message: ErrorMessages[ErrorType.NOT_FOUND].ja,
                type: ErrorType.NOT_FOUND
            });
        }

        // 画像のバリデーション
        if (profileImage) {
            const imageValidation = validateImage(profileImage);
            if (!imageValidation.isValid) {
                throw new ValidationError(
                    ErrorMessages[ErrorType.VALIDATION].ja,
                    [imageValidation.error || '画像が無効です']
                );
            }
        }

        // 日付のバリデーション
        const formattedBirthDate = birthDate ? new Date(birthDate) : undefined;
        if (formattedBirthDate && isNaN(formattedBirthDate.getTime())) {
            throw new ValidationError(
                ErrorMessages[ErrorType.VALIDATION].ja,
                ['無効な日付形式です']
            );
        }

        // ユーザー情報の更新
        Object.assign(user, {
            name,
            birthDate: formattedBirthDate,
            gender,
            profileImage,
            updatedAt: new Date()
        });

        await user.save();
        res.json({
            message: 'ユーザー情報を更新しました',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                birthDate: user.birthDate,
                gender: user.gender,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new DatabaseError(ErrorMessages[ErrorType.SERVER].ja);
    }
});

// テストユーザーの一括削除（管理者用）- GET版
router.get('/db/cleanup', async (req: Request, res: Response) => {
    try {
        // test@example.comやtest_で始まるメールアドレスのユーザーを削除
        const result = await User.deleteMany({
            email: {
                $regex: '^test',
            }
        });
        
        res.json({
            message: 'Test users cleaned up successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error cleaning up test users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// サブスクリプション状態の取得
router.get('/subscription/status', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new AppError({
                statusCode: 404,
                message: ErrorMessages[ErrorType.NOT_FOUND].ja,
                type: ErrorType.NOT_FOUND
            });
        }

        res.json({
            isSubscribed: user.isSubscribed,
            plan: user.subscriptionPlan,
            endDate: user.subscriptionEndDate
        });
    } catch (error) {
        next(error);
    }
});

export default router; 