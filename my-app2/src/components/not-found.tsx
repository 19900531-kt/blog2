import Link from 'next/link';

export function NotFound() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-16 h-16 text-yellow-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">
              記事が見つかりませんでした
            </h3>
            <p className="text-yellow-700 text-sm mb-4">
              指定された記事は存在しないか、削除された可能性があります。
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



