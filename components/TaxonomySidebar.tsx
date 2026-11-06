import Link from 'next/link'
import { getAllTerms } from '@/lib/posts'

export default function TaxonomySidebar() {
  const groups = [
    { key: 'categories', title: 'カテゴリ', terms: getAllTerms('categories') },
    { key: 'tags', title: 'タグ', terms: getAllTerms('tags') },
  ].filter((group) => group.terms.length)

  return (
    <aside className="lg:col-span-1 lg:sticky top-8 h-fit">
      <div className="bg-gray-100 p-6 rounded-lg space-y-6">
        {groups.map((group) => (
          <div key={group.key}>
            <h2 className="text-xl font-bold mb-3">{group.title}</h2>
            <div className="flex flex-wrap gap-2">
              {group.terms.map((term) => (
                <Link
                  key={term.slug}
                  href={`/${group.key}/${encodeURIComponent(term.slug)}`}
                  className="bg-white border px-3 py-1 rounded-full text-sm text-gray-700 hover:border-orange-400 transition"
                >
                  {term.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
        {!groups.length && (
          <div>
            <h2 className="text-xl font-bold mb-3">ニュースレター</h2>
            <a
              href="https://diamondhandscommunity.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 hover:underline"
            >
              無料ニュースレターに登録
            </a>
          </div>
        )}
      </div>
    </aside>
  )
}
