'use client'

import { useState } from 'react'

const ASSOCIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? 'YOUR_ASSOCIATE_TAG'

interface AmazonImageProps {
  asin: string
  name: string
  size?: number
  className?: string
}

function Placeholder({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-lg text-center p-4 w-full h-full min-h-[120px] ${className ?? ''}`}
      aria-label={name}
    >
      <svg className="h-8 w-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 leading-tight max-w-[120px]">
        {name}
      </span>
    </div>
  )
}

export default function AmazonImage({ asin, name, size = 250, className = '' }: AmazonImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  // Primary: Amazon Associates image service
  const src = `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL${size}_&tag=${ASSOCIATE_TAG}`

  return (
    <>
      {/* Placeholder shown while loading or on error */}
      {status !== 'loaded' && <Placeholder name={name} className={className} />}

      {/* Image hidden until loaded, removed from layout on error */}
      {status !== 'error' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`object-contain transition-opacity duration-300 ${
            status === 'loaded' ? `opacity-100 ${className}` : 'opacity-0 absolute w-0 h-0'
          }`}
        />
      )}
    </>
  )
}
