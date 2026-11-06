export default function Newsletter() {
  return (
    <div className="mt-10 p-6 bg-gray-100 rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">
        ビットコインの最新ニュースを、日本語で、わかりやすくお届け。
      </h2>
      <p className="text-gray-700 mb-6 text-left">
        基礎から最前線まで
        ──ビットコインに関する本質的な情報と技術的背景を、毎週わかりやすく解説しています。ノイズに惑わされず、確かな理解を手に入れたいあなたへ。
      </p>
      <a
        href="https://diamondhandscommunity.substack.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
      >
        無料ニュースレターに登録
      </a>
    </div>
  )
}
