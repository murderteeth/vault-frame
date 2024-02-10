import { ImageResponse } from 'next/og'
import { fetchFonts } from '../fonts'
import { NextRequest } from 'next/server'
import { BASE_URL } from '@/app/baseurl'

export const runtime = 'edge'

const primary_600 = '#8761ce'

const template = <div tw={`flex w-full h-full flex-col items-center justify-center text-white bg-[${primary_600}]`}>
  <div tw="absolute w-[600px] h-[630px] top-0 left-0 flex items-center justify-center">
    <h1 tw="font-mono text-6xl">Yearn Vaults</h1>
  </div>
  <div tw="absolute w-[500px] h-[630px] top-0 right-0 flex">
    <img tw="absolute" width="500" height="630" src={`${BASE_URL}/bg-fuchsia.png`} />
    <div tw="absolute w-full h-full flex items-center justify-center">
      <div tw={`w-[148px] h-[186px] flex items-center justify-center bg-[${primary_600}] rounded-sm`}>
        <img tw="w-[96px] h-[96px]" src={`${BASE_URL}/y.png`} />
      </div>
    </div>
  </div>
</div>

export async function GET(req: NextRequest) {
  const options = {
    width: 1200,
    height: 630,
    fonts: await fetchFonts()
  }

  return new ImageResponse(template, options)
}
