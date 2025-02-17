import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { supabase } from './config/supabase.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORSの設定（動的にオリジンを判定）
app.use(
  cors({
    origin: (origin, callback) => {
      // リクエスト元がundefinedの場合も許可する
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://192.168.3.44:5173',
        'http://192.168.3.44:5174'
      ];
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error(`CORSエラー: ${origin} は許可されていません`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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
      .insert([insertData])
      .select()
      .single();
    
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

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;