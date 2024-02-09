import type { Metadata } from 'next'
import { getFrameMetadata } from '@coinbase/onchainkit'

const URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000'

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: '💥 lfg 💥',
    }
  ],
  image: `${URL}/api/og/lander`,
  post_url: `${URL}/api/frame?idx=0`,
})

export const metadata: Metadata = {
  title: 'Yearn Vaults Frame',
  description: 'Latest vault apys x tvls from yearn.fi',
  openGraph: {
    title: 'Yearn Vaults Frame',
    description: 'Latest vault apys x tvls from yearn.fi',
    images: [`${URL}/api/og/lander`],
  },
  other: {
    ...frameMetadata,
  },
}

export default function Home() {
  return <main className="min-h-screen flex flex-col items-center justify-center">
    <div className={`w-[1200px] h-[630px] p-24 
      flex flex-col items-center justify-center
      bg-black/20
      `}>
      <h1 className="font-mono text-6xl">Yearn Vaults Frame</h1>
    </div>
  </main>
}
