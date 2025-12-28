'use client'

import { Tweet } from 'react-tweet'

type TweetEmbedProps = {
  id: string
}

export default function TweetEmbed({ id }: TweetEmbedProps) {
  return (
    <Tweet
      id={id}
      apiUrl={`/api/tweet/${id}`}
      fetchOptions={{ cache: 'no-store' }}
    />
  )
}
