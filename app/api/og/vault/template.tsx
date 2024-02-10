import { BASE_URL } from '@/app/baseurl'
import { computeJuicedApr } from './apr'

const primary_50 = '#f6f5fd'
const primary_100 = '#efedfa'
const primary_200 = '#e1ddf7'
const primary_300 = '#cbc2f0'
const primary_400 = '#b09fe6'
const primary_500 = '#9478da'
const primary_600 = '#8761ce'
const primary_700 = '#7249b8'
const primary_800 = '#5f3c9b'
const primary_900 = '#4f337f'
const primary_950 = '#322055'

const ajna_naranja_300 = '#f1ebd9'
const ajna_naranja_950 = '#341d14'

const VAULT_QUERY = `query Data($chainId: Int!, $address: String!) {
  vault(chainId: $chainId, address: $address) {
    chainId
    address
    name
    decimals
    tvlUsd
    tvlSparkline {
      value
      time
    }
    apyNet
    apySparkline {
      value
      time
    }
  }
}`

export function fPercent (amount: number, fixed?: number) {
  return `${(amount * 100).toFixed(fixed || 2)}%`
}

export function fEvmAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function fUSD(amount: number, options?: { fixed?: number, hideUsd?: boolean }) {
  const fixed = Number.isInteger(options?.fixed) ? options?.fixed : 2
  let result = ''
  if(!Number.isFinite(amount)) result = 'NaN'
  else if (amount < 1000) result = amount.toFixed(fixed)
  else if (amount < 1e6) result = `${(amount / 1e3).toFixed(fixed)}K`
  else if (amount < 1e9) result = `${(amount / 1e6).toFixed(fixed)}M`
  else if (amount < 1e12) result = `${(amount / 1e9).toFixed(fixed)}B`
  else result = `${(amount / 1e12).toFixed(fixed)}T`
  if (options?.hideUsd) return result
  return `${result}`
}

export default function Minibars({ series, color }: { series: number[], color: string }) {
	const maxBar = 100
	const maxSeries = Math.max(...series)
	const scale = maxBar / maxSeries
	const bars = series.map(value => Math.round(scale * value) || 1)
	return <div tw="w-full flex items-end justify-between">
		{bars.map((bar, index) => <div key={index} tw={`
			${index ? 'ml-2' : ''} flex grow h-[${bar}%] text-[${color}] bg-[${color}]`}>{'.'}</div>)}
	</div>
}

function truncateName(name: string, at = 20) {
  return name.length > at ? `${name.slice(0, at)}...` : name
}

function chainName(chainId: number) {
  switch (chainId) {
    case 1: return 'Ethereum'
    case 10: return 'Optimism'
    case 137: return 'Polygon'
    case 250: return 'Fantom'
    case 8453: return 'Base'
    case 42161: return 'Arbitrum'
    default: throw new Error(`Unknown chainId: ${chainId}`)
  }
}

function MeterLine({ label, measure, measure2, points, bgcolor, txtcolor, tw }: { label: string, measure: string, measure2?: string, points: number[], bgcolor: string, txtcolor: string, tw?: string }) {
  const pad = Math.max(0, 7 - measure.length)
  return <div tw={`flex items-end ${tw ? tw : ''}`}>
    <div tw="text-4xl">{label}</div>
    <div tw="flex items-end">
      <div tw="relative flex text-6xl tracking-tighter">
        <div tw={`flex text-[${bgcolor}]`}>{'*'.repeat(pad)}</div>
        {measure}
        {measure2 && <div tw="absolute -bottom-6 right-0 flex text-2xl">{measure2}</div>}
      </div>
      <div tw="flex ml-12 w-32 h-20">
        <Minibars series={points} color={txtcolor} />
      </div>
    </div>
  </div>
}

async function fetchKongVault(chainId: number, address: string) {
  const response = await fetch(process.env.KONG || '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: VAULT_QUERY,
      variables: { chainId, address }
    })
  })
  const { data } = await response.json()
  return data.vault
}

async function fetchYDaemonApr(chainId: number, address: string) {
  const response = await fetch(`${process.env.DAEMON || ''}/${chainId}/vault/${address}`)
  const json = await response.json()
  return json.apr
}

export async function template(chainId: number, address: `0x${string}`) {
  const vault = await fetchKongVault(chainId, address)
  const apr = await fetchYDaemonApr(chainId, address)
  const baseApr = apr.points.monthAgo || apr.points.weekAgo
  const icon = `https://assets.smold.app/api/token/${chainId}/${address}/logo-128.png?fallback=true&w=48&q=75`

  const juiced = vault.name.toLowerCase().includes('ajna')
  const juicedApr = juiced ? await computeJuicedApr(chainId, vault.decimals, address) : 0
  const bgcolor = juiced ? ajna_naranja_300 : primary_600
  const bgimage = juiced ? 'bg-juiced.png' : 'bg-fuchsia.png'
  const txtcolor = juiced ? ajna_naranja_950 : primary_100
  const name = vault.name.replace(/Vault$/, '').trim()

  return <div tw={`flex w-full h-full flex-col items-center justify-center text-[${txtcolor}] bg-[${bgcolor}]`}>
    <div tw="absolute w-[600px] h-[630px] top-0 left-0 pl-8 py-12 flex flex-col justify-between">
      <div tw="flex flex-col justify-start">
        <div style={{ whiteSpace: 'nowrap', letterSpacing: '-0.125em' }} tw="text-6xl">{truncateName(name)}</div>
      </div>

      <div tw="-mt-16 pr-4 flex flex-col items-end">
        <MeterLine label="APR" 
          measure={juiced ? fPercent(juicedApr) : fPercent(baseApr)} 
          measure2={juiced ? `+ base ${fPercent(baseApr)}` : undefined} 
          points={vault.apySparkline.map((point: any) => point.value)} 
          bgcolor={bgcolor} 
          txtcolor={txtcolor} />
        <MeterLine label="TVL" 
          measure={fUSD(vault.tvlUsd)} 
          points={vault.tvlSparkline.map((point: any) => point.value)} 
          bgcolor={bgcolor} 
          txtcolor={txtcolor} tw="mt-12" />
      </div>

      <div tw="text-2xl">{`${chainName(chainId)} ${fEvmAddress(address)}`}</div>
    </div>

    <div tw="absolute w-[500px] h-[630px] top-0 right-0 flex">
      <img tw="absolute" width="500" height="630" src={`${BASE_URL}/${bgimage}`} />
      <div tw="w-full h-full flex items-center justify-center">
        <div tw={`w-[148px] h-[186px] flex items-center justify-center bg-[${bgcolor}] rounded-lg`}>
          <img tw="w-[96px] h-[96px]" src={icon} />
        </div>
      </div>
    </div>
  </div>
}
