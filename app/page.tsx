import type { Metadata } from 'next'
import { getFrameMetadata } from '@coinbase/onchainkit'
import { BASE_URL } from './baseurl'

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: '☆☆==-. LFG .-==☆☆',
    }
  ],
  image: `${BASE_URL}/api/og/lander?fu-cache-nonce=2`,
  post_url: `${BASE_URL}/api/frame?idx=0`,
})

export const metadata: Metadata = {
  title: 'Yearn Vaults Frame',
  description: 'Juicy vault apys x tvls from yearn.fi',
  openGraph: {
    title: 'Yearn Vaults Frame',
    description: 'Juicy vault apys x tvls from yearn.fi',
    images: [`${BASE_URL}/api/og/lander?fu-cache-nonce=2`],
  },
  other: {
    ...frameMetadata,
  },
}

export default function Home() {
  return <main className="min-h-screen flex flex-col items-center justify-center">
    <div className={`relative w-[1200px] h-[630px] p-24 
      flex flex-col items-center justify-center
      bg-primary-600
      `}>
      <div className="absolute w-[600px] h-[630px] top-0 left-0 flex items-center justify-center">
        <h1 style={{ letterSpacing: '-0.125em' }} className="font-mono text-6xl">Yearn Vaults</h1>
      </div>

      <div className="absolute w-[500px] h-[630px] top-0 right-0 flex">
        <img className="absolute z-0 inset" width="500" height="630" src={`${BASE_URL}/bg-fuchsia.png`} />
        <div className="absolute z-10 inset w-full h-full flex items-center justify-center">
          <div className="w-[148px] h-[186px] flex items-center justify-center bg-primary-600 rounded-lg">
            <img className="w-[96px] h-[96px]" src={`${BASE_URL}/y.png`} />
          </div>
        </div>
      </div>
    </div>
  </main>
}
