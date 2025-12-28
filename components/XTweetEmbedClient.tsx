'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (id: string, el: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLElement>
      }
    }
  }
}

type XTweetEmbedClientProps = {
  tweetId: string
}

export default function XTweetEmbedClient({ tweetId }: XTweetEmbedClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [useIframeFallback, setUseIframeFallback] = useState(false)

  useEffect(() => {
    let cancelled = false
    let attempts = 0
    const maxAttempts = 20
    const intervalMs = 250
    const fallbackDelayMs = 2000

    const tryCreate = () => {
      if (cancelled) return false
      const target = containerRef.current
      if (!target || !window.twttr?.widgets?.createTweet) return false
      target.innerHTML = ''
      window.twttr.widgets
        .createTweet(tweetId, target, { align: 'center', dnt: true })
        .then(() => {
          if (!cancelled) setUseIframeFallback(false)
        })
        .catch(() => {
          if (!cancelled) setUseIframeFallback(true)
        })
      return true
    }

    if (tryCreate()) return

    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled) setUseIframeFallback(true)
    }, fallbackDelayMs)

    const interval = window.setInterval(() => {
      if (tryCreate()) {
        window.clearInterval(interval)
        window.clearTimeout(fallbackTimer)
      } else if (attempts >= maxAttempts) {
        window.clearInterval(interval)
      } else {
        attempts += 1
      }
    }, intervalMs)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      window.clearTimeout(fallbackTimer)
    }
  }, [tweetId])

  if (useIframeFallback) {
    return (
      <iframe
        title="X post"
        src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&dnt=true&align=center`}
        className="w-full max-w-[550px] h-[520px] border-0"
        allow="encrypted-media; autoplay; fullscreen"
        loading="lazy"
      />
    )
  }

  return <div ref={containerRef} className="min-h-[200px] w-full max-w-[550px]" />
}
