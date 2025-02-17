import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase configuration');
}

// 日本語文字列をUTF-8エンコーディングで処理する関数
function encodeJapanese(text: string): string {
  return Buffer.from(text).toString('utf8');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    }
  }
});

async function createTestData() {
  try {
    console.log('Starting test data creation...');

    // テストユーザーの作成
    const testUsers = [
      {
        email: 'test1@example.com',
        password: 'test123',
        first_name: 'Test',
        last_name: 'User1'
      },
      {
        email: 'test2@example.com',
        password: 'test123',
        first_name: 'Test',
        last_name: 'User2'
      }
    ];

    // 固定のsurvey_id（UUID）を設定
    const surveyId = '123e4567-e89b-12d3-a456-426614174000';
    console.log('Using survey ID:', surveyId);

    for (const user of testUsers) {
      console.log(`\nProcessing user: ${user.email}`);

      try {
        // 既存ユーザーチェック
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking existing user:', checkError);
          continue;
        }

        if (existingUser) {
          console.log(`User ${user.email} already exists, skipping...`);
          continue;
        }

        // パスワードのハッシュ化
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(user.password, salt);

        // ユーザーの作成
        console.log('Creating user...');
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            email: user.email,
            password_hash: passwordHash,
            first_name: user.first_name,
            last_name: user.last_name,
            role: 'user',
            is_active: true,
            email_verified: true
          })
          .select()
          .single();

        if (userError) {
          console.error('Error creating user:', userError);
          continue;
        }
        console.log('User created successfully:', newUser.id);

        // ユーザー設定の作成
        console.log('Creating user preferences...');
        const { error: prefError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: newUser.id,
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
          console.error('Error creating user preferences:', prefError);
          continue;
        }
        console.log('User preferences created successfully');

        // アンケート回答の作成
        console.log('Creating survey response...');
        const { error: surveyError } = await supabase
          .from('survey_responses')
          .insert({
            user_id: newUser.id,
            survey_id: surveyId,
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
          console.error('Error creating survey response:', surveyError);
          continue;
        }
        console.log('Survey response created successfully');

        // テスト用の占い履歴を作成
        console.log('Creating fortune history...');
        const { error: fortuneError } = await supabase
          .from('fortune_history')
          .insert({
            user_id: newUser.id,
            fortune_type: 'daily',
            question: '今日の運勢は？',
            answer: '今日はとても良い一日になりそうです。新しい出会いがあるかもしれません。',
            sentiment: 'positive',
            accuracy_rating: 4,
            user_feedback: '当たっていました！'
          });

        if (fortuneError) {
          console.error('Error creating fortune history:', fortuneError);
          continue;
        }
        console.log('Fortune history created successfully');

        console.log(`All data created successfully for user: ${user.email}`);
      } catch (userError: any) {
        console.error(`Error processing user ${user.email}:`, userError);
        if ('message' in userError) console.error('Error message:', userError.message);
        if ('details' in userError) console.error('Error details:', userError.details);
      }
    }

    console.log('\nAll test data creation completed successfully');
  } catch (error: any) {
    console.error('Failed to create test data:', error);
    if ('message' in error) console.error('Error message:', error.message);
    if ('details' in error) console.error('Error details:', error.details);
  }
}

createTestData().catch(console.error); 