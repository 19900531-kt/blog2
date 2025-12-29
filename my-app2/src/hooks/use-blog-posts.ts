import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/lib/graphql-client';

export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type Post = {
  id: string;
  title: string;
  body: string;
  author: User;
  tags: string[];
  publishedAt: string;
};

export type CreatePostInput = {
  title: string;
  body: string;
  tags?: string[];
  authorId: string;
};

// ブログ投稿一覧を取得
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const query = `
        query GetPosts {
          posts {
            id
            title
            body
            author {
              id
              name
              avatarUrl
            }
            tags
            publishedAt
          }
        }
      `;
      const result = await request<{ posts: Post[] }>(query);
      // 配列であることを確認
      if (!result || !result.posts || !Array.isArray(result.posts)) {
        return [];
      }
      // 降順でソート（投稿日が新しい順）
      return result.posts.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    },
  });
}

// ブログ投稿を取得
export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const query = `
        query GetPost($id: ID!) {
          post(id: $id) {
            id
            title
            body
            author {
              id
              name
              avatarUrl
            }
            tags
            publishedAt
          }
        }
      `;
      try {
        const result = await request<{ post: Post | null }>(query, { id });
        if (!result.post) {
          const notFoundError = new Error('NOT_FOUND');
          notFoundError.name = 'NotFoundError';
          throw notFoundError;
        }
        return result.post;
      } catch (error: any) {
        // NotFoundErrorの処理（モックデータからもスローされる）
        if (error.name === 'NotFoundError' || error.message === 'NOT_FOUND') {
          const notFoundError = new Error('NOT_FOUND');
          notFoundError.name = 'NotFoundError';
          throw notFoundError;
        }
        // GraphQLエラーの場合、NOT_FOUNDを判定
        if (error?.response?.errors) {
          const graphqlError = error.response.errors[0];
          if (graphqlError?.message?.includes('not found') || graphqlError?.extensions?.code === 'NOT_FOUND') {
            const notFoundError = new Error('NOT_FOUND');
            notFoundError.name = 'NotFoundError';
            throw notFoundError;
          }
        }
        throw error;
      }
    },
    enabled: !!id,
  });
}

// ユーザーを取得
export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const query = `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            name
            avatarUrl
          }
        }
      `;
      const result = await request<{ user: User | null }>(query, { id });
      return result.user;
    },
    enabled: !!id,
  });
}

// ブログ投稿を作成
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const mutation = `
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            id
            title
            body
            author {
              id
              name
              avatarUrl
            }
            tags
            publishedAt
          }
        }
      `;
      const result = await request<{ createPost: Post }>(mutation, { input });
      return result.createPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// 後方互換性のためのエイリアス
export const useBlogPosts = usePosts;
export const useBlogPost = usePost;
export type BlogPost = Post;
export type Author = User;
