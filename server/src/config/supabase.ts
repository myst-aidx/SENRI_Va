import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase configuration');
}

// 匿名ユーザー用のクライアント
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 管理者用のクライアント（サービスロールキーを使用）
export const adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// データベーステーブル名の定数
export const TABLES = {
  USERS: 'users',
  FORTUNE_HISTORY: 'fortune_history',
  CHAT_HISTORY: 'chat_history',
  SURVEY_RESPONSES: 'survey_responses',
  USER_PREFERENCES: 'user_preferences',
  SUBSCRIPTIONS: 'subscriptions',
  ADMIN_SETTINGS: 'admin_settings',
} as const;

// 型定義
export type Tables = typeof TABLES[keyof typeof TABLES];

// データベース操作のユーティリティ関数
export const db = {
  /**
   * テーブルの全レコードを取得
   */
  async getAll<T>(table: Tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*');
    
    if (error) throw error;
    return data as T[];
  },

  /**
   * IDで1レコードを取得
   */
  async getById<T>(table: Tables, id: string) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as T;
  },

  /**
   * 新しいレコードを作成
   */
  async create<T>(table: Tables, data: Partial<T>) {
    const { data: created, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return created as T;
  },

  /**
   * レコードを更新
   */
  async update<T>(table: Tables, id: string, data: Partial<T>) {
    const { data: updated, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updated as T;
  },

  /**
   * レコードを削除
   */
  async delete(table: Tables, id: string) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  /**
   * カスタムクエリの実行
   */
  async query<T>(table: Tables, query: any) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .match(query);
    
    if (error) throw error;
    return data as T[];
  }
}; 