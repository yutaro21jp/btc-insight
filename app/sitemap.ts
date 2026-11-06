import type { MetadataRoute } from 'next'
import { getAllAuthors, getAllTerms, getPosts } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/') },
    { url: absoluteUrl('/blog') },
    ...getPosts().map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updated || post.date,
    })),
    ...getAllTerms('categories').map((term) => ({
      url: absoluteUrl(`/categories/${encodeURIComponent(term.slug)}`),
    })),
    ...getAllTerms('tags').map((term) => ({
      url: absoluteUrl(`/tags/${encodeURIComponent(term.slug)}`),
    })),
    ...getAllAuthors().map((author) => ({ url: absoluteUrl(`/authors/${author.slug}`) })),
  ]
}
