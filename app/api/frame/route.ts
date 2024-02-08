import { getFrameHtmlResponse } from '@coinbase/onchainkit'
import { NextRequest, NextResponse } from 'next/server'

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams
  const idx = parseInt(searchParams.get('idx') || '0')

  const frame = getFrameHtmlResponse({
    buttons: [
      {
        label: 'next 👉',
      },
      {
        action: 'link',
        label: 'deposit',
        target: 'https://yearn.fi',
      }
    ],
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/framelander.png`,
    input: {
      text: 'Tell me a story of yield',
    },
    post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?idx=${idx + 1}`,
  })

  return new NextResponse(frame)
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req)
}

export const dynamic = 'force-dynamic'
