import { NextResponse } from 'next/server'
import { getTweet, TwitterApiError } from 'react-tweet/api'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getTweet(params.id)
    return NextResponse.json({ data })
  } catch (error) {
    if (error instanceof TwitterApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch tweet.' },
      { status: 500 }
    )
  }
}
