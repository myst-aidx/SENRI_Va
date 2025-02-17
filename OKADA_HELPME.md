# 岡田さんへ：DB関連の問題解決のお願い

## プロジェクト概要
- プロジェクト名：SENRI（占い師向けビジネス支援サービス）
- 開発状況：MVP完成・デプロイ済み
- 主な機能：占い処理、ユーザー管理、アンケート管理
- 技術スタック：TypeScript, React, Node.js, Express

## 関連ファイル構成

### データベース設定関連
\`\`\`
server/
├── src/
│   ├── db.ts                      # メインのDB接続設定
│   ├── types/
│   │   └── errors.ts              # DBエラー型定義
│   └── utils/
│       └── logger.ts              # DB操作のログ設定
├── .env                           # DB接続情報の環境変数
└── .env.example                   # 環境変数のテンプレート
\`\`\`

### MongoDB関連
\`\`\`
server/
├── src/
│   ├── models/
│   │   ├── User.ts                # ユーザーモデル定義
│   │   └── SurveyResponse.ts      # アンケートモデル定義
│   └── controllers/
│       └── AuthController.ts       # ユーザー認証処理
\`\`\`

### PostgreSQL関連（現在未使用だが残存）
\`\`\`
prisma/
├── schema.prisma                  # Prismaスキーマ定義
└── migrations/                    # マイグレーションファイル

server/
└── src/
    └── prisma/
        └── client.ts              # Prismaクライアント設定
\`\`\`

### フロントエンド側のDB関連コード
\`\`\`
src/
├── pages/
│   ├── LoginPage.tsx             # ログインフォーム
│   ├── SignupPage.tsx            # 新規登録フォーム
│   └── SurveyPage.tsx            # アンケートフォーム
└── services/
    └── api.ts                    # APIリクエスト処理
\`\`\`

## 現在の問題点

### 1. ユーザー認証関連のDB書き込みエラー
- 新規ユーザー登録時のDBへの保存が失敗
- bcryptでハッシュ化したパスワードの保存も含めて失敗
- 関連コード: \`server/src/controllers/AuthController.ts\`

### 2. アンケートデータの保存エラー
- ユーザーアンケート結果のDB保存が失敗
- 関連コード: \`server/src/models/SurveyResponse.ts\`

### 3. DB設定の混在
- MongoDBとPostgreSQLの両方の設定が残っている状態
- 現在の\`package.json\`には両方のDBの依存関係が含まれている
- \`prisma\`ディレクトリとMongooseのモデルが共存している

## 試したこと

### MongoDBでの実装（現在のメイン実装）
1. Mongooseスキーマの定義
2. 接続設定の確認（\`server/src/db.ts\`）
3. インデックスの設定

### PostgreSQLでの実装（途中で断念した実装）
1. Prismaを使用したスキーマ定義
2. マイグレーション実行
3. 接続設定の確認

※ PostgreSQLの実装は途中で中断しましたが、関連ファイルや設定が残っている状態です。

## エラー詳細

### 1. 管理者ログインエラー
関連ファイル：
- \`AuthService.js:100\` - ログインリクエストの処理
- \`LoginPage.js:33\` - ログインフォームのハンドラー
- \`LoginPage.js:28\` - handleSubmit関数

エラー内容：
\`\`\`
POST http://localhost:5000/api/auth/login
net::ERR_CONNECTION_REFUSED

Login error: TypeError: Failed to fetch
at loginRequest (AuthService.js:100:28)
at handleSubmit (LoginPage.js:28:36)
\`\`\`

状況：
- 管理者アカウント（admin@senri.com / admin123）でログイン試行
- \`createInitialAdmin.ts\`スクリプトで作成済みのアカウント
- DBへの接続自体が確立できていない可能性が高い
- フロントエンドからバックエンドへのリクエストが到達していない

### 2. アンケート送信エラー
関連ファイル：
- \`SurveyPage.tsx:13\` - アンケートフォームのコンポーネント
- \`SurveyPage.tsx:36\` - アンケート送信処理
- \`SurveyForm.tsx:185\` - フォームのハンドラー

エラー内容：
\`\`\`
POST http://localhost:5000/api/survey
net::ERR_CONNECTION_REFUSED

Survey submission error: Failed to fetch
at handleSubmit (SurveyPage.tsx:13:30)
at SurveyForm.tsx:185
\`\`\`

状況：
- アンケートフォームに入力後、送信ボタンクリック時に発生
- フロントエンドのバリデーションは通過
- バックエンドへのリクエスト送信時に接続エラー
- DBへの保存処理まで到達していない

### 共通の問題点
1. バックエンドサーバーへの接続エラー
   - \`ERR_CONNECTION_REFUSED\`は、サーバーが応答していないことを示す

## 現在の実装状態

### データベース接続設定（MongoDB）
\`\`\`typescript
// server/src/db.ts
export async function connectToDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/senri_db';
  try {
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
}
\`\`\`

### ユーザーモデル（MongoDB）
\`\`\`typescript
// server/src/models/User.ts
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // ... その他のフィールド
});
\`\`\`

### アンケートモデル（MongoDB）
\`\`\`typescript
// server/src/models/SurveyResponse.ts
const surveyResponseSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  },
  responses: [{
    questionId: String,
    answer: Schema.Types.Mixed
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});
\`\`\`

## 環境情報
- Node.js: v18.0.0
- MongoDB: v6.0（メインのDB）
- PostgreSQL: v14（途中で断念したDB）
- OS: Windows 11

## ✅️解決が必要な項目
1. DB選定の最終決定（MongoDBでもPostgreSQLでもOK）
2. 不要なDB関連の依存関係とコードの削除
3. ユーザー認証のDB処理（新規登録・ログイン）
4. アンケート結果の保存処理
5. DB接続の安定性確保

## 依存関係の問題
\`package.json\`に両方のDBの依存関係が含まれています：
\`\`\`json
{
  "dependencies": {
    "mongoose": "^8.10.0",
    "@prisma/client": "^5.x.x",
    "pg": "^8.x.x"
  },
  "devDependencies": {
    "prisma": "^5.x.x"
  }
}
\`\`\`

## 補足情報
- フロントエンド側の実装は問題なく動作
- APIエンドポイントも正常に応答
- テスト環境では一時的なインメモリDBを使用して動作確認済み