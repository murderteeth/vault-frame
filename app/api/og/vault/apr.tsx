import { PublicClient, createPublicClient, getAddress, http } from 'viem'
import { mainnet, polygon } from 'viem/chains'
import { YVAULT_V3_ABI } from '@/lib/abi/yVaultV3.abi'
import { YVAULT_STAKING_ABI } from '@/lib/abi/yVaultStaking.abi'

const CHAINS: { [key: number]: any } = {
  1: mainnet,
  137: polygon
}

const PERIPHERALS: { [key: `0x${string}`]: {
  staker: `0x${string}`,
  rewards: `0x${string}`,
  compounder: `0x${string}`
}} = {
  '0xe24BA27551aBE96Ca401D39761cA2319Ea14e3CB': {
    staker: '0x54C6b2b293297e65b1d163C3E8dbc45338bfE443' as `0x${string}`,
    rewards: '0x9a96ec9B57Fb64FbC60B423d1f4da7691Bd35079' as `0x${string}`,
    compounder: '0x082a5743aAdf3d0Daf750EeF24652b36a68B1e9C' as `0x${string}`
  },
  '0xF54a15F6da443041Bb075959EA66EE47655DDFcA': {
    staker: '0x602920E7e0a335137E02DF139CdF8D1381DAdBfD' as `0x${string}`,
    rewards: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' as `0x${string}`,
    compounder: '0x4987d1856F93DFf29e08aa605A805FaF43dC3103' as `0x${string}`
  }
}

function getRpc(chainId: number) {
  const envar = `FULL_NODE_${chainId}`
  const url = process.env[envar]
  if (!url) throw new Error(`Missing ${envar} environment variable`)
  return createPublicClient({ chain: CHAINS[chainId], transport: http(url) }) as PublicClient
}

async function fetchChainData(
  chainId: number,
  vault: `0x${string}`,
  staker: `0x${string}`,
  rewards: `0x${string}`
) {
  const rpc = getRpc(chainId)
  const multicall = await rpc.multicall({ contracts: [
    {
      address: vault,
      abi: YVAULT_V3_ABI,
      functionName: 'totalSupply'
    },
    {
      address: staker,
      abi: YVAULT_STAKING_ABI,
      functionName: 'rewardData',
      args: [getAddress(rewards)]
    }
  ] })
  return multicall
}

async function fetchPrices(chainId: number) {
  const response = await fetch(`${process.env.DAEMON || ''}/${chainId}/prices/all`)
  return await response.json()
}

export async function computeJuicedApr(chainId: number, decimals: number, vault: `0x${string}`) {
  const peripherals = PERIPHERALS[getAddress(vault)]
  const prices = await fetchPrices(chainId)
  const onchain = await fetchChainData(
    chainId, vault, peripherals.staker, peripherals.rewards
  )

  const denominator = 10 ** (18 - decimals + 6 + 2)
  const vaultSupply = onchain?.[0]?.result || 0n
  const rewardRate = onchain?.[1]?.result?.[3] || 0n
  const rewardDuration = onchain?.[1]?.result?.[1] || 0n
  const rewardsPerWeek = rewardRate * rewardDuration
  const rewardsPrice = BigInt(prices[peripherals.rewards])
  const result = Number(((rewardsPerWeek * rewardsPrice) / vaultSupply) * 52n * 100n) / denominator
  return result
}
