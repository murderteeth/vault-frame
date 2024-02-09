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

function truncateName(name: string, at = 22) {
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

export async function template(chainId: number, address: string) {
  const response = await fetch(process.env.KONG || '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: VAULT_QUERY,
      variables: { chainId, address }
    })
  })

  const { data } = await response.json()
  const { vault } = data

  const icon = `https://assets.smold.app/api/token/${chainId}/${address}/logo-128.png?fallback=true&w=48&q=75`

  const juiced = vault.name.toLowerCase().includes('ajna')
  const bgcolor = juiced ? ajna_naranja_300 : primary_950
  const txtcolor = juiced ? ajna_naranja_950 : '#fff'

  return <div tw={`w-full h-full px-16 py-20 flex flex-col items-end justify-between text-[${txtcolor}] bg-[${bgcolor}]`}>
    <div tw="w-full flex items-center justify-between">
      <div tw="flex flex-col justify-start">
        <div tw="text-6xl tracking-tighter">{truncateName(vault.name)}</div>
        <div>{`${chainName(chainId)} ${fEvmAddress(address)}`}</div>
      </div>
      <img src={icon} tw="w-24 h-24" />
    </div>

    <div tw="w-[70%] flex flex-col items-center justify-between">
      <div tw="flex w-full items-end justify-between">
        <div tw="text-4xl">{'APR......'}</div>
        <div tw="flex items-end">
          <div tw="text-8xl tracking-tighter">
            {fPercent(vault.apyNet)}
          </div>
          <div tw="flex w-32 h-24 ml-16">
            <Minibars series={vault.apySparkline.map((point: any) => point.value)} color={txtcolor} />
          </div>
        </div>
      </div>

      <div tw="flex w-full mt-16 items-end justify-between">
        <div tw="text-4xl">{'TVL......'}</div>
        <div tw="flex items-end">
          <div tw="text-8xl tracking-tighter">
            {fUSD(vault.tvlUsd)}
          </div>
          <div tw="flex w-32 h-24 ml-16">
            <Minibars series={vault.tvlSparkline.map((point: any) => point.value)} color={txtcolor} />
          </div>
        </div>
      </div>
    </div>
  </div>
}
