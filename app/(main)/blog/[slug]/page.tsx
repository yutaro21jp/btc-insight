import { getPostBySlug, getRelatedPosts, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import XTweetEmbed from '@/components/XTweetEmbed'

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const defaultOgImage = new URL('/no-image.png', siteUrl).toString()

const extractSummary = (post: any, maxLength = 140) => {
  if (post?.excerpt) return post.excerpt
  const firstBlock = post?.body?.find((block: any) => block._type === 'block')
  if (!firstBlock?.children?.length) return undefined
  const text = firstBlock.children.map((child: any) => child.text || '').join('')
  if (!text) return undefined
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: '記事が見つかりませんでした',
    }
  }

  const siteName = 'BTCインサイト';
  const pageTitle = `${post.title} | ${siteName}`;
  const description = extractSummary(post)

  const ogImage = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : defaultOgImage
  const canonical = `/blog/${post.slug.current}`
  const absoluteUrl = new URL(canonical, siteUrl).toString()

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description,
      type: 'article',
      url: absoluteUrl,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: ogImage ? [ogImage] : [defaultOgImage],
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return <p>記事が見つかりませんでした。</p>
  }

  const shouldShowMainImage = post.showMainImageAtTop !== false
  const description = extractSummary(post, 160)
  const ogImage = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : defaultOgImage
  const canonicalPath = `/blog/${post.slug.current}`
  const pageUrl = new URL(canonicalPath, siteUrl).toString()
  const categorySlugs = post.categories?.map((c: any) => c.slug.current) || []
  const tagSlugs = post.tags?.map((t: any) => t.slug.current) || []
  const keywords = post.tags?.map((t: any) => t.name) || []
  const articleSection = post.categories?.[0]?.title
  const relatedPosts = await getRelatedPosts(post.slug.current, categorySlugs, tagSlugs)
  const faqs = (post.faq || []).filter((item: any) => item?.question && item?.answer)

  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'ブログ', href: '/blog' },
  ]

  if (post.categories?.length) {
    const primaryCategory = post.categories[0]
    breadcrumbs.push({ name: primaryCategory.title, href: `/categories/${primaryCategory.slug.current}` })
  }

  breadcrumbs.push({ name: post.title, href: canonicalPath })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description,
    image: ogImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: pageUrl,
    articleSection,
    keywords,
    author: post.author?.name
      ? {
          '@type': 'Person',
          name: post.author.name,
          url: post.author?.slug ? new URL(`/authors/${post.author.slug}`, siteUrl).toString() : undefined,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'BTCインサイト',
      logo: {
        '@type': 'ImageObject',
        url: new URL('/btc-insight-logo.png', siteUrl).toString(),
      },
    },
  }

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.href, siteUrl).toString(),
    })),
  }

  const faqJsonLd = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null

  const jsonLdEntities = (faqJsonLd
    ? [jsonLd, breadcrumbList, faqJsonLd]
    : [jsonLd, breadcrumbList]) as any[]

  const authorTitleLine = [post.author?.title, post.author?.organization].filter(Boolean).join(' / ')

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <nav aria-label="パンくずリスト" className="text-sm text-gray-500 mb-4 flex flex-wrap gap-1">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1
          return (
            <span key={crumb.href} className="flex items-center gap-1">
              {isLast ? (
                <span className="inline-flex w-2 h-2 rounded-full bg-gray-400" aria-label="現在地" />
              ) : (
                <Link href={crumb.href} className="hover:underline">{crumb.name}</Link>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </span>
          )
        })}
      </nav>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center text-gray-500 text-sm mb-4">
        {post.author?.slug && (
          <Link href={`/authors/${post.author.slug}`} className="mr-2">
            <Image
              src={post.author?.name === 'yutaro' ? '/yutaro.JPG' : urlFor(post.author?.image).width(60).height(60).fit('crop').url()}
              alt={post.author?.name || 'Author'}
              width={60}
              height={60}
              className="rounded-full object-cover"
            />
          </Link>
        )}
        {!post.author?.slug && (
          <Image
            src={post.author?.name === 'yutaro' ? '/yutaro.JPG' : urlFor(post.author?.image).width(60).height(60).fit('crop').url()}
            alt={post.author?.name || 'Author'}
            width={60}
            height={60}
            className="rounded-full mr-2 object-cover"
          />
        )}
        <div>
          {post.author?.name && (
            post.author.slug ? (
              <Link href={`/authors/${post.author.slug}`} className="text-gray-800 font-semibold hover:underline">
                {post.author.name}
              </Link>
            ) : (
              <p className="text-gray-800 font-semibold">{post.author.name}</p>
            )
          )}
          {authorTitleLine && (
            <p className="text-gray-500 text-xs">{authorTitleLine}</p>
          )}
          <p className="text-gray-500 text-sm">公開日：{new Date(post.publishedAt).toLocaleDateString()}</p>
        </div>
      </div>
      {post.mainImage && shouldShowMainImage && (
        <Image
          src={urlFor(post.mainImage).url()}
          alt={post.title}
          width={800} // Next.jsの最適化のための幅
          height={400} // Next.jsの最適化のための高さ
          className="rounded w-full h-auto mb-6"
        />
      )}
      <article className="text-gray-800 leading-relaxed">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEntities) }}
        />
        <PortableText
          value={post.body}
          components={{
            block: {
              h1: ({children}) => <h2 className="border-l-4 border-orange-500 pl-4 text-2xl font-bold my-8 border-b-2 border-orange-400 pb-2">{children}</h2>,
              h2: ({children}) => <h3 className="border-b-2 border-orange-400 pb-2 text-xl font-bold my-6">{children}</h3>,
              h3: ({children}) => <h4 className="text-xl font-bold text-orange-600 mt-6 mb-3">{children}</h4>,
              h4: ({children}) => <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2 border-l-2 border-b-2 border-gray-200 pl-2 pb-2">{children}</h4>,
              h5: ({children}) => <h5 className="text-lg font-semibold mt-3 mb-1">{children}</h5>,
              h6: ({children}) => <h6 className="text-base font-semibold mt-2 mb-1">{children}</h6>,
              normal: ({children}) => <p className="mb-4 text-lg">{children}</p>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-lg">{children}</blockquote>,
            },
            marks: {
              link: ({children, value}) => {
                const rel = value.blank ? 'noreferrer noopener' : undefined;
                const target = value.blank ? '_blank' : undefined;
                return (
                  <a href={value.href} rel={rel} target={target} className="text-blue-600 hover:underline">
                    {children}
                  </a>
                )
              },
            },
            list: {
              bullet: ({children}) => <ul className="list-disc list-outside mb-4 pl-5 text-lg">{children}</ul>,
              number: ({children}) => <ol className="list-decimal list-outside mb-4 pl-5 text-lg">{children}</ol>,
            },
            listItem: ({children}) => <li className="mb-2">{children}</li>,
            types: {
              tweetEmbed: ({ value }) => {
                const tweetUrl = value?.url
                return tweetUrl ? (
                  <div className="flex justify-center my-8">
                    <XTweetEmbed url={tweetUrl} />
                  </div>
                ) : null
              },
              youtubeEmbed: ({ value }) => {
                const url = value.url;
                let videoId = null;

                // Extract video ID from both standard and shortened YouTube URLs
                const standardMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                if (standardMatch && standardMatch[1]) {
                  videoId = standardMatch[1];
                }

                if (!videoId) return null;
                return (
                  <div className="relative w-full overflow-hidden my-8" style={{ paddingTop: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube video player"
                    ></iframe>
                  </div>
                );
              },
              codeBlock: ({ value }) => {
                const code = value?.code || ''
                if (!code) return null
                const language = value?.language || 'text'
                const showLanguage = language && language !== 'text'
                return (
                  <div className="my-6">
                    {showLanguage && (
                      <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                        {language}
                      </div>
                    )}
                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                      <code className="font-mono" data-language={language}>{code}</code>
                    </pre>
                  </div>
                )
              },
              image: ({ value }) => {
                if (!value || !value.asset || !value.asset._ref) return null;
                return (
                  <div className="my-8 flex justify-center">
                    <Image
                      src={urlFor(value).url()}
                      alt={value.alt || ''}
                      width={800} // 適切な幅を設定
                      height={450} // 適切な高さを設定
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                );
              },
            },
          }}
        />
      </article>

      {faqs.length > 0 && (
        <section className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">よくある質問</h2>
          <div className="space-y-4">
            {faqs.map((faq: any, index: number) => (
              <div key={index} className="p-4 bg-white rounded border border-gray-200 shadow-sm">
                <p className="font-semibold text-gray-900">Q. {faq.question}</p>
                <p className="mt-2 text-gray-700 leading-relaxed">A. {faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {post.categories && post.categories.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-lg font-semibold mr-2">カテゴリ：</span>
            {post.categories.map((category: any) => (
              <Link
                key={category.title}
                href={`/categories/${category.slug.current}`}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-lg font-semibold mr-2">タグ：</span>
            {post.tags.map((tag: any) => (
              <Link
                key={tag.name}
                href={`/tags/${tag.slug.current}`}
                className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm hover:bg-pink-200 transition"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black hover:bg-gray-800 text-white font-bold p-2 rounded-lg flex items-center justify-center w-10 h-10"
          aria-label="Xで共有"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.84-6.317-6.109 6.317H.727l8.49-9.71L0 1.154h7.594l4.95 5.359L18.901 1.153zm-.742 19.14L6.67 3.08H4.41l13.17 17.19h2.26z"></path></svg>
        </a>
        <a
          href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${post.title} ${pageUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-lg flex items-center justify-center w-10 h-10"
          aria-label="Blueskyで共有"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-50 -70 430 390" fill="currentColor"><path d="M180 141.964C163.699 110.262 119.308 51.1817 78.0347 22.044C38.4971 -5.86834 23.414 -1.03207 13.526 3.43594C2.08093 8.60755 0 26.1785 0 36.5164C0 46.8542 5.66748 121.272 9.36416 133.694C21.5786 174.738 65.0603 188.607 105.104 184.156C107.151 183.852 109.227 183.572 111.329 183.312C109.267 183.642 107.19 183.924 105.104 184.156C46.4204 192.847 -5.69621 214.233 62.6582 290.33C137.848 368.18 165.705 273.637 180 225.702C194.295 273.637 210.76 364.771 295.995 290.33C360 225.702 313.58 192.85 254.896 184.158C252.81 183.926 250.733 183.645 248.671 183.315C250.773 183.574 252.849 183.855 254.896 184.158C294.94 188.61 338.421 174.74 350.636 133.697C354.333 121.275 360 46.8568 360 36.519C360 26.1811 357.919 8.61012 346.474 3.43851C336.586 -1.02949 321.503 -5.86576 281.965 22.0466C240.692 51.1843 196.301 110.262 180 141.964Z"/></svg>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-lg flex items-center justify-center w-10 h-10"
          aria-label="Facebookで共有"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.815c-3.238 0-5.185 1.237-5.185 5.007v2.993z"/></svg>
        </a>
      </div>

      {relatedPosts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">関連記事</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((related: any) => {
              const relatedUrl = `/blog/${related.slug.current}`
              return (
                <Link key={related._id} href={relatedUrl} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition block">
                  {related.mainImage && (
                    <Image
                      src={urlFor(related.mainImage).width(600).height(320).url()}
                      alt={related.title}
                      width={600}
                      height={320}
                      className="object-cover w-full h-40"
                    />
                  )}
                  <div className="p-4">
                    <p className="text-gray-500 text-xs">
                      {related.publishedAt
                        ? new Date(related.publishedAt).toLocaleDateString('ja-JP', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })
                        : '日付未設定'}
                    </p>
                    <h3 className="text-base font-semibold mt-1 line-clamp-2">{related.title}</h3>
                    {related.excerpt && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{related.excerpt}</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <div className="mt-10 p-6 bg-gray-100 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">ビットコインの最新ニュースを、日本語で、わかりやすくお届け。</h2>
        <p className="text-gray-700 mb-6 text-left">基礎から最前線まで ──ビットコインに関する本質的な情報と技術的背景を、毎週わかりやすく解説しています。ノイズに惑わされず、確かな理解を手に入れたいあなたへ。</p>
        <a
          href="https://diamondhandscommunity.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
        >
          無料ニュースレターに登録
        </a>
      </div>
    </main>
  )
}
