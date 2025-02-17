import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function insertTestData() {
  try {
    // 既存のユーザーIDを取得
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'test@example.com')
      .single();

    if (userError) {
      throw userError;
    }

    console.log('Found user:', user.id);

    // ユーザー設定を作成
    console.log('Creating user preferences...');
    const { error: prefError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: user.id,
        theme: 'light',
        language: 'ja',
        notification_settings: {
          email: true,
          push: true,
          sms: false
        },
        fortune_preferences: {
          favorite_types: ['daily', 'love'],
          excluded_topics: []
        }
      });

    if (prefError) {
      throw prefError;
    }

    // アンケート回答を作成
    console.log('Creating survey response...');
    const { error: surveyError } = await supabase
      .from('survey_responses')
      .insert({
        user_id: user.id,
        survey_id: '123e4567-e89b-12d3-a456-426614174000',
        answers: {
          age_group: '25-34',
          gender: 'female',
          interests: ['fortune-telling', 'astrology'],
          frequency: 'weekly',
          preferred_types: ['love', 'career', 'daily'],
          feedback: 'このサービスの利用を楽しみにしています！'
        },
        completed_at: new Date().toISOString()
      });

    if (surveyError) {
      throw surveyError;
    }

    // 占い履歴を作成
    console.log('Creating fortune history...');
    const { error: fortuneError } = await supabase
      .from('fortune_history')
      .insert({
        user_id: user.id,
        fortune_type: 'daily',
        question: '今日の運勢は？',
        answer: '今日はとても良い一日になりそうです。新しい出会いがあるかもしれません。',
        sentiment: 'positive',
        accuracy_rating: 4,
        user_feedback: '当たっていました！'
      });

    if (fortuneError) {
      throw fortuneError;
    }

    // 作成したデータを確認
    console.log('Verifying created data...');
    const { data: result, error: verifyError } = await supabase
      .from('users')
      .select(`
        email,
        role,
        user_preferences (
          theme,
          language
        ),
        survey_responses (
          answers
        ),
        fortune_history (
          question,
          answer
        )
      `)
      .eq('id', user.id)
      .single();

    if (verifyError) {
      throw verifyError;
    }

    console.log('Created data:', JSON.stringify(result, null, 2));
    console.log('All test data created successfully!');

  } catch (error) {
    console.error('Error creating test data:', error);
  }
}

insertTestData().catch(console.error); 