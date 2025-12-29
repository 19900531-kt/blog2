# ミニブログ管理ダッシュボード

ReactとNext.jsを使用したミニブログ管理アプリケーションです。

## 機能

- 📝 記事一覧表示（投稿日時降順）
- 📄 記事詳細表示
- ✏️ 新規記事作成
- 👤 著者情報の表示
- 🏷️ タグ機能
- 🎨 モダンなUIデザイン

## 技術スタック

- **フレームワーク**: Next.js 16.1.1
- **UIライブラリ**: React 19.2.3
- **データフェッチング**: @tanstack/react-query 5.62.11
- **GraphQL**: graphql-request 7.1.3
- **コード生成**: @graphql-codegen/cli 5.0.2
- **フォーム管理**: react-hook-form 7.54.2
- **バリデーション**: zod 3.24.1
- **スタイリング**: Tailwind CSS 4

## プロジェクト構造

```
blog2/
├── my-app2/          # フロントエンドアプリケーション（Next.js）
│   ├── src/          # ソースコード
│   ├── public/        # 静的ファイル
│   └── README.md     # 詳細なドキュメント
└── server/           # バックエンドサーバー（Rust/actix-web）
```

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn

### インストール

```bash
# プロジェクトディレクトリに移動
cd my-app2

# 依存関係のインストール
npm install

# GraphQLコード生成
npm run codegen
```

### 開発サーバーの起動

```bash
cd my-app2
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 環境変数

`my-app2/.env.local` ファイルを作成して、以下の環境変数を設定できます：

```env
# GraphQLエンドポイント（オプション）
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-graphql-endpoint.com/api/graphql

# モックモードの有効/無効（開発環境ではデフォルトで有効）
NEXT_PUBLIC_USE_MOCK=true

# fetch APIを直接使用するかどうか
NEXT_PUBLIC_USE_FETCH=true
```

## GraphQL API

このアプリケーションは外部のGraphQL APIを使用します。

### スキーマ

```graphql
type Post {
  id: ID!
  title: String!
  author: User!
  body: String!
  tags: [String!]!
  publishedAt: DateTime!
}

type User {
  id: ID!
  name: String!
  avatarUrl: String
}

type Query {
  posts: [Post!]!
  post(id: ID!): Post
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
}
```

### モックデータ

開発環境では、外部サーバーに接続できない場合に自動的にモックデータが使用されます。環境変数 `NEXT_PUBLIC_USE_MOCK=false` で無効化できます。

## スクリプト

```bash
# 開発サーバーを起動
npm run dev

# 本番用ビルド
npm run build

# 本番サーバーを起動
npm start

# リント
npm run lint

# GraphQLコード生成
npm run codegen
```

## 主な機能の使い方

### 記事一覧

トップページで記事一覧が表示されます。各記事をクリックすると詳細ページに遷移します。

### 記事詳細

記事のタイトル、著者情報、本文、タグが表示されます。

### 新規記事作成

1. 「新規投稿」リンクをクリック
2. タイトルと本文を入力（必須）
3. 著者を選択（必須）
4. タグを入力（Enterキーまたはカンマで追加）
5. 「作成」ボタンをクリック

## 詳細なドキュメント

より詳細な情報については、[my-app2/README.md](./my-app2/README.md) を参照してください。

## ライセンス

このプロジェクトは個人の学習目的で作成されました。
