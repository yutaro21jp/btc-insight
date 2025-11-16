
import { getPosts, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const revalidate = 60 // ISRで1分更新

export const metadata: Metadata = {
  title: 'ブログ | BTCインサイト',
  description: 'BTCインサイトの最新ブログ記事一覧',
  openGraph: {
    title: 'ブログ | BTCインサイト',
    description: 'BTCインサイトの最新ブログ記事一覧',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    siteName: 'BTCインサイト',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'ブログ | BTCインサイト',
    description: 'BTCインサイトの最新ブログ記事一覧',
  },
};

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

export default async function BlogPage() {
  const posts: Post[] = await getPosts()

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <h1 className="text-4xl font-extrabold my-8 text-center text-gray-800">
        ブログ
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        </div>
        <aside className="lg:col-span-1 lg:sticky top-8 h-fit">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">お知らせ</h2>
            <p>ここに告知内容が入ります。</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
