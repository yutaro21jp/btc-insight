import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Markdown from '@/components/Markdown'
import Newsletter from '@/components/Newsletter'
import PostCard from '@/components/PostCard'
import SafeImage from '@/components/SafeImage'
import ShareButtons from '@/components/ShareButtons'
import { getPostBySlug, getPosts, getRelatedPosts } from '@/lib/posts'
import { absoluteUrl, defaultOgImage, formatDate, serializeJsonLd, siteName } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }))
}

function getPost(slug: string) {
  return getPostBySlug(slug) ?? notFound()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const post = getPost((await params).slug)
  const title = `${post.title} | ${siteName}`
  const image = post.image ? absoluteUrl(post.image) : defaultOgImage
  return {
    title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description: post.description,
      type: 'article',
      siteName,
      url: absoluteUrl(`/blog/${post.slug}`),
      images: [image],
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
    },
    twitter: { card: 'summary_large_image', title, description: post.description, images: [image] },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)
  const pageUrl = absoluteUrl(`/blog/${post.slug}`)
  const relatedPosts = getRelatedPosts(post)
  const authorTitle = [post.author?.title, post.author?.organization].filter(Boolean).join(' / ')
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'ブログ', href: '/blog' },
    ...post.categories
      .slice(0, 1)
      .map((term) => ({ name: term.name, href: `/categories/${encodeURIComponent(term.slug)}` })),
    { name: post.title, href: `/blog/${post.slug}` },
  ]
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      image: post.image ? absoluteUrl(post.image) : defaultOgImage,
      datePublished: post.date,
      dateModified: post.updated || post.date,
      mainEntityOfPage: pageUrl,
      articleSection: post.categories[0]?.name,
      keywords: post.tags.map((term) => term.name),
      author: post.author
        ? {
            '@type': 'Person',
            name: post.author.name,
            url: absoluteUrl(`/authors/${post.author.slug}`),
          }
        : undefined,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: { '@type': 'ImageObject', url: absoluteUrl('/images/common/btc-insight-logo.webp') },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.href),
      })),
    },
    ...(post.faq.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: post.faq.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ]
      : []),
  ]

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <nav aria-label="パンくずリスト" className="text-sm text-gray-500 mb-4 flex flex-wrap gap-1">
        {breadcrumbs.map((item, index) => (
          <span key={item.href} className="flex items-center gap-1">
            {index === breadcrumbs.length - 1 ? (
              <span className="inline-flex w-2 h-2 rounded-full bg-gray-400" aria-label="現在地" />
            ) : (
              <Link href={item.href} className="hover:underline">
                {item.name}
              </Link>
            )}
            {index < breadcrumbs.length - 1 && <span aria-hidden="true">/</span>}
          </span>
        ))}
      </nav>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.showImage && post.image && (
        <SafeImage
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          sizes="(min-width: 768px) 768px, 100vw"
          className="rounded w-full h-auto mb-6"
        />
      )}
      <article className="text-gray-800 leading-relaxed break-words [overflow-wrap:anywhere]">
        <Markdown>{post.body}</Markdown>
      </article>

      <div className="mt-10 flex items-center text-gray-500 text-sm">
        {post.author && (
          <Link href={`/authors/${post.author.slug}`} className="mr-2">
            <SafeImage
              src={post.author.image}
              alt={post.author.name}
              width={60}
              height={60}
              sizes="60px"
              className="rounded-full object-cover"
            />
          </Link>
        )}
        <div>
          {post.author && (
            <Link
              href={`/authors/${post.author.slug}`}
              className="text-gray-800 font-semibold hover:underline"
            >
              {post.author.name}
            </Link>
          )}
          {authorTitle && <p className="text-gray-500 text-xs">{authorTitle}</p>}
          <p>
            公開日：<time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
          {post.updated && (
            <p>
              更新日：<time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </p>
          )}
        </div>
      </div>

      {post.faq.length > 0 && (
        <section className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">よくある質問</h2>
          <div className="space-y-4">
            {post.faq.map((faq) => (
              <div
                key={faq.question}
                className="p-4 bg-white rounded border border-gray-200 shadow-sm"
              >
                <p className="font-semibold text-gray-900">Q. {faq.question}</p>
                <p className="mt-2 text-gray-700 leading-relaxed">A. {faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {post.categories.length > 0 && (
        <div className="mt-10 flex items-center flex-wrap gap-2">
          <span className="text-lg font-semibold mr-2">カテゴリ：</span>
          {post.categories.map((term) => (
            <Link
              key={term.slug}
              href={`/categories/${encodeURIComponent(term.slug)}`}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition"
            >
              {term.name}
            </Link>
          ))}
        </div>
      )}
      {post.tags.length > 0 && (
        <div className="mt-4 flex items-center flex-wrap gap-2">
          <span className="text-lg font-semibold mr-2">タグ：</span>
          {post.tags.map((term) => (
            <Link
              key={term.slug}
              href={`/tags/${encodeURIComponent(term.slug)}`}
              className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm hover:bg-pink-200 transition"
            >
              {term.name}
            </Link>
          ))}
        </div>
      )}
      <ShareButtons pageUrl={pageUrl} title={post.title} />
      {relatedPosts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">関連記事</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((related) => (
              <PostCard key={related.slug} post={related} compact />
            ))}
          </div>
        </section>
      )}
      <Newsletter />
    </div>
  )
}
