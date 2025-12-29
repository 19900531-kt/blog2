'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePost, type Post } from '@/hooks/use-blog-posts';
import { useState } from 'react';
import { AUTHOR_OPTIONS, USER_MAPPING } from '@/lib/user-mapping';

// フォーム用のスキーマ（タグは文字列として扱う）
const blogPostFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  body: z.string().min(1, '本文は必須です').max(5000, '本文は5000文字以内で入力してください'),
  author: z.string().min(1, '著者を選択してください'),
  tags: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

interface BlogPostFormProps {
  post?: Post;
  onSuccess?: () => void;
  onCancel?: () => void;
  isNewPost?: boolean; // 新規作成かどうか
}

export function BlogPostForm({ post, onSuccess, onCancel, isNewPost = false }: BlogPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const createMutation = useCreatePost();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: post
      ? {
          title: post.title,
          body: post.body,
          author: post.author.name,
          tags: post.tags?.join(', ') || '',
        }
      : {
          tags: '',
        },
  });

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput);
      }
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      // バックスペースで最後のタグを削除
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // カンマが入力されたら自動でタグとして追加
    if (value.includes(',')) {
      const parts = value.split(',');
      parts.slice(0, -1).forEach(part => {
        if (part.trim()) {
          addTag(part);
        }
      });
      setTagInput(parts[parts.length - 1] || '');
    } else {
      setTagInput(value);
    }
  };

  const onSubmit = async (data: BlogPostFormData) => {
    setIsSubmitting(true);
    try {
      // 入力中のタグがあれば追加
      if (tagInput.trim()) {
        addTag(tagInput);
      }

      // 著者名からIDを取得
      const authorId = USER_MAPPING[data.author];
      
      if (!authorId) {
        alert('有効な著者を選択してください');
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        title: data.title,
        body: data.body,
        authorId,
        tags: tags.length > 0 ? tags : undefined,
      };

      console.log('Submitting post:', submitData);
      const result = await createMutation.mutateAsync(submitData);
      console.log('Post created successfully:', result);
      reset();
      setTags([]);
      setTagInput('');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response,
        errors: error?.response?.errors,
      });
      // エラーメッセージを表示
      const errorMessage = error?.response?.errors?.[0]?.message || error?.message || '記事の作成に失敗しました';
      alert(`エラー: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          タイトル{isNewPost && '（必須）'}
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="ブログ投稿のタイトルを入力"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          本文{isNewPost && '（必須）'}
        </label>
        <textarea
          id="body"
          {...register('body')}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="ブログ投稿の内容を入力"
        />
        {errors.body && (
          <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          著者{isNewPost && '（必須）'}
        </label>
        {isNewPost ? (
          <select
            id="author"
            {...register('author')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">著者を選択してください</option>
            {AUTHOR_OPTIONS.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="author"
            type="text"
            {...register('author')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="著者名を入力"
          />
        )}
        {errors.author && (
          <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          タグ
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 min-h-[42px] flex flex-wrap gap-2 items-center">
          {/* タグバッジ */}
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                aria-label={`${tag}を削除`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
          ))}
          {/* タグ入力フィールド */}
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
            className="flex-1 min-w-[120px] border-none outline-none bg-transparent"
            placeholder={tags.length === 0 ? "タグを入力してEnterまたはカンマ（,）で追加" : ""}
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Enterキーまたはカンマ（,）でタグを追加できます
        </p>
        {errors.tags && (
          <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '保存中...' : '作成'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}

