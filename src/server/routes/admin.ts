import { Router } from 'express';
import { SurveyResponse } from '../models/SurveyResponse';
import { AdminSettings } from '../models/AdminSettings';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// 管理者認証が必要なエンドポイントには authenticateAdmin ミドルウェアを適用
router.get('/survey-responses', authenticateAdmin, async (req, res) => {
  try {
    const responses = await SurveyResponse.find().sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    res.status(500).json({ error: 'Failed to fetch survey responses' });
  }
});

router.get('/settings', authenticateAdmin, async (req, res) => {
  try {
    let settings = await AdminSettings.findOne({ _id: 'default' });
    if (!settings) {
      settings = await AdminSettings.create({ _id: 'default' });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ error: 'Failed to fetch admin settings' });
  }
});

router.put('/settings', authenticateAdmin, async (req, res) => {
  try {
    const settings = await AdminSettings.findOneAndUpdate(
      { _id: 'default' },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ error: 'Failed to update admin settings' });
  }
});

export default router; 