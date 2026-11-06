import Link from 'next/link'
import SafeImage from '@/components/SafeImage'
import type { Post } from '@/lib/posts'
import { formatDate } from '@/lib/site'

export default function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const Heading = compact ? 'h3' : 'h2'
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition block"
    >
      <SafeImage
        src={post.image}
        alt={post.title}
        width={800}
        height={400}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={`object-cover w-full ${compact ? 'h-40' : 'h-48'}`}
      />
      <div className="p-4">
        <p className="text-gray-500 text-sm">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <Heading className={`${compact ? 'text-base' : 'text-lg'} font-bold mt-1`}>
          {post.title}
        </Heading>
        {compact && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.description}</p>}
      </div>
    </Link>
  )
}
