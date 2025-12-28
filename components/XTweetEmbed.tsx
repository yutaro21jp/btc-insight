import XTweetEmbedClient from '@/components/XTweetEmbedClient'

type XTweetEmbedProps = {
  url: string
}

export default function XTweetEmbed({ url }: XTweetEmbedProps) {
  const canonicalUrl = (() => {
    const statusMatch = url.match(/status\/(\d+)/)
    if (statusMatch?.[1]) {
      return `https://twitter.com/i/web/status/${statusMatch[1]}`
    }
    return url
  })()
  const tweetId = url.match(/status\/(\d+)/)?.[1]
  const containerId = tweetId ? `x-tweet-${tweetId}` : undefined

  return (
    <div id={containerId}>
      {tweetId ? (
        <XTweetEmbedClient tweetId={tweetId} targetId={containerId} />
      ) : (
        <blockquote className="twitter-tweet">
          <a href={canonicalUrl}>View on X</a>
        </blockquote>
      )}
    </div>
  )
}
