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

  return (
    tweetId ? (
      <iframe
        title="X post"
        src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&dnt=true&align=center`}
        className="w-full max-w-[550px] h-[520px] border-0"
        allow="encrypted-media; autoplay; fullscreen"
        loading="lazy"
      />
    ) : (
      <blockquote className="twitter-tweet">
        <a href={canonicalUrl}>View on X</a>
      </blockquote>
    )
  )
}
