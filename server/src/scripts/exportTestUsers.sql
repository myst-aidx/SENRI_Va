COPY (
    SELECT 
        email,
        'SenriTest' || LPAD(REGEXP_REPLACE(email, '^tester(\d+)@.*$', '\1'), 2, '0') || '!' as password,
        first_name,
        last_name,
        created_at::text as created_at
    FROM users 
    WHERE email LIKE 'tester%@senri-test.com'
    ORDER BY email
) TO STDOUT WITH CSV HEADER;

-- テストユーザーの認証情報を確認用のSELECT
SELECT 
    email,
    'SenriTest' || LPAD(REGEXP_REPLACE(email, '^tester(\d+)@.*$', '\1'), 2, '0') || '!' as password,
    first_name,
    last_name,
    created_at::text as created_at
FROM users 
WHERE email LIKE 'tester%@senri-test.com'
ORDER BY email; 