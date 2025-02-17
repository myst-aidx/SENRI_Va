BEGIN;

-- ユーザー設定テーブルに user_id に対するユニーク制約が作成されていない場合は、作成する必要があります。
-- ※このユニーク制約は、1ユーザーにつき1つの設定が存在することを保証します。
ALTER TABLE public.user_preferences
ADD CONSTRAINT user_preferences_user_id_unique UNIQUE(user_id);

DO $$ 
DECLARE 
    test_user_id UUID;
BEGIN
    -- テストユーザーのIDを取得
    SELECT id INTO STRICT test_user_id 
    FROM public.users 
    WHERE email = 'test@example.com';

    RAISE NOTICE 'Found user ID: %', test_user_id;

    -- ユーザー設定を作成または更新
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
        '{"email": true, "push": true, "sms": false}'::jsonb,
        '{"favorite_types": ["daily", "love"], "excluded_topics": []}'::jsonb
    )
    ON CONFLICT (user_id) DO UPDATE SET
        theme = EXCLUDED.theme,
        language = EXCLUDED.language,
        notification_settings = EXCLUDED.notification_settings,
        fortune_preferences = EXCLUDED.fortune_preferences;

    RAISE NOTICE 'User preferences created';

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
        }'::jsonb,
        CURRENT_TIMESTAMP
    );

    RAISE NOTICE 'Survey response created';

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

    RAISE NOTICE 'Fortune history created';

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error occurred: %', SQLERRM;
    RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
END $$;

COMMIT;

-- データの確認
SELECT 
    u.email,
    u.role,
    up.theme,
    up.language,
    sr.answers->>'feedback' AS survey_feedback,
    fh.question,
    fh.answer
FROM public.users u
LEFT JOIN public.user_preferences up ON u.id = up.user_id
LEFT JOIN public.survey_responses sr ON u.id = sr.user_id
LEFT JOIN public.fortune_history fh ON u.id = fh.user_id
WHERE u.email = 'test@example.com'; 