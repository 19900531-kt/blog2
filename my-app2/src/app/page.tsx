import { PostsList } from '@/components/posts-list';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                ミニブログ
              </h1>
              <p className="text-gray-600">
                記事一覧
              </p>
            </div>
            <Link
              href="/posts/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              新規投稿
            </Link>
          </div>
        </header>
        <main>
          <PostsList />
        </main>
      </div>
    </div>
  );
}
