import { Post, User } from '@/hooks/use-blog-posts';
import { USER_MAPPING, USER_NAMES } from './user-mapping';

// モックデータ
const mockUsers: User[] = [
  { id: 'user-1', name: '髙橋慶祐', avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4' },
  { id: 'user-2', name: '佐藤太郎', avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4' },
  { id: 'user-3', name: '鈴木花子', avatarUrl: 'https://avatars.githubusercontent.com/u/3?v=4' },
  { id: 'user-4', name: '松本次郎', avatarUrl: 'https://avatars.githubusercontent.com/u/4?v=4' },
  { id: 'user-5', name: '後藤優子', avatarUrl: 'https://avatars.githubusercontent.com/u/5?v=4' },
];

const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'ReactとGraphQLを使ったブログアプリケーション',
    body: 'この記事では、ReactとGraphQLを使用してブログアプリケーションを構築する方法について説明します。\n\n## はじめに\n\nReactは、ユーザーインターフェースを構築するためのJavaScriptライブラリです。GraphQLは、APIのクエリ言語であり、必要なデータだけを効率的に取得できます。\n\n## 実装のポイント\n\n- React Queryを使用したデータフェッチング\n- GraphQL Code Generatorによる型安全性の確保\n- ZodとReact Hook Formによるバリデーション',
    author: mockUsers[0],
    tags: ['React', 'GraphQL', 'TypeScript'],
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2日前
  },
  {
    id: 'post-2',
    title: 'Next.jsのApp Router入門',
    body: 'Next.js 13以降で導入されたApp Routerについて、基本的な使い方を解説します。\n\n## App Routerとは\n\nApp Routerは、Next.jsの新しいルーティングシステムです。ファイルベースのルーティングをより柔軟に、かつ強力にします。\n\n## 主な特徴\n\n- Server Componentsによるパフォーマンス向上\n- レイアウトとテンプレートによる再利用性\n- ストリーミングとSuspenseのサポート',
    author: mockUsers[1],
    tags: ['Next.js', 'React', 'Web開発'],
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5日前
  },
  {
    id: 'post-3',
    title: 'TypeScriptで型安全な開発を実現する',
    body: 'TypeScriptを使用することで、JavaScriptの開発をより安全かつ効率的に行うことができます。\n\n## TypeScriptの利点\n\n- コンパイル時の型チェック\n- 優れたIDEサポート\n- リファクタリングの安全性\n\n## 実践的な使い方\n\n型定義を適切に使用することで、バグを早期に発見し、コードの品質を向上させることができます。',
    author: mockUsers[2],
    tags: ['TypeScript', 'プログラミング'],
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7日前
  },
  {
    id: 'post-4',
    title: 'GraphQL Code Generatorの活用方法',
    body: 'GraphQL Code Generatorを使用することで、GraphQLスキーマからTypeScriptの型定義を自動生成できます。\n\n## セットアップ\n\n1. 必要なパッケージのインストール\n2. 設定ファイルの作成\n3. コード生成の実行\n\n## メリット\n\n- 型安全性の確保\n- 開発効率の向上\n- スキーマ変更時の自動反映',
    author: mockUsers[3],
    tags: ['GraphQL', 'TypeScript', '開発ツール'],
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10日前
  },
  {
    id: 'post-5',
    title: 'React Queryでデータフェッチングを効率化',
    body: 'React Queryを使用することで、サーバー状態の管理を簡単かつ効率的に行うことができます。\n\n## React Queryの特徴\n\n- 自動的なキャッシュ管理\n- バックグラウンドでのデータ更新\n- エラーハンドリングとリトライ機能\n\n## 実装例\n\nuseQueryフックを使用することで、データの取得、キャッシュ、更新を簡単に実装できます。',
    author: mockUsers[4],
    tags: ['React', 'React Query', '状態管理'],
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14日前
  },
];

// モックデータを取得する関数
export function getMockPosts(): Post[] {
  return [...mockPosts].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getMockPost(id: string): Post | null {
  return mockPosts.find(post => post.id === id) || null;
}

export function getMockUser(id: string): User | null {
  return mockUsers.find(user => user.id === id) || null;
}

// モックデータでPostを作成
export function createMockPost(input: {
  title: string;
  body: string;
  tags?: string[];
  authorId: string;
}): Post {
  const author = getMockUser(input.authorId) || mockUsers[0];
  const newPost: Post = {
    id: `post-${Date.now()}`,
    title: input.title,
    body: input.body,
    author,
    tags: input.tags || [],
    publishedAt: new Date().toISOString(),
  };
  
  // モックデータに追加（実際のサーバーには保存されない）
  mockPosts.push(newPost);
  
  return newPost;
}

