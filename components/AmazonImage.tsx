const ASSOCIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? 'YOUR_ASSOCIATE_TAG'

interface AmazonImageProps {
  asin: string
  name: string
  size?: number
  className?: string
}

/**
 * Renders a product image via Amazon's official Associates image service.
 * URL format is from Amazon's own "Get Link → Image only" Associates tool.
 */
export default function AmazonImage({ asin, name, size = 250, className = '' }: AmazonImageProps) {
  const src = `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL${size}_&tag=${ASSOCIATE_TAG}`

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className={`object-contain ${className}`}
    />
  )
}
