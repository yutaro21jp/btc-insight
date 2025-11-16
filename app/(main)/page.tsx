
import { getPosts, getWelcomePost, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'
import Timeline from '@/components/Timeline'

export const revalidate = 60 // ISRで1分更新

type Post = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  mainImage?: {
    _type: 'image',
    asset: {
      _ref: string,
      _type: 'reference'
    }
  }
}

export default async function HomePage() {
  const welcomePost = await getWelcomePost()
  
  const excludeSlugs = ['welcome']
  const otherPosts = await getPosts(excludeSlugs)

  let posts: Post[] = []
  if (welcomePost) {
    posts.push(welcomePost)
  }
  posts = posts.concat(otherPosts.slice(0, 12 - posts.length))

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-xl text-center my-8">ビットコインの最新ニュースを、日本語で、わかりやすく。</h1>
      <div className="text-center mb-16">
        <Link
          href="https://diamondhandscommunity.substack.com/t/btc-insight"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          無料ニュースレターに登録
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/blog/${post.slug.current}`} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            {post.mainImage && (
              <Image
                src={urlFor(post.mainImage).width(800).height(400).url()}
                alt={post.title}
                width={800}
                height={400}
                className="object-cover w-full h-48"
              />
            )}
            <div className="p-4">
              <p className="text-gray-500 text-sm">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })
                  : '日付未設定'}
              </p>
              <h2 className="text-lg font-bold mt-1">{post.title}</h2>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/blog" className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
          ▶︎ ブログ記事をさらに見る
        </Link>
      </div>
      <Timeline />
    </div>
  )
}
