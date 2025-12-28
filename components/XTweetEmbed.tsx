import Script from 'next/script'
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

  return tweetId ? (
    <div className="w-full flex justify-center">
      <Script
        id="x-widgets"
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
      />
      <XTweetEmbedClient tweetId={tweetId} />
    </div>
  ) : (
    <blockquote className="twitter-tweet">
      <a href={canonicalUrl}>View on X</a>
    </blockquote>
  )
}
