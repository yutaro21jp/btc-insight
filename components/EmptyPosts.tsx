export default function EmptyPosts({
  message = 'サイトをリニューアル中です。新しい記事を準備しています。',
}: {
  message?: string
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-12 text-center">
      <p className="text-gray-600">{message}</p>
    </div>
  )
}
