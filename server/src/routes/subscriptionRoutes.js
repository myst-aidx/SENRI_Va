const { Router } = require('express');
const router = Router();
const { createLogger } = require('../utils/logger');
const { User } = require('../models/User');
const { ErrorType } = require('../types/errors');

const logger = createLogger('SubscriptionRoutes');

// サブスクリプションプランの取得
router.get('/plans', (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: '無料プラン',
        price: 0,
        features: [
          '基本的な占い機能',
          '1日1回の占い',
          '結果の履歴（最新3件）'
        ]
      },
      {
        id: 'basic',
        name: 'ベーシックプラン',
        price: 500,
        features: [
          '全ての占い機能',
          '1日3回まで占い可能',
          '結果の履歴（最新10件）',
          'AIによる詳細な解説'
        ]
      },
      {
        id: 'premium',
        name: 'プレミアムプラン',
        price: 1000,
        features: [
          '全ての占い機能',
          '無制限の占い',
          '結果の履歴（無制限）',
          'AIによる詳細な解説',
          'プレミアムサポート',
          'カスタム占い設定'
        ]
      }
    ];

    res.json(plans);
  } catch (error) {
    logger.error('Error fetching subscription plans:', error);
    res.status(500).json({
      message: 'サブスクリプションプランの取得に失敗しました。',
      type: ErrorType.SERVER
    });
  }
});

// 現在のサブスクリプション状態の取得
router.get('/status', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: '認証が必要です。',
        type: ErrorType.AUTH
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'ユーザーが見つかりません。',
        type: ErrorType.NOT_FOUND
      });
    }

    res.json({
      currentPlan: user.subscriptionPlan || 'free',
      endDate: user.subscriptionEndDate
    });
  } catch (error) {
    logger.error('Error fetching subscription status:', error);
    res.status(500).json({
      message: 'サブスクリプション状態の取得に失敗しました。',
      type: ErrorType.SERVER
    });
  }
});

// サブスクリプションの更新
router.post('/upgrade', async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: '認証が必要です。',
        type: ErrorType.AUTH
      });
    }

    if (!planId) {
      return res.status(400).json({
        message: 'プランIDが必要です。',
        type: ErrorType.VALIDATION
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'ユーザーが見つかりません。',
        type: ErrorType.NOT_FOUND
      });
    }

    // プランの更新処理
    user.subscriptionPlan = planId;
    user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30日後
    await user.save();

    res.json({
      message: 'サブスクリプションを更新しました。',
      plan: planId,
      endDate: user.subscriptionEndDate
    });
  } catch (error) {
    logger.error('Error upgrading subscription:', error);
    res.status(500).json({
      message: 'サブスクリプションの更新に失敗しました。',
      type: ErrorType.SERVER
    });
  }
});

// サブスクリプションのキャンセル
router.post('/cancel', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: '認証が必要です。',
        type: ErrorType.AUTH
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'ユーザーが見つかりません。',
        type: ErrorType.NOT_FOUND
      });
    }

    // サブスクリプションのキャンセル処理
    user.subscriptionPlan = 'free';
    user.subscriptionEndDate = null;
    await user.save();

    res.json({
      message: 'サブスクリプションをキャンセルしました。'
    });
  } catch (error) {
    logger.error('Error canceling subscription:', error);
    res.status(500).json({
      message: 'サブスクリプションのキャンセルに失敗しました。',
      type: ErrorType.SERVER
    });
  }
});

module.exports = router;
