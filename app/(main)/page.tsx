import Link from 'next/link'
import EmptyPosts from '@/components/EmptyPosts'
import PostCard from '@/components/PostCard'
import Timeline from '@/components/Timeline'
import { getPosts } from '@/lib/posts'

export default function HomePage() {
  const posts = getPosts()
  const welcomePost = posts.find((post) => post.slug === 'welcome')
  const featured = (
    welcomePost ? [welcomePost, ...posts.filter((post) => post.slug !== 'welcome')] : posts
  ).slice(0, 12)

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-xl text-center my-8">
        ビットコインの最新ニュースを、日本語で、わかりやすく。
      </h1>
      <div className="text-center mb-16">
        <a
          href="https://diamondhandscommunity.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
        >
          無料ニュースレターに登録
        </a>
      </div>
      {featured.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <EmptyPosts />
      )}
      <div className="text-center mt-8">
        <Link
          href="/blog"
          className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          ▶︎ ブログ記事をさらに見る
        </Link>
      </div>
      <Timeline />
    </div>
  )
}
