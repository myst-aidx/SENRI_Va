import { Router, Request, Response } from 'express';
import { Survey } from '../models/Survey';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { submittedAt, ...responses } = req.body;
    if (!submittedAt) {
      return res.status(400).json({ message: 'submittedAtが必要です' });
    }

    const newSurvey = new Survey({
      submittedAt: new Date(submittedAt),
      responses: responses
    });

    await newSurvey.save();

    res.status(201).json({
      message: 'アンケートが正常に送信されました。',
      survey: newSurvey
    });
  } catch (error) {
    console.error('アンケート送信エラー:', error);
    res.status(500).json({ message: 'アンケートの送信に失敗しました。' });
  }
});

export default router; 