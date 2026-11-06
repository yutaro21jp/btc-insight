import { notFound } from 'next/navigation'
import TermPosts from '@/components/TermPosts'
import { getAllTerms, getPostsByTerm } from '@/lib/posts'
import { pageMetadata } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllTerms('categories').map(({ slug }) => ({ slug }))
}

function getCategory(slug: string) {
  return getAllTerms('categories').find((term) => term.slug === slug) ?? notFound()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const term = getCategory((await params).slug)
  return pageMetadata(
    `${term.name} | BTCインサイト`,
    `${term.name}のブログ記事`,
    `/categories/${encodeURIComponent(term.slug)}`
  )
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const term = getCategory((await params).slug)
  return <TermPosts kind="categories" term={term} posts={getPostsByTerm('categories', term.slug)} />
}
