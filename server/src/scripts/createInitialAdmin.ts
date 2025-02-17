import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createInitialAdmin() {
  try {
    // 管理者アカウントの設定
    const adminEmail = 'admin@senri.com';
    const adminPassword = 'admin123'; // 本番環境では強力なパスワードに変更してください
    
    // 既存の管理者をチェック
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (existingAdmin) {
      console.log('Admin account already exists');
      return;
    }

    // パスワードのハッシュ化
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    // 管理者アカウントの作成
    const { error: userError } = await supabase
      .from('users')
      .insert({
        email: adminEmail,
        password_hash: passwordHash,
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        is_active: true,
        email_verified: true
      });

    if (userError) {
      throw userError;
    }

    // 管理者の設定を作成
    const { error: prefError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: (await supabase
          .from('users')
          .select('id')
          .eq('email', adminEmail)
          .single()).data?.id,
        theme: 'light',
        language: 'ja',
        notification_settings: {
          email: true,
          push: true,
          sms: false
        },
        fortune_preferences: {
          favorite_types: [],
          excluded_topics: []
        }
      });

    if (prefError) {
      throw prefError;
    }

    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Failed to create admin account:', error);
  }
}

createInitialAdmin().catch(console.error);