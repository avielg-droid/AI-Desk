'use client'

import { useState } from 'react'

const ASSOCIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? 'YOUR_ASSOCIATE_TAG'

interface AmazonImageProps {
  asin: string
  name: string
  /** Optional local image path in /public, e.g. "/products/beelink-sei14.jpg" */
  localSrc?: string
  size?: number
  className?: string
}

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full h-full min-h-[120px] p-4">
      <svg className="h-8 w-8 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 leading-tight text-center max-w-[120px]">
        {name}
      </span>
    </div>
  )
}

type Status = 'loading' | 'loaded' | 'error-local' | 'error-amazon' | 'error-all'

export default function AmazonImage({ asin, name, localSrc, size = 250, className = '' }: AmazonImageProps) {
  // If localSrc provided, try it first. Otherwise go straight to Amazon.
  const [status, setStatus] = useState<Status>(localSrc ? 'loading' : 'error-local')

  const amazonSrc = `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL${size}_&tag=${ASSOCIATE_TAG}`

  // All sources failed — show placeholder
  if (status === 'error-all') return <Placeholder name={name} />

  // Determine which src to render
  const activeSrc = status === 'error-local' ? amazonSrc : (localSrc ?? amazonSrc)

  const handleError = () => {
    if (status === 'loading') {
      // Local image failed — try Amazon
      setStatus('error-local')
    } else if (status === 'error-local') {
      // Amazon also failed — show placeholder
      setStatus('error-all')
    }
  }

  return (
    <>
      {status === 'loading' && <Placeholder name={name} />}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={activeSrc}
        src={activeSrc}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        onLoad={() => setStatus('loaded')}
        onError={handleError}
        style={{ display: status === 'loaded' ? 'block' : 'none' }}
        className={`object-contain ${className}`}
      />
    </>
  )
}
