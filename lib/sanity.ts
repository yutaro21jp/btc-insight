import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // あなたのSanityのプロジェクトID
  dataset: 'production',
  apiVersion: '2025-02-19', // 最新の日付でOK
  useCdn: true,
})

// 追加
import imageUrlBuilder from '@sanity/image-url'
import { Image as SanityImageSource } from 'sanity'

// 既存の client を使って builder を作成
const builder = imageUrlBuilder(client)

// 型付きのヘルパー関数を作る（便利）
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export async function getPosts(excludeSlugs?: string[]) {
  const excludeFilter = excludeSlugs && excludeSlugs.length > 0
    ? `&& ! (slug.current in [${excludeSlugs.map(s => `"${s}"`).join(', ')}])`
    : ''
  const query = `*[_type == "post" ${excludeFilter}] | order(publishedAt desc){
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage
  }`
  return await client.fetch(query, {}, { next: { tags: ['posts'] } })
}

export async function getWelcomePost() {
  const query = `*[_type == "post" && slug.current == "welcome"][0]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage
  }`
  return await client.fetch(query, {}, { next: { tags: ['posts', 'post:welcome'] } })
}

export async function getPostBySlug(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    publishedAt,
    mainImage,
    showMainImageAtTop,
    body,
    excerpt,
    "author": author->{name, image, bio, "slug": slug.current},
    "categories": categories[]->{title, slug},
    "tags": tags[]->{name, slug},
    faq[]{question, answer}
  }`
  return await client.fetch(query, { slug }, { next: { tags: ['posts', `post:${slug}`] } })
}

export async function getAuthorBySlug(authorSlug: string) {
  const query = `*[_type == "author" && slug.current == $authorSlug][0]{
    name,
    image,
    bio,
    "slug": slug.current
  }`
  return await client.fetch(query, { authorSlug }, { next: { tags: [`author:${authorSlug}`] } })
}

export async function getPostsByAuthorSlug(authorSlug: string) {
  const query = `*[_type == "post" && author->slug.current == $authorSlug] | order(publishedAt desc){
    _id,
    title,
    slug,
    publishedAt,
    mainImage
  }`
  return await client.fetch(query, { authorSlug }, { next: { tags: ['posts', `author:${authorSlug}`] } })
}

export async function getPostsByCategorySlug(categorySlug: string) {
  const query = `*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc){
    _id,
    title,
    slug,
    publishedAt,
    mainImage
  }`
  return await client.fetch(query, { categorySlug }, { next: { tags: ['posts', `category:${categorySlug}`] } })
}

export async function getCategoryBySlug(categorySlug: string) {
  const query = `*[_type == "category" && slug.current == $categorySlug][0]{
    title,
    "slug": slug.current
  }`
  return await client.fetch(query, { categorySlug }, { next: { tags: [`category:${categorySlug}`] } })
}

export async function getTagBySlug(tagSlug: string) {
  const query = `*[_type == "tag" && slug.current == $tagSlug][0]{
    name,
    "slug": slug.current
  }`
  return await client.fetch(query, { tagSlug }, { next: { tags: [`tag:${tagSlug}`] } })
}

export async function getPostsByTagSlug(tagSlug: string) {
  const query = `*[_type == "post" && $tagSlug in tags[]->slug.current] | order(publishedAt desc){
    _id,
    title,
    slug,
    publishedAt,
    mainImage
  }`
  return await client.fetch(query, { tagSlug }, { next: { tags: ['posts', `tag:${tagSlug}`] } })
}

export async function getAllCategories() {
  const query = `*[_type == "category"]{
    title,
    "slug": slug.current
  }`
  return await client.fetch(query, {}, { next: { tags: ['categories'] } })
}

export async function getAllTags() {
  const query = `*[_type == "tag"]{
    name,
    "slug": slug.current
  }`
  return await client.fetch(query, {}, { next: { tags: ['tags'] } })
}

export async function getAllAuthors() {
  const query = `*[_type == "author"]{
    name,
    "slug": slug.current
  }`
  return await client.fetch(query, {}, { next: { tags: ['authors'] } })
}

export async function getRelatedPosts(slug: string, categorySlugs: string[] = [], tagSlugs: string[] = [], limit = 4) {
  if (!categorySlugs.length && !tagSlugs.length) return []

  const categoryQuery = `*[_type == "post" && slug.current != $slug && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage
  }`

  const tagQuery = `*[_type == "post" && slug.current != $slug && count((tags[]->slug.current)[@ in $tagSlugs]) > 0] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage
  }`

  const [categoryPosts, tagPosts] = await Promise.all([
    categorySlugs.length ? client.fetch(categoryQuery, { slug, categorySlugs, limit }, { next: { tags: ['posts'] } }) : [],
    tagSlugs.length ? client.fetch(tagQuery, { slug, tagSlugs, limit }, { next: { tags: ['posts'] } }) : [],
  ])

  const deduped: Record<string, any> = {}
  ;[...categoryPosts, ...tagPosts].forEach((post) => {
    if (!deduped[post._id]) {
      deduped[post._id] = post
    }
  })

  return Object.values(deduped).slice(0, limit)
}
