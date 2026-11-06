import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import XTweetEmbed from '@/components/XTweetEmbed'

function videoId(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return null
    const id =
      parsed.hostname === 'youtu.be'
        ? parsed.pathname.slice(1)
        : ['youtube.com', 'www.youtube.com'].includes(parsed.hostname)
          ? parsed.searchParams.get('v') ||
            parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1]
          : null
    return id && /^[\w-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}

/** Plain Markdown only: no raw HTML, JSX, or executable article content. */
export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        h1: ({ children }) => (
          <h2 className="border-l-4 border-orange-500 pl-4 text-2xl font-bold my-8 border-b-2 border-orange-400 pb-2">
            {children}
          </h2>
        ),
        h2: ({ children }) => (
          <h2 className="border-l-4 border-orange-500 pl-4 text-2xl font-bold my-8 border-b-2 border-orange-400 pb-2">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="border-b-2 border-orange-400 pb-2 text-xl font-bold my-6">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-xl font-bold text-orange-600 mt-6 mb-3">{children}</h4>
        ),
        h5: ({ children }) => <h5 className="text-lg font-semibold mt-3 mb-1">{children}</h5>,
        h6: ({ children }) => <h6 className="text-base font-semibold mt-2 mb-1">{children}</h6>,
        p: ({ children, node }) => {
          const child = node?.children.length === 1 ? node.children[0] : undefined
          if (child?.type === 'element' && child.tagName === 'a' && child.children.length === 1) {
            const label = child.children[0]
            const href = String(child.properties.href || '')
            if (label.type === 'text' && label.value === href) {
              const id = videoId(href)
              if (id)
                return (
                  <div className="aspect-video my-8">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${id}`}
                      title="YouTube動画"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )
              if (/^https:\/\/(?:www\.)?(?:x|twitter)\.com\/[^/]+\/status\/\d+/.test(href))
                return (
                  <div className="flex justify-center my-8">
                    <XTweetEmbed url={href} />
                  </div>
                )
            }
          }
          return <p className="mb-4 text-lg">{children}</p>
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-lg">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-outside mb-4 pl-5 text-lg">{children}</ul>
        ),
        ol: ({ children, start }) => (
          <ol start={start} className="list-decimal list-outside mb-4 pl-5 text-lg">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="mb-2">{children}</li>,
        hr: () => <hr className="my-10 border-t border-gray-300" />,
        pre: ({ children }) => (
          <pre className="my-6 bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
            {children}
          </pre>
        ),
        code: ({ children, className }) => (
          <code className={`font-mono ${className || ''}`}>{children}</code>
        ),
        a: ({ children, href }) => {
          const external = href?.startsWith('https://') || href?.startsWith('http://')
          return (
            <a
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="text-blue-600 hover:underline break-all"
            >
              {children}
            </a>
          )
        },
        // Markdown images occur inside paragraphs, so use an inline element here.
        img: ({ src, alt, title }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || ''}
            title={title}
            loading="lazy"
            className="rounded-lg max-w-full h-auto mx-auto my-8"
          />
        ),
        table: ({ children }) => (
          <table className="block w-full overflow-x-auto my-6 text-left border-collapse">
            {children}
          </table>
        ),
        th: ({ children, style }) => (
          <th style={style} className="border border-gray-300 bg-gray-100 px-4 py-2 font-semibold">
            {children}
          </th>
        ),
        td: ({ children, style }) => (
          <td style={style} className="border border-gray-300 px-4 py-2">
            {children}
          </td>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
