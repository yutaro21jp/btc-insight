'use client'

import { useEffect } from 'react'

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
  targetId?: string
}

export default function XTweetEmbedClient({ tweetId, targetId }: XTweetEmbedClientProps) {
  useEffect(() => {
    let cancelled = false
    let attempts = 0
    const maxAttempts = 20
    const intervalMs = 250

    const load = () => {
      if (cancelled) return
      const target = targetId ? document.getElementById(targetId) : null
      if (target && window.twttr?.widgets?.createTweet) {
        window.twttr.widgets.createTweet(tweetId, target, { align: 'center' })
        return
      }
      if (attempts < maxAttempts) {
        attempts += 1
        window.setTimeout(load, intervalMs)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [tweetId, targetId])

  return null
}
