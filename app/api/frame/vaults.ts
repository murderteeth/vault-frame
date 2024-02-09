export type Vault = {
  chainId: number
  address: string
  name: string
  apiVersion: string
  tvlUsd: number
}

const QUERY = `query Data {
  vaults {
    chainId
    address
    name
    apiVersion
    tvlUsd
  }
}`

export async function fetchVaults() {
  const response = await fetch(process.env.KONG || '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: QUERY
    })
  })
  const { data } = await response.json()
  const { vaults } = data
  return vaults as Vault[]
}