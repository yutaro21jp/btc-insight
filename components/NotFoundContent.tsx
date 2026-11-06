import Link from 'next/link'

export default function NotFoundContent() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      <p
        className="text-amber-500 font-bold text-7xl sm:text-8xl tracking-tight"
        aria-hidden="true"
      >
        404
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 leading-relaxed">
        ページが見つかりませんでした
      </h1>
      <p className="text-gray-600 leading-8 mt-4">
        URLが変更されたか、ページの公開が終了した可能性があります。
      </p>

      <div className="border-l-4 border-orange-400 bg-gray-50 p-5 sm:p-6 mt-8 rounded-r-lg">
        <h2 className="font-bold text-gray-800">現在、サイトをリニューアルしています。</h2>
        <p className="text-gray-600 leading-7 mt-2">
          記事の構成を見直しているため、以前のURLではご覧いただけない記事があります。新しい記事を準備していますので、トップページからご確認ください。
        </p>
      </div>

      <nav aria-label="ページを探す" className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link
          href="/"
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-6 py-3 rounded-lg text-center transition"
        >
          ホームへ戻る
        </Link>
        <Link
          href="/blog"
          className="border border-gray-300 hover:border-gray-600 text-gray-800 font-bold px-6 py-3 rounded-lg text-center transition"
        >
          記事一覧を見る
        </Link>
      </nav>

      <p className="text-gray-500 text-sm leading-7 mt-8">
        ビットコインのニュースは、
        <a
          href="https://diamondhandscommunity.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-700 underline underline-offset-4 hover:text-purple-900"
        >
          無料ニュースレター
        </a>
        でもお届けしています。
      </p>
    </section>
  )
}
