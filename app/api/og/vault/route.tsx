import { ImageResponse } from 'next/og'
import { fetchFonts } from '../fonts'
import { template } from './template'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const chainId = parseInt(searchParams.get('chainId') || '1')
  const address = (searchParams.get('address') || '0x') as `0x${string}`

  const options = {
    width: 1200,
    height: 630,
    fonts: await fetchFonts()
  }

  return new ImageResponse(await template(chainId, address), options)
}
