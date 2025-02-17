import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

// テストユーザーの情報を生成する関数
function generateTestUserData(index: number) {
  const userNumber = (index + 1).toString().padStart(2, '0');
  return {
    email: `tester${userNumber}@senri-test.com`,
    password: `SenriTest${userNumber}!`,
    first_name: `テスト${userNumber}`,
    last_name: '太郎',
    age_group: ['18-24', '25-34', '35-44', '45-54', '55-64'][Math.floor(Math.random() * 5)],
    gender: ['male', 'female', 'other'][Math.floor(Math.random() * 3)],
    interests: [
      ['fortune-telling', 'astrology', 'tarot'],
      ['fortune-telling', 'spirituality'],
      ['astrology', 'numerology'],
      ['tarot', 'fortune-telling'],
      ['spirituality', 'astrology', 'numerology']
    ][Math.floor(Math.random() * 5)],
    frequency: ['daily', 'weekly', 'monthly'][Math.floor(Math.random() * 3)]
  };
}

// ユーザー情報をCSVファイルに保存する関数
function saveUserCredentials(users: any[]) {
  const csvContent = ['Email,Password,FirstName,LastName'].concat(
    users.map(user => `${user.email},${user.password},${user.first_name},${user.last_name}`)
  ).join('\n');

  const filePath = path.join(process.cwd(), 'test_users_credentials.csv');
  fs.writeFileSync(filePath, csvContent);
  console.log(`Credentials saved to: ${filePath}`);
}

async function createTestUsers() {
  try {
    console.log('Starting test users creation...');
    const users = [];

    for (let i = 0; i < 30; i++) {
      const userData = generateTestUserData(i);
      users.push(userData);

      console.log(`\nCreating user ${i + 1}/30: ${userData.email}`);

      try {
        // パスワードのハッシュ化
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(userData.password, salt);

        // ユーザーの作成
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            email: userData.email,
            password_hash: passwordHash,
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: 'user',
            is_active: true,
            email_verified: true
          })
          .select()
          .single();

        if (userError) {
          console.error(`Error creating user ${userData.email}:`, userError);
          continue;
        }

        // ユーザー設定の作成
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
              favorite_types: ['daily', 'love', 'career'],
              excluded_topics: []
            }
          });

        if (prefError) {
          console.error(`Error creating preferences for ${userData.email}:`, prefError);
          continue;
        }

        // アンケート回答の作成
        const { error: surveyError } = await supabase
          .from('survey_responses')
          .insert({
            user_id: newUser.id,
            survey_id: '123e4567-e89b-12d3-a456-426614174000',
            answers: {
              age_group: userData.age_group,
              gender: userData.gender,
              interests: userData.interests,
              frequency: userData.frequency,
              preferred_types: ['love', 'career', 'daily'],
              feedback: 'テスト利用開始前の初期データです。'
            },
            completed_at: new Date().toISOString()
          });

        if (surveyError) {
          console.error(`Error creating survey response for ${userData.email}:`, surveyError);
          continue;
        }

        // サンプルの占い履歴を作成
        const { error: fortuneError } = await supabase
          .from('fortune_history')
          .insert({
            user_id: newUser.id,
            fortune_type: 'daily',
            question: 'テスト用の質問です',
            answer: 'テスト用の回答です。実際の利用開始後に更新されます。',
            sentiment: 'neutral',
            accuracy_rating: null,
            user_feedback: null
          });

        if (fortuneError) {
          console.error(`Error creating fortune history for ${userData.email}:`, fortuneError);
          continue;
        }

        console.log(`Successfully created all data for ${userData.email}`);
      } catch (error) {
        console.error(`Error processing user ${userData.email}:`, error);
      }
    }

    // ユーザー認証情報をCSVファイルに保存
    saveUserCredentials(users);

    console.log('\nTest users creation completed!');
    console.log('Please check test_users_credentials.csv for login information.');

  } catch (error) {
    console.error('Failed to create test users:', error);
  }
}

createTestUsers().catch(console.error); 