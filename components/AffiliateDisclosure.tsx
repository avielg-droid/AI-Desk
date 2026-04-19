export default function AffiliateDisclosure({ className }: { className?: string }) {
  return (
    <p className={`font-mono text-xs ${className ?? ''}`}>
      As an Amazon Associate I earn from qualifying purchases.
    </p>
  )
}
