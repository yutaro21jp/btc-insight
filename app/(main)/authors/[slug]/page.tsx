import { getAuthorBySlug, getPostsByAuthorSlug, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { PortableText } from '@portabletext/react'

export const revalidate = 60 // ISRで1分更新

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const defaultOgImage = new URL('/no-image.png', siteUrl).toString()

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const authorSlug = params.slug
  const author = await getAuthorBySlug(authorSlug)

  if (!author) {
    return {
      title: '執筆者が見つかりませんでした',
    }
  }

  const siteName = 'BTCインサイト';
  const pageTitle = `${author.name} | ${siteName}`;

  return {
    title: pageTitle,
    description: `${author.name}のブログ記事`,
    alternates: {
      canonical: `/authors/${author.slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: `${author.name}のブログ記事`,
      url: new URL(`/authors/${author.slug}`, siteUrl).toString(),
      siteName: siteName,
      images: [defaultOgImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: `${author.name}のブログ記事`,
      images: [defaultOgImage],
    },
  }
}

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

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const authorSlug = params.slug
  const author = await getAuthorBySlug(authorSlug)
  const posts: Post[] = await getPostsByAuthorSlug(authorSlug)

  if (!author) {
    return <p>執筆者が見つかりませんでした。</p>
  }

  const buildXUrl = (val: string) => {
    if (!val) return null
    if (val.startsWith('http')) return val
    const handle = val.replace(/^@/, '')
    return `https://x.com/${handle}`
  }

  const buildGithubUrl = (val: string) => {
    if (!val) return null
    if (val.startsWith('http')) return val
    return `https://github.com/${val}`
  }

  const buildNostrUrl = (val: string) => {
    if (!val) return null
    if (val.startsWith('http')) return val
    if (/^npub/i.test(val)) return `https://primal.net/p/${val}`
    const handle = val.replace(/^@/, '')
    return `https://primal.net/${handle}`
  }

  const socialLinks = [
    author.socialLinks?.nostr && { name: 'Nostr', href: buildNostrUrl(author.socialLinks.nostr), type: 'nostr' as const },
    author.socialLinks?.x && { name: 'X', href: buildXUrl(author.socialLinks.x), type: 'x' as const },
    author.socialLinks?.github && { name: 'GitHub', href: buildGithubUrl(author.socialLinks.github), type: 'github' as const },
  ]
    .filter((item): item is { name: string; href: string; type: 'nostr' | 'x' | 'github' } => Boolean(item && item.href))

  const hasProfileMeta = author.title || author.organization || author.location

  const SocialIcon = ({ type }: { type: 'x' | 'github' | 'nostr' }) => {
    if (type === 'github') {
      return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.43 7.86 10.96.58.1.79-.25.79-.56v-2.08c-3.2.7-3.87-1.37-3.87-1.37-.52-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.68.08-.68 1.14.08 1.74 1.17 1.74 1.17 1.02 1.74 2.68 1.23 3.33.94.1-.74.4-1.23.72-1.52-2.56-.3-5.25-1.28-5.25-5.7 0-1.26.45-2.3 1.17-3.12-.12-.29-.51-1.46.11-3.03 0 0 .96-.31 3.15 1.19a10.97 10.97 0 0 1 5.74 0c2.2-1.5 3.15-1.19 3.15-1.19.62 1.57.23 2.74.11 3.03.73.82 1.17 1.86 1.17 3.12 0 4.44-2.7 5.39-5.27 5.68.41.35.77 1.03.77 2.07v3.07c0 .31.2.67.8.55A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
    }
    if (type === 'nostr') {
      return (
        <svg className="w-5 h-5" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="22" r="10" fill="currentColor" />
          <path d="M50 20c-2 0-4 1.2-5 3l-5 9-8 4" />
          <path d="M32 32c-10 0-18 8-18 18v8h36v-8c0-8-4.5-14.8-11.5-17.4" />
          <path d="M49 18l9 2-9 5" fill="currentColor" />
        </svg>
      )
    }
    return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.84-6.317-6.109 6.317H.727l8.49-9.71L0 1.154h7.594l4.95 5.359L18.901 1.153zm-.742 19.14L6.67 3.08H4.41l13.17 17.19h2.26z"></path></svg>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <h1 className="text-4xl font-extrabold my-8 text-center text-gray-800">
        執筆者：{author.name}
      </h1>
      <div className="max-w-3xl mx-auto bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {author.image && (
            <Image
              src={urlFor(author.image).width(200).height(200).fit('crop').url()}
              alt={author.name}
              width={200}
              height={200}
              className="rounded-full object-cover w-24 h-24 md:w-28 md:h-28"
            />
          )}
          <div className="flex-1 space-y-2">
            {hasProfileMeta && (
              <p className="text-sm text-gray-600">
                {author.title && <span>{author.title}</span>}
                {author.organization && <span className="ml-2 text-gray-500">({author.organization})</span>}
                {author.location && <span className="ml-2 text-gray-500">@{author.location}</span>}
              </p>
            )}
            {author.bio && (
              <div className="prose prose-sm max-w-none text-gray-800">
                <PortableText
                  value={author.bio}
                  components={{
                    block: {
                      normal: ({ children }) => <p className="mb-2">{children}</p>,
                    },
                  }}
                />
              </div>
            )}
            {author.expertise?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {author.expertise.map((item: string, idx: number) => (
                  <span key={idx} className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs">
                    {item}
                  </span>
                ))}
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 pt-1">
                {socialLinks.map((link) => (
                  <a key={link.type} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900" aria-label={link.name}>
                    <SocialIcon type={link.type} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        {author.achievements?.length > 0 && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">実績・ハイライト</h2>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              {author.achievements.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {author.credentials?.length > 0 && (
          <div className="mt-3">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">資格・肩書き</h2>
            <div className="flex flex-wrap gap-2">
              {author.credentials.map((item: string, idx: number) => (
                <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">

          {posts.length === 0 ? (
            <p className="text-center text-gray-600">この執筆者の記事はまだありません。</p>
          ) : (
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
          )}
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
