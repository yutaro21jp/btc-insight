import PostCard from '@/components/PostCard'
import TaxonomySidebar from '@/components/TaxonomySidebar'
import type { Post, Term } from '@/lib/posts'
import { absoluteUrl, serializeJsonLd } from '@/lib/site'

export default function TermPosts({
  term,
  kind,
  posts,
}: {
  term: Term
  kind: 'categories' | 'tags'
  posts: Post[]
}) {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { name: 'ホーム', path: '/' },
      { name: 'ブログ', path: '/blog' },
      { name: term.name, path: `/${kind}/${encodeURIComponent(term.slug)}` },
    ].map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <h1 className="text-4xl font-extrabold my-8 text-center text-gray-800">{term.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <TaxonomySidebar />
      </div>
    </div>
  )
}
