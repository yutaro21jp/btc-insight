'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (el?: HTMLElement) => void
      }
    }
  }
}

type XTweetWidgetLoaderProps = {
  targetId?: string
}

export default function XTweetWidgetLoader({ targetId }: XTweetWidgetLoaderProps) {
  useEffect(() => {
    let cancelled = false
    let attempts = 0
    const maxAttempts = 20
    const intervalMs = 250

    const load = () => {
      if (cancelled) return
      const target = targetId ? document.getElementById(targetId) : undefined
      if (window.twttr?.widgets?.load) {
        window.twttr.widgets.load(target ?? undefined)
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
  }, [targetId])

  return null
}
