export default function AffiliateDisclosure({ className }: { className?: string }) {
  return (
    <p className={`text-sm text-gray-500 ${className ?? ''}`}>
      As an Amazon Associate I earn from qualifying purchases.
    </p>
  )
}
