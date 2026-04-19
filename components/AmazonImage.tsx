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
      className={`flex flex-col items-center justify-center gap-2 bg-ink-2 border border-edge/40 rounded-lg text-center p-4 ${className ?? ''}`}
      aria-label={name}
    >
      <svg className="h-8 w-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 leading-tight">
        {name}
      </span>
    </div>
  )
}

export default function AmazonImage({ asin, name, size = 250, className = '' }: AmazonImageProps) {
  const [failed, setFailed] = useState(false)

  const src = `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL${size}_&tag=${ASSOCIATE_TAG}`

  if (failed) {
    return <Placeholder name={name} className={className} />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-contain ${className}`}
    />
  )
}
