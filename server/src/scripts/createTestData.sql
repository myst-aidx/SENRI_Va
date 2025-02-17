-- テストユーザーの作成
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test1@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"Test","last_name":"User1"}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'test2@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"Test","last_name":"User2"}', 'authenticated', 'authenticated')
ON CONFLICT (email) DO NOTHING;

-- ユーザー設定の作成
INSERT INTO public.user_preferences (user_id, theme, language, notification_settings, fortune_preferences)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'light', 'ja', 
   '{"email": true, "push": true, "sms": false}',
   '{"favorite_types": ["daily", "love"], "excluded_topics": []}'
  ),
  ('00000000-0000-0000-0000-000000000002', 'light', 'ja',
   '{"email": true, "push": true, "sms": false}',
   '{"favorite_types": ["daily", "love"], "excluded_topics": []}'
  )
ON CONFLICT (user_id) DO NOTHING;

-- アンケート回答の作成
INSERT INTO public.survey_responses (user_id, survey_id, answers, completed_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '123e4567-e89b-12d3-a456-426614174000',
   '{
     "age_group": "25-34",
     "gender": "female",
     "interests": ["fortune-telling", "astrology"],
     "frequency": "weekly",
     "preferred_types": ["love", "career", "daily"],
     "feedback": "このサービスの利用を楽しみにしています！"
   }',
   NOW()
  ),
  ('00000000-0000-0000-0000-000000000002', '123e4567-e89b-12d3-a456-426614174000',
   '{
     "age_group": "35-44",
     "gender": "male",
     "interests": ["fortune-telling", "spirituality"],
     "frequency": "monthly",
     "preferred_types": ["career", "daily"],
     "feedback": "占いの精度が気になります"
   }',
   NOW()
  );

-- 占い履歴の作成
INSERT INTO public.fortune_history (user_id, fortune_type, question, answer, sentiment, accuracy_rating, user_feedback)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'daily',
   '今日の運勢は？',
   '今日はとても良い一日になりそうです。新しい出会いがあるかもしれません。',
   'positive',
   4,
   '当たっていました！'
  ),
  ('00000000-0000-0000-0000-000000000002', 'career',
   '仕事の今後の展望について',
   '新しいプロジェクトのチャンスが来そうです。積極的に挑戦することで、キャリアの転機となるでしょう。',
   'positive',
   5,
   '的確なアドバイスでした'
  ); 