import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { supabase } from './config/supabase.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

// CORSミドルウェアを追加
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ヘルスチェックエンドポイントを修正（より詳細な情報を含める）
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    server: {
      port: port,
      uptime: process.uptime()
    },
    supabase: {
      connected: !!supabase,
      url: process.env.SUPABASE_URL ? 'configured' : 'not configured'
    }
  });
});

// アンケート送信エンドポイント
app.post('/api/survey', async (req, res) => {
  try {
    const { submittedAt, ...responses } = req.body;
    if (!submittedAt) {
      return res.status(400).json({ message: 'submittedAtが必要です' });
    }
    
    // リクエストボディのログ出力
    console.log('Request body:', req.body);
    
    // Supabaseのテーブル定義に合わせて、必須フィールドが不足していれば適宜補完する
    const userId = responses.user_id || 'anonymous';
    const surveyId = responses.survey_id || 'default_survey';
    
    // 挿入するデータの内容をログ出力
    const insertData = {
      user_id: userId,
      survey_id: surveyId,
      answers: responses,
      created_at: new Date(submittedAt).toISOString(),
      completed_at: new Date().toISOString()
    };
    console.log('Inserting data:', insertData);
    
    const { data, error } = await supabase
      .from('survey_responses')
      .insert([insertData]);
    
    if (error) {
      console.error('Survey save error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return res.status(500).json({ 
        message: 'アンケートの保存に失敗しました。', 
        error: error.message,
        details: error.details,
        hint: error.hint 
      });
    }
    
    res.status(201).json({
      message: 'アンケートが正常に送信されました。',
      survey: data
    });
  } catch (error) {
    console.error('アンケート送信エラー詳細:', error);
    res.status(500).json({ 
      message: 'アンケートの送信に失敗しました。', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

// エラーハンドリングミドルウェア（他のルートの後に追加）
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// サーバーの起動を修正（エラーハンドリングを追加）
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Health check endpoint: http://localhost:${port}/health`);
}).on('error', (error) => {
  console.error('Failed to start server:', error);
});

export default app;