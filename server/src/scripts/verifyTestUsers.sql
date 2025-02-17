-- 1. ユーザー数の確認
SELECT COUNT(*) as total_users 
FROM users 
WHERE email LIKE 'tester%@senri-test.com';

-- 2. 各テーブルのデータ数の確認
SELECT 
    'users' as table_name, COUNT(*) as count 
    FROM users WHERE email LIKE 'tester%@senri-test.com'
UNION ALL
SELECT 
    'user_preferences', COUNT(*) 
    FROM user_preferences up 
    JOIN users u ON up.user_id = u.id 
    WHERE u.email LIKE 'tester%@senri-test.com'
UNION ALL
SELECT 
    'survey_responses', COUNT(*) 
    FROM survey_responses sr 
    JOIN users u ON sr.user_id = u.id 
    WHERE u.email LIKE 'tester%@senri-test.com'
UNION ALL
SELECT 
    'fortune_history', COUNT(*) 
    FROM fortune_history fh 
    JOIN users u ON fh.user_id = u.id 
    WHERE u.email LIKE 'tester%@senri-test.com';

-- 3. 詳細なユーザーデータの確認
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    up.language,
    up.theme,
    sr.answers->>'age_group' as age_group,
    sr.answers->>'gender' as gender,
    sr.answers->>'frequency' as frequency,
    fh.fortune_type,
    fh.sentiment
FROM users u
LEFT JOIN user_preferences up ON u.id = up.user_id
LEFT JOIN survey_responses sr ON u.id = sr.user_id
LEFT JOIN fortune_history fh ON u.id = fh.user_id
WHERE u.email LIKE 'tester%@senri-test.com'
ORDER BY u.email
LIMIT 5;  -- 最初の5件のみ表示

-- 4. 年齢層とジェンダーの分布
SELECT 
    sr.answers->>'age_group' as age_group,
    sr.answers->>'gender' as gender,
    COUNT(*) as count
FROM survey_responses sr
JOIN users u ON sr.user_id = u.id
WHERE u.email LIKE 'tester%@senri-test.com'
GROUP BY sr.answers->>'age_group', sr.answers->>'gender'
ORDER BY age_group, gender;

-- 1. テストユーザー数の確認
SELECT COUNT(*) as total_test_users 
FROM users 
WHERE email LIKE 'tester%@senri-test.com';

-- 2. テストユーザーの基本情報一覧
SELECT 
    email,
    first_name,
    last_name,
    created_at,
    is_active,
    email_verified
FROM users 
WHERE email LIKE 'tester%@senri-test.com'
ORDER BY email;

-- 3. テストユーザーの初期設定確認
SELECT 
    u.email,
    up.theme,
    up.language,
    up.notification_settings,
    up.fortune_preferences
FROM users u
JOIN user_preferences up ON u.id = up.user_id
WHERE u.email LIKE 'tester%@senri-test.com'
ORDER BY u.email
LIMIT 5;  -- 最初の5件のみ表示

-- 4. テストユーザー用の認証情報出力（配布用）
SELECT 
    email,
    'SenriTest' || LPAD(REGEXP_REPLACE(email, '^tester(\d+)@.*$', '\1'), 2, '0') || '!' as password,
    first_name || ' ' || last_name as full_name
FROM users 
WHERE email LIKE 'tester%@senri-test.com'
ORDER BY email; 