import EmptyPosts from '@/components/EmptyPosts'
import PostCard from '@/components/PostCard'
import TaxonomySidebar from '@/components/TaxonomySidebar'
import { getPosts } from '@/lib/posts'
import { absoluteUrl, pageMetadata, serializeJsonLd } from '@/lib/site'

export const metadata = pageMetadata(
  'ブログ | BTCインサイト',
  'BTCインサイトの最新ブログ記事一覧',
  '/blog'
)

export default function BlogPage() {
  const posts = getPosts()
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'ブログ', item: absoluteUrl('/blog') },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <h1 className="sr-only">ブログ記事一覧</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {posts.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <EmptyPosts />
          )}
        </div>
        <TaxonomySidebar />
      </div>
    </div>
  )
}
