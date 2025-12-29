interface ErrorMessageProps {
  error: Error | unknown;
  title?: string;
}

export function ErrorMessage({ error, title = 'エラーが発生しました' }: ErrorMessageProps) {
  let errorMessage = error instanceof Error ? error.message : String(error);
  
  // エラーメッセージを簡潔に
  if (error instanceof Error) {
    if (error.name === 'AuthenticationError') {
      // 認証エラーの場合
      errorMessage = error.message;
    } else if (error.name === 'NetworkError') {
      // ネットワークエラーの場合、シンプルなメッセージに
      const lines = error.message.split('\n');
      errorMessage = lines[0] || 'GraphQLサーバーに接続できません。';
    } else if (error.name === 'HttpError') {
      errorMessage = error.message.split('\n')[0] || 'HTTPエラーが発生しました。';
    } else if (error.name === 'GraphQLError') {
      errorMessage = error.message.replace('GraphQLエラー: ', '');
    } else if (errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
      errorMessage = 'GraphQLサーバーに接続できません。';
    }
  }

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-lg font-semibold text-red-800">{title}</h3>
        </div>
        <p className="text-red-700 text-sm whitespace-pre-line">{errorMessage}</p>
      </div>
    </div>
  );
}

