import type { Metadata } from 'next'
import { getFrameMetadata } from '@coinbase/onchainkit'

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: '💥 lfg 💥',
    }
  ],
  image: `${process.env.NEXT_PUBLIC_BASE_URL}/framelander.png`,
  post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?idx=0`,
})

export const metadata: Metadata = {
  title: 'V3 Live Stream',
  description: 'latest yearn.fi apys x tvls',
  openGraph: {
    title: 'V3 Live Stream',
    description: 'latest yearn.fi apys x tvls',
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/framelander.png`],
  },
  other: {
    ...frameMetadata,
  },
}

export default function Home() {
  return <main className="min-h-screen flex flex-col items-center justify-center">
    <div className={`relative p-24 
      flex flex-col items-center justify-center
      bg-black/20 rounded-lg
      `}>
      <h1 className="font-bold text-4xl">V3 Live Stream</h1>
      <p className="font-mono">latest yearn.fi apys x tvls</p>
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <div className="font-mono text-neutral-400 text-xs">live</div>
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
      </div>
    </div>
  </main>
}
