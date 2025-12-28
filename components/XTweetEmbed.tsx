'use client'

import { useEffect, useRef } from 'react'

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
  }, [url])

  return (
    <div ref={containerRef}>
      <blockquote className="twitter-tweet">
        <a href={url}></a>
      </blockquote>
    </div>
  )
}
