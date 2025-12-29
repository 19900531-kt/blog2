export function Loading() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="text-gray-600">読み込み中...</div>
      </div>
    </div>
  );
}



