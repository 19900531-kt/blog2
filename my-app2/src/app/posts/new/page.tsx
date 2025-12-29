'use client';

import { BlogPostForm } from '@/components/blog-post-form';
import { SuccessMessage } from '@/components/success-message';
import Link from 'next/link';
import { useState } from 'react';

export default function NewPost() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    // 3秒後に自動的に非表示にする（オプション）
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← 一覧に戻る
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            新規投稿
          </h1>
        </header>
        <main>
          <div className="bg-white p-8 rounded-lg shadow-md">
            {showSuccess && (
              <SuccessMessage
                message="記事の作成に成功しました！"
                onClose={() => setShowSuccess(false)}
              />
            )}
            <BlogPostForm onSuccess={handleSuccess} isNewPost={true} />
          </div>
        </main>
      </div>
    </div>
  );
}

