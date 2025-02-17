-- テストユーザーのIDを変数に設定
DO $$ 
DECLARE 
    test_user_id UUID;
BEGIN
    -- テストユーザーのIDを取得
    SELECT id INTO test_user_id 
    FROM public.users 
    WHERE email = 'test@example.com';

    -- ユーザー設定を作成
    INSERT INTO public.user_preferences (
        user_id,
        theme,
        language,
        notification_settings,
        fortune_preferences
    ) VALUES (
        test_user_id,
        'light',
        'ja',
        '{"email": true, "push": true, "sms": false}',
        '{"favorite_types": ["daily", "love"], "excluded_topics": []}'
    )
    ON CONFLICT (user_id) DO NOTHING;

    -- アンケート回答を作成
    INSERT INTO public.survey_responses (
        user_id,
        survey_id,
        answers,
        completed_at
    ) VALUES (
        test_user_id,
        '123e4567-e89b-12d3-a456-426614174000',
        '{
            "age_group": "25-34",
            "gender": "female",
            "interests": ["fortune-telling", "astrology"],
            "frequency": "weekly",
            "preferred_types": ["love", "career", "daily"],
            "feedback": "このサービスの利用を楽しみにしています！"
        }',
        CURRENT_TIMESTAMP
    );

    -- 占い履歴を作成
    INSERT INTO public.fortune_history (
        user_id,
        fortune_type,
        question,
        answer,
        sentiment,
        accuracy_rating,
        user_feedback
    ) VALUES (
        test_user_id,
        'daily',
        '今日の運勢は？',
        '今日はとても良い一日になりそうです。新しい出会いがあるかもしれません。',
        'positive',
        4,
        '当たっていました！'
    );

    -- 作成したデータを確認
    RAISE NOTICE 'Created data for user: %', test_user_id;
END $$; 