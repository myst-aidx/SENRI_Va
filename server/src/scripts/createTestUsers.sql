-- 既存のテストユーザーデータを削除
DELETE FROM public.users 
WHERE email LIKE 'tester%@senri-test.com';

-- アンケート回答者のデータからテストユーザーを作成
DO $$
DECLARE
    survey_record RECORD;
    user_id UUID;
BEGIN
    -- 既存のテストユーザーを削除
    DELETE FROM public.users 
    WHERE email LIKE 'tester%@senri-test.com';

    -- アンケート回答からテストユーザーを作成
    FOR survey_record IN 
        SELECT 
            sr.answers->>'contact_email' as contact_email,
            sr.answers->>'test_user_name' as test_user_name,
            sr.answers->>'referrer_name' as referrer_name,
            sr.answers->>'experience' as experience,
            sr.answers->>'activityType' as activity_type,
            sr.answers->>'fortuneTypes' as fortune_types,
            sr.answers->>'deviceUsage' as device_usage,
            sr.id as survey_id
        FROM survey_responses sr
        WHERE sr.completed_at IS NOT NULL
        ORDER BY sr.created_at
        LIMIT 30
    LOOP
        -- テストユーザーの作成
        INSERT INTO public.users (
            email,
            password_hash,
            first_name,
            last_name,
            role,
            is_active,
            email_verified,
            contact_email,
            referrer_name,
            test_user_name
        ) VALUES (
            'tester' || LPAD(CAST(ROW_NUMBER() OVER () AS TEXT), 2, '0') || '@senri-test.com',
            crypt('SenriTest' || LPAD(CAST(ROW_NUMBER() OVER () AS TEXT), 2, '0') || '!', gen_salt('bf')),
            survey_record.test_user_name,
            'テストユーザー',
            'user',
            true,
            true,
            survey_record.contact_email,
            survey_record.referrer_name,
            survey_record.test_user_name
        ) RETURNING id INTO user_id;

        -- ユーザー設定の作成
        INSERT INTO public.user_preferences (
            user_id,
            theme,
            language,
            notification_settings,
            fortune_preferences
        ) VALUES (
            user_id,
            'light',
            'ja',
            jsonb_build_object(
                'email', false,
                'push', false,
                'sms', false
            ),
            jsonb_build_object(
                'favorite_types', COALESCE(survey_record.fortune_types::jsonb, '[]'::jsonb),
                'experience', survey_record.experience,
                'activity_type', survey_record.activity_type::jsonb,
                'device_usage', survey_record.device_usage
            )
        );

        -- アンケート回答とユーザーを紐付け
        UPDATE survey_responses
        SET user_id = user_id
        WHERE id = survey_record.survey_id;

        RAISE NOTICE 'Created test user for survey response: %', survey_record.contact_email;
    END LOOP;
END $$;

-- 作成されたテストユーザーの確認
SELECT 
    u.email as test_account,
    u.contact_email,
    u.test_user_name,
    u.referrer_name,
    up.fortune_preferences->>'experience' as experience,
    up.fortune_preferences->>'activity_type' as activity_type,
    up.fortune_preferences->>'favorite_types' as fortune_types,
    up.fortune_preferences->>'device_usage' as device_usage,
    sr.created_at as survey_submitted_at
FROM users u
LEFT JOIN user_preferences up ON u.id = up.user_id
LEFT JOIN survey_responses sr ON u.id = sr.user_id
WHERE u.email LIKE 'tester%@senri-test.com'
ORDER BY u.email; 