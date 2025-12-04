import { MetadataRoute } from 'next'
import { getAllAuthors, getAllCategories, getAllTags, getPosts } from '@/lib/sanity'

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    '',
    '/blog',
  ].map((path) => ({
    url: new URL(path || '/', siteUrl).toString(),
    lastModified: new Date(),
  }))

  const [posts, categories, tags, authors] = await Promise.all([
    getPosts(),
    getAllCategories(),
    getAllTags(),
    getAllAuthors(),
  ])

  posts.forEach((post: any) => {
    routes.push({
      url: new URL(`/blog/${post.slug.current}`, siteUrl).toString(),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    })
  })

  categories.forEach((category: any) => {
    routes.push({
      url: new URL(`/categories/${category.slug}`, siteUrl).toString(),
      lastModified: new Date(),
    })
  })

  tags.forEach((tag: any) => {
    routes.push({
      url: new URL(`/tags/${tag.slug}`, siteUrl).toString(),
      lastModified: new Date(),
    })
  })

  authors.forEach((author: any) => {
    routes.push({
      url: new URL(`/authors/${author.slug}`, siteUrl).toString(),
      lastModified: new Date(),
    })
  })

  return routes
}
