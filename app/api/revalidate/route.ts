import { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

const ERROR_UNAUTHORIZED = 'Unauthorized'
const ERROR_BAD_REQUEST = 'Bad Request'

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  const authHeader = req.headers.get('authorization')

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return new Response(ERROR_UNAUTHORIZED, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch (_err) {
    return new Response(ERROR_BAD_REQUEST, { status: 400 })
  }

  const docType = body?._type
  const slug = body?.slug?.current

  // Always refresh shared lists
  revalidateTag('posts')

  if (docType === 'post' && slug) {
    revalidateTag(`post:${slug}`)
  }

  if (docType === 'author' && slug) {
    revalidateTag(`author:${slug}`)
  }

  if (docType === 'category' && slug) {
    revalidateTag(`category:${slug}`)
  }

  if (docType === 'tag' && slug) {
    revalidateTag(`tag:${slug}`)
  }

  return new Response('ok')
}
