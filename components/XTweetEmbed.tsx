'use client'

import { useEffect, useMemo, useRef } from 'react'

type XTweetEmbedProps = {
  url: string
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (el?: HTMLElement) => void
      }
    }
  }
}

export default function XTweetEmbed({ url }: XTweetEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canonicalUrl = useMemo(() => {
    const statusMatch = url.match(/status\/(\d+)/)
    if (statusMatch?.[1]) {
      return `https://twitter.com/i/web/status/${statusMatch[1]}`
    }
    return url
  }, [url])

  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-x-widgets]'
    )

    const load = () => {
      if (window.twttr?.widgets?.load) {
        window.twttr.widgets.load(containerRef.current ?? undefined)
      }
    }

    if (existingScript) {
      load()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.setAttribute('data-x-widgets', 'true')
    script.onload = load
    document.body.appendChild(script)
  }, [canonicalUrl])

  return (
    <div ref={containerRef}>
      <blockquote className="twitter-tweet">
        <a href={canonicalUrl}>View on X</a>
      </blockquote>
    </div>
  )
}
