const { Router } = require('express');
const router = Router();
const { validateSignupInput, validateRefreshToken } = require('../middleware/validation');
const { AuthController } = require('../controllers/AuthController');
const { createLogger } = require('../utils/logger');
const { ErrorType } = require('../types/errors');
const { AppError, AuthError } = require('../types/errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const authController = AuthController.getInstance();
const logger = createLogger('AuthRoutes');

// サインアップ
router.post('/signup', validateSignupInput, async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // ユーザーの重複チェック
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'このメールアドレスは既に登録されています。',
                type: ErrorType.VALIDATION
            });
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
    }
    catch (error) {
        logger.error('Signup error:', error);
        res.status(500).json({
            message: 'サーバーエラーが発生しました。',
            type: ErrorType.SERVER
        });
    }
});

// ログイン
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // ユーザーの存在確認
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('ユーザーが存在しません:', email);
            return res.status(401).json({
                message: 'メールアドレスまたはパスワードが正しくありません。',
                type: ErrorType.AUTH
            });
        }

        // パスワードの検証
        const isValidPassword = await bcrypt.compare(password, user.password);
        logger.info('パスワード検証結果:', isValidPassword);

        if (!isValidPassword) {
            logger.warn('パスワードが一致しません:', email);
            return res.status(401).json({
                message: 'メールアドレスまたはパスワードが正しくありません。',
                type: ErrorType.AUTH
            });
        }

        // JWTトークンの生成
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        logger.error('ログインエラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// ログアウト
router.post('/logout', async (req, res) => {
    try {
        // クライアント側でトークンを削除するため、
        // サーバー側では特に処理は必要ありません
        res.json({ message: 'ログアウトしました。' });
    }
    catch (error) {
        logger.error('Logout error:', error);
        res.status(500).json({
            message: 'サーバーエラーが発生しました。',
            type: ErrorType.SERVER
        });
    }
});

// トークンの検証
router.post('/verify-token', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({
                message: 'トークンが提供されていません。',
                type: ErrorType.AUTH
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: 'ユーザーが見つかりません。',
                type: ErrorType.AUTH
            });
        }

        res.json({
            valid: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        logger.error('Token verification error:', error);
        res.status(401).json({
            message: 'トークンが無効です。',
            type: ErrorType.AUTH
        });
    }
});

module.exports = router;
