import { notFound } from 'next/navigation'
import TermPosts from '@/components/TermPosts'
import { getAllTerms, getPostsByTerm } from '@/lib/posts'
import { pageMetadata } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllTerms('tags').map(({ slug }) => ({ slug }))
}

function getTag(slug: string) {
  return getAllTerms('tags').find((term) => term.slug === slug) ?? notFound()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const term = getTag((await params).slug)
  return pageMetadata(
    `${term.name} | BTCインサイト`,
    `${term.name}のブログ記事`,
    `/tags/${encodeURIComponent(term.slug)}`
  )
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const term = getTag((await params).slug)
  return <TermPosts kind="tags" term={term} posts={getPostsByTerm('tags', term.slug)} />
}
