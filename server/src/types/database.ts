export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
  email_verified: boolean;
}

export interface FortuneHistory {
  id: string;
  user_id: string;
  fortune_type: string;
  question: string;
  answer: string;
  created_at: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  accuracy_rating: number | null;
  user_feedback: string | null;
}

export interface ChatHistory {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
  context: string | null;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface SurveyResponse {
  id: string;
  user_id: string;
  survey_id: string;
  answers: Record<string, any>;
  created_at: string;
  completed_at: string | null;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  language: string;
  notification_settings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  fortune_preferences: {
    favorite_types: string[];
    excluded_topics: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  payment_status: 'paid' | 'pending' | 'failed';
  auto_renew: boolean;
}

export interface AdminSettings {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

// データベースのテーブル定義
export interface Database {
  users: User;
  fortune_history: FortuneHistory;
  chat_history: ChatHistory;
  survey_responses: SurveyResponse;
  user_preferences: UserPreferences;
  subscriptions: Subscription;
  admin_settings: AdminSettings;
} 