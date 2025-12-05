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
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Nostr (Nostrich) community icon"
          fill="currentColor"
        >
          <title>Nostr</title>
          <path d="M17.7084 10.1607C18.1683 13.3466 14.8705 14.0207 12.9733 13.9618C12.8515 13.958 12.7366 14.0173 12.6647 14.1157C12.4684 14.384 12.1547 14.7309 11.9125 14.7309C11.6405 14.7309 11.3957 15.254 11.284 15.5795C11.2723 15.6137 11.3059 15.6452 11.3403 15.634C14.345 14.6584 15.5241 14.3238 16.032 14.4178C16.4421 14.4937 17.209 15.8665 17.5413 16.5434C16.7155 16.5909 16.4402 15.8507 16.2503 15.7178C16.0985 15.6116 16.0415 16.0974 16.032 16.3536C15.8517 16.2587 15.6239 16.1259 15.6049 15.7178C15.5859 15.3098 15.3771 15.4142 15.2157 15.4332C15.0544 15.4521 12.5769 16.2493 12.2067 16.3536C11.8366 16.458 11.4094 16.6004 11.0582 16.8471C10.4697 17.1318 10.09 16.9325 9.98561 16.4485C9.90208 16.0614 10.4444 14.8701 10.726 14.3229C10.3779 14.4526 9.65529 14.7158 9.54898 14.7309C9.44588 14.7457 8.13815 15.7552 7.43879 16.3038C7.398 16.3358 7.37174 16.3827 7.36236 16.4336C7.25047 17.0416 6.89335 17.2118 6.27423 17.5303C5.77602 17.7867 4.036 20.4606 3.14127 21.9041C3.0794 22.0039 2.9886 22.0806 2.8911 22.1461C2.32279 22.5276 1.74399 23.4985 1.50923 23.9737C1.17511 23.0095 1.61048 22.1802 1.86993 21.886C1.75602 21.7873 1.49341 21.8449 1.37634 21.886C1.69907 20.7757 2.82862 20.7757 2.79066 20.7757C2.99948 20.5954 5.44842 17.0938 5.50538 16.9325C5.56187 16.7725 5.46892 16.0242 6.69975 15.6139C6.7193 15.6073 6.73868 15.5984 6.75601 15.5873C7.71493 14.971 8.43427 13.9774 8.67571 13.5542C7.39547 13.4662 5.92943 12.7525 5.16289 12.294C4.99765 12.1952 4.8224 12.1092 4.63108 12.0875C3.58154 11.9687 2.53067 12.6401 2.10723 13.0228C1.93258 12.7799 2.12938 12.0739 2.24961 11.7513C1.82437 11.6905 1.19916 12.308 0.939711 12.6243C0.658747 12.184 0.904907 11.397 1.06311 11.0585C0.501179 11.0737 0.120232 11.3306 0 11.4571C0.465109 7.99343 4.02275 9.00076 4.06259 9.04675C3.87275 8.84937 3.88857 8.59126 3.92021 8.48688C6.0749 8.54381 7.08105 8.18321 7.71702 7.81313C12.7288 5.01374 14.8882 6.73133 15.6856 7.1631C16.4829 7.59487 17.9304 7.77042 18.9318 7.37187C20.1278 6.83097 19.9478 5.43673 19.7054 4.90461C19.4397 4.32101 17.9399 3.51438 17.4084 2.49428C16.8768 1.47418 17.34 0.233672 17.9558 0.0607684C18.5425 -0.103972 18.9615 0.0876835 19.2831 0.378128C19.4974 0.571763 20.0994 0.710259 20.3509 0.800409C20.6024 0.890558 21.0201 1.00918 20.9964 1.08035C20.9726 1.15152 20.5699 1.14202 20.5075 1.14202C20.3794 1.14202 20.2275 1.161 20.3794 1.23217C20.5575 1.30439 20.8263 1.40936 20.955 1.47846C20.9717 1.48744 20.9683 1.51084 20.95 1.51577C20.0765 1.75085 19.2966 1.26578 18.7183 1.82526C18.1298 2.39463 19.3827 2.83114 20.0282 3.51438C20.6736 4.19762 21.3381 5.01372 20.8065 6.87365C20.395 8.31355 18.6703 9.53781 17.7795 10.0167C17.7282 10.0442 17.7001 10.1031 17.7084 10.1607Z"></path>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
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
                        marks: {
                          link: ({ children, value }) => {
                            const rel = value.blank ? 'noreferrer noopener' : undefined
                            const target = value.blank ? '_blank' : undefined
                            return (
                              <a href={value.href} rel={rel} target={target} className="text-blue-600 hover:underline">
                                {children}
                              </a>
                            )
                          },
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
