import Script from 'next/script'

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

  return (
    <div>
      <Script
        id="x-widgets"
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
      />
      <blockquote className="twitter-tweet">
        <a href={canonicalUrl}>View on X</a>
      </blockquote>
    </div>
  )
}
