import { getFrameHtmlResponse } from '@coinbase/onchainkit'
import { NextRequest, NextResponse } from 'next/server'
import { Vault, fetchVaults } from './vaults'
import { compare } from 'compare-versions'
import { BASE_URL } from '@/app/baseurl'
import { cache } from '../cache'

async function getVaults() {
  const cached = cache.get<Vault[]>('vaults')
  if (cached) return cached

  const vaults = await fetchVaults()

  const filtered = vaults.filter(vault => vault.type === 'vault' && compare(vault.apiVersion, '3.0.0', '>='))
  filtered.sort((a, b) => a.tvlUsd > b.tvlUsd ? -1 : 1)
  const topTen = filtered.slice(0, 10)

  cache.set('vaults', topTen)
  return topTen
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams
  const idx = parseInt(searchParams.get('idx') || '0')

  const vaults = await getVaults()
  const vault = vaults[idx % vaults.length]


  const target = vault.name.toLowerCase().includes('ajna')
  ? 'https://juiced.yearn.fi'
  : `https://yearn.fi/v3/${vault.chainId}/${vault.address}`

  const image = `${BASE_URL}/api/og/vault?chainId=${vault.chainId}&address=${vault.address}&fu-cache=${new Date().getTime()}`

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
    post_url: `${BASE_URL}/api/frame?idx=${idx + 1}&fu-cache-nonce=2`,
  })

  return new NextResponse(frame)
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req)
}

export const dynamic = 'force-dynamic'
