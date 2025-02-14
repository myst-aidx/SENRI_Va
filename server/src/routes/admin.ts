import { Router, Request, Response } from 'express';

const router = Router();

// 簡易な管理用ルートの実装（必要に応じて内容を拡張してください）
router.get('/', (req: Request, res: Response) => {
  res.send('Admin route');
});

export default router; 