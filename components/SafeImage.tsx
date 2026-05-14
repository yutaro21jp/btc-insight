"use client"

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

const defaultFallbackSrc = '/images/fallback.webp'

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src?: string | null
  fallbackSrc?: string
}

export default function SafeImage({ src, fallbackSrc = defaultFallbackSrc, alt, onError, ...props }: SafeImageProps) {
  const resolvedSrc = src || fallbackSrc
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc)

  useEffect(() => {
    setCurrentSrc(resolvedSrc)
  }, [resolvedSrc])

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc)
        }
        onError?.(event)
      }}
    />
  )
}
