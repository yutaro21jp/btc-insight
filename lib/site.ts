import type { Metadata } from 'next'

export const siteName = 'BTCインサイト'
export const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
export const defaultOgImage = new URL('/images/og/no-image.webp', siteUrl).toString()

export function absoluteUrl(value: string) {
  return new URL(value, siteUrl).toString()
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

export function pageMetadata(title: string, description: string, pathname: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      title,
      description,
      url: absoluteUrl(pathname),
      siteName,
      images: [defaultOgImage],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [defaultOgImage] },
  }
}

/** Keep article text from terminating an inline JSON-LD script element. */
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
