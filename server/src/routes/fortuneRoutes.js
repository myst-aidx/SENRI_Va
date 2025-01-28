const { Router } = require('express');
const router = Router();
const { FortuneHistory } = require('../models/FortuneHistory');
const { authenticateToken } = require('../middleware/auth');
const { createLogger } = require('../utils/logger');
const { ErrorType } = require('../types/errors');

const logger = createLogger('FortuneRoutes');

// 占い結果の保存
router.post('/save', authenticateToken, async (req, res) => {
    try {
        logger.info('Saving fortune result...');
        const { type, question, result } = req.body;
        const userId = req.user.id;

        // バリデーション
        if (!type || !question || !result) {
            return res.status(400).json({
                message: '必須フィールドが不足しています。',
                type: ErrorType.VALIDATION
            });
        }

        const fortuneHistory = new FortuneHistory({
            userId,
            type,
            question,
            result
        });

        await fortuneHistory.save();
        logger.info('Fortune result saved successfully');

        res.status(201).json({
            message: '占い結果を保存しました',
            data: fortuneHistory
        });
    } catch (error) {
        logger.error('Error saving fortune result:', error);
        res.status(500).json({
            message: '占い結果の保存に失敗しました',
            type: ErrorType.SERVER
        });
    }
});

// 履歴の取得
router.get('/history', authenticateToken, async (req, res) => {
    try {
        logger.info('Fetching fortune history...');
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 50;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const history = await FortuneHistory.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await FortuneHistory.countDocuments({ userId });

        logger.info(`Found ${history.length} history items`);
        res.json({
            data: history,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Error fetching fortune history:', error);
        res.status(500).json({
            message: '履歴の取得に失敗しました',
            type: ErrorType.SERVER
        });
    }
});

module.exports = router;
