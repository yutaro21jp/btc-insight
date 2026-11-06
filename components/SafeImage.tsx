'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

const defaultFallbackSrc = '/images/fallback.webp'

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src?: string | null
  fallbackSrc?: string
}

function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  onError,
  ...props
}: Omit<ImageProps, 'src'> & { src: string; fallbackSrc: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <Image
      {...props}
      src={failed ? fallbackSrc : src}
      alt={alt}
      onError={(event) => {
        if (!failed && src !== fallbackSrc) {
          setFailed(true)
        }
        onError?.(event)
      }}
    />
  )
}

export default function SafeImage({
  src,
  fallbackSrc = defaultFallbackSrc,
  ...props
}: SafeImageProps) {
  const resolvedSrc = src || fallbackSrc
  return (
    <ImageWithFallback key={resolvedSrc} src={resolvedSrc} fallbackSrc={fallbackSrc} {...props} />
  )
}
