# SENRI - 占い・運勢予測アプリケーション

## 概要
SENRIは、最新のテクノロジーと伝統的な占術を組み合わせた、モダンな占い・運勢予測Webアプリケーションです。AIを活用した高度な予測機能と、使いやすいインターフェースを提供します。

## 主な機能
- ユーザー認証システム（サインアップ、ログイン、パスワードリセット）
- 管理者ダッシュボード
- AIを活用した運勢予測
- 占星術による相性診断
- サブスクリプション管理システム
- レスポンシブなUI/UXデザイン

## 技術スタック

### フロントエンド
- React 18.2.0
- TypeScript
- Material-UI (MUI) 5.15.10
- Framer Motion（アニメーション）
- Chart.js（データビジュアライゼーション）
- Tailwind CSS

### バックエンド
- Node.js
- Express.js
- MongoDB（mongoose）
- Redis（セッション管理、レート制限）
- JWT認証
- Winston（ロギング）

### テスト/品質管理
- Jest
- Cypress
- Selenium
- ESLint
- Prettier

### CI/CD
- GitHub Actions
- Netlify

## 開発環境のセットアップ

### 必要条件
- Node.js >= 18.0.0
- MongoDB
- Redis
- Git

### インストール手順

1. リポジトリのクローン
\`\`\`bash
git clone [repository-url]
cd SENRI
\`\`\`

2. 依存関係のインストール
\`\`\`bash
npm install
cd server && npm install
cd ..
\`\`\`

3. 環境変数の設定
\`\`\`bash
cp .env.example .env
\`\`\`
必要な環境変数を.envファイルに設定してください。

4. データベースの設定
\`\`\`bash
npm run check-db
\`\`\`

5. 初期データのセットアップ
\`\`\`bash
npm run create-admin
npm run create-users
\`\`\`

### 開発サーバーの起動

フロントエンドとバックエンドを同時に起動：
\`\`\`bash
npm run dev
\`\`\`

これにより、以下のサーバーが起動します：
- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:5000

必要に応じて個別に起動することも可能です：
- フロントエンドのみ: \`npm run dev:frontend\`
- バックエンドのみ: \`npm run dev:backend\`

## テスト

### ユニットテスト
\`\`\`bash
npm test
\`\`\`

### E2Eテスト
\`\`\`bash
npm run test:e2e
\`\`\`

### Seleniumテスト
\`\`\`bash
npm run test:selenium
\`\`\`

## デプロイ

### ビルド
\`\`\`bash
npm run build
\`\`\`

### プロダクション環境の起動
\`\`\`bash
npm start:all
\`\`\`

## API仕様

### 認証API
- POST /api/auth/signup - ユーザー登録
- POST /api/auth/login - ログイン
- POST /api/auth/logout - ログアウト
- POST /api/auth/refresh-token - トークンの更新

### 占い関連API
- GET /api/fortune/daily - 日々の運勢
- POST /api/fortune/compatibility - 相性診断
- GET /api/fortune/yearly - 年間運勢予報

### 管理者API
- GET /api/admin/users - ユーザー一覧
- POST /api/admin/users - ユーザー作成
- PUT /api/admin/users/:id - ユーザー更新
- DELETE /api/admin/users/:id - ユーザー削除

## セキュリティ機能
- bcryptによるパスワードハッシュ化
- JWTによる認証
- レート制限
- XSS対策
- CSRF対策
- セッション管理

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。

## 貢献
バグ報告や機能要望は、GitHubのIssueで受け付けています。
プルリクエストも歓迎します。

## 作者
SENRI開発チーム 