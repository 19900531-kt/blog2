# Blog GraphQL Server

actix-web と async-graphql を使用した GraphQL サーバーです。

## セットアップ

```bash
# Rustがインストールされていることを確認
rustc --version

# サーバーを起動
cd blog2/server
cargo run
```

サーバーは `http://localhost:8080/api/graphql` で起動します。

## GraphQL エンドポイント

- POST/GET: `http://localhost:8080/api/graphql`

## 使用技術

- **actix-web**: Webフレームワーク
- **async-graphql**: GraphQLライブラリ
- **actix-cors**: CORS対応
- **メモリストレージ**: データの永続化はサーバーのメモリ上で行います（再起動でデータは消えます）

## 機能

- 記事一覧取得 (`posts`) - `author { name, avatar }` をサブクエリで取得
- 記事詳細取得 (`post(id)`) - `author { name, avatar }` をサブクエリで取得
- 記事作成 (`createPost`) - 固定値の著者リストから選択可能
- 記事更新 (`updateBlogPost`)
- 記事削除 (`deleteBlogPost`)

## 固定値の著者リスト

- 髙橋慶祐
- 佐藤太郎
- 鈴木花子
- 松本次郎
- 後藤優子

## GraphQL スキーマ

```graphql
type Author {
  name: String!
  avatar: String
}

type BlogPost {
  id: ID!
  title: String!
  content: String!
  author: Author!
  tags: [String!]!
  createdAt: String!
  updatedAt: String!
}
```

