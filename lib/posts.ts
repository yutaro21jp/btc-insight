import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import authorData from '@/content/authors.json'

const text = z.string().trim().min(1)
const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '半角英数字とハイフンを使ってください')
const imageSchema = text.refine((value) => {
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}, '画像は /images/... または https://... で指定してください')
const dateSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.iso.date()
)
const authorSchema = z.strictObject({
  name: text,
  image: imageSchema.optional(),
  title: text.optional(),
  organization: text.optional(),
  location: text.optional(),
  bio: text.optional(),
  expertise: z.array(text).default([]),
  achievements: z.array(text).default([]),
  credentials: z.array(text).default([]),
  socialLinks: z
    .strictObject({
      nostr: z.url().startsWith('https://').optional(),
      x: z.url().startsWith('https://').optional(),
      github: z.url().startsWith('https://').optional(),
    })
    .optional(),
})

const authors = z.record(slugSchema, authorSchema).parse(authorData)
const termSchema = z.strictObject({ name: text, slug: slugSchema })
const termsSchema = z
  .array(termSchema)
  .refine(
    (terms) => new Set(terms.map((term) => term.slug)).size === terms.length,
    '同じslugを重複して指定できません'
  )
  .default([])
const frontmatterSchema = z.strictObject({
  title: text,
  date: dateSchema,
  updated: dateSchema.optional(),
  description: text,
  image: imageSchema.optional(),
  showImage: z.boolean().default(true),
  author: slugSchema
    .refine(
      (slug) => Object.hasOwn(authors, slug),
      'content/authors.json に執筆者を登録してください'
    )
    .optional(),
  categories: termsSchema,
  tags: termsSchema,
  faq: z.array(z.strictObject({ question: text, answer: text })).default([]),
  draft: z.boolean().default(true),
})

export type Author = z.infer<typeof authorSchema> & { slug: string }
export type Term = z.infer<typeof termSchema>
export type Post = Omit<z.infer<typeof frontmatterSchema>, 'author'> & {
  slug: string
  body: string
  author?: Author
}

/** Validate every file, including drafts, before returning publishable articles. */
export function loadPublishedPosts(directory = path.join(process.cwd(), 'content/posts')): Post[] {
  const posts = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry): Post => {
      const source = path.join(directory, entry.name)
      const slug = entry.name.slice(0, -3)
      if (!slugSchema.safeParse(slug).success)
        throw new Error(`${source}: ファイル名には半角英数字とハイフンを使ってください`)

      const { data, content } = matter(readFileSync(source, 'utf8'))
      const result = frontmatterSchema.safeParse(data)
      if (!result.success) {
        const issues = result.error.issues.map(
          (issue) => `${issue.path.join('.') || 'frontmatter'}: ${issue.message}`
        )
        throw new Error(`${source}\n${issues.join('\n')}`)
      }
      const metadata = result.data
      if (!content.trim()) throw new Error(`${source}: 記事本文が空です`)
      if (metadata.updated && metadata.updated < metadata.date)
        throw new Error(`${source}: updated は date 以降の日付にしてください`)

      return {
        ...metadata,
        slug,
        body: content.trim(),
        author: metadata.author
          ? { ...authors[metadata.author], slug: metadata.author }
          : undefined,
      }
    })

  // A shared URL must always have one label, even when used by different articles.
  for (const key of ['categories', 'tags'] as const) {
    const labels = new Map<string, string>()
    for (const post of posts) {
      for (const term of post[key]) {
        if (labels.has(term.slug) && labels.get(term.slug) !== term.name) {
          throw new Error(
            `${key}: 「${labels.get(term.slug)}」と「${term.name}」のURLが重複しています (${term.slug})`
          )
        }
        labels.set(term.slug, term.name)
      }
    }
  }

  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}

export function getPosts() {
  return loadPublishedPosts()
}

export function getPostBySlug(slug: string) {
  return getPosts().find((post) => post.slug === slug)
}

export function getAllAuthors(): Author[] {
  return Object.entries(authors).map(([slug, author]) => ({ ...author, slug }))
}

export function getAuthorBySlug(slug: string) {
  return getAllAuthors().find((author) => author.slug === slug)
}

export function getPostsByAuthorSlug(slug: string) {
  return getPosts().filter((post) => post.author?.slug === slug)
}

export function getAllTerms(key: 'categories' | 'tags'): Term[] {
  const terms = new Map(
    getPosts()
      .flatMap((post) => post[key])
      .map((term) => [term.slug, term])
  )
  return [...terms.values()].sort((a, b) => a.name.localeCompare(b.name, 'ja'))
}

export function getPostsByTerm(key: 'categories' | 'tags', slug: string) {
  return getPosts().filter((post) => post[key].some((term) => term.slug === slug))
}

export function getRelatedPosts(post: Post, limit = 4) {
  const matches = (other: Post, key: 'categories' | 'tags') =>
    other[key].some((term) => post[key].some((own) => own.slug === term.slug))
  const candidates = getPosts().filter((other) => other.slug !== post.slug)
  return [
    ...candidates.filter((other) => matches(other, 'tags')),
    ...candidates.filter((other) => !matches(other, 'tags') && matches(other, 'categories')),
  ].slice(0, limit)
}
