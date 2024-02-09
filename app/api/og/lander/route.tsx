import { ImageResponse } from 'next/og'
import { fetchFonts } from '../fonts'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const primary_600 = '#8761ce'

const template = <div tw={`flex w-full h-full flex-col items-center justify-center text-white bg-[${primary_600}]`}>
  <div tw="text-6xl">Yearn Vaults Frame</div>
</div>

export async function GET(req: NextRequest) {
  const options = {
    width: 1200,
    height: 630,
    fonts: await fetchFonts()
  }

  return new ImageResponse(template, options)
}
