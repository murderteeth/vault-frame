import { getFrameHtmlResponse } from '@coinbase/onchainkit'
import { NextRequest, NextResponse } from 'next/server'
import { Vault, fetchVaults } from './vaults'
import { compare } from 'compare-versions'
import { BASE_URL } from '@/app/baseurl'

const naiveCache = {
  vaults: {
    value: [] as Vault[],
    expiration: 0
  }
}

async function getVaults() {
  const cached = naiveCache.vaults
  if (cached.expiration > Date.now()) return cached.value

  const vaults = await fetchVaults()

  const filtered = vaults.filter(vault => compare(vault.apiVersion, '3.0.0', '>='))
  filtered.sort((a, b) => a.tvlUsd > b.tvlUsd ? -1 : 1)
  const topTen = filtered.slice(0, 10)

  naiveCache.vaults = {
    value: topTen,
    expiration: Date.now() + 1000 * 60 * 60
  }

  return topTen
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams
  const idx = parseInt(searchParams.get('idx') || '0')

  const vaults = await getVaults()
  console.log(vaults)
  const vault = vaults[idx % vaults.length]

  
  const target = vault.name.toLowerCase().includes('ajna')
  ? 'https://juiced.yearn.fi'
  : `https://yearn.fi/v3/${vault.chainId}/${vault.address}`

  const image = `${BASE_URL}/api/og/vault?chainId=${vault.chainId}&address=${vault.address}`

  const frame = getFrameHtmlResponse({
    buttons: [
      {
        label: 'next',
      },
      {
        action: 'link',
        label: 'deposit',
        target,
      }
    ],
    image,
    post_url: `${BASE_URL}/api/frame?idx=${idx + 1}`,
  })

  return new NextResponse(frame)
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req)
}

export const dynamic = 'force-dynamic'
