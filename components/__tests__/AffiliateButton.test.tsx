import { render, screen } from '@testing-library/react'
import AffiliateButton from '../AffiliateButton'

it('renders (paid link) disclosure', () => {
  render(<AffiliateButton href="https://amazon.com/dp/B0TEST" label="Check Price on Amazon" />)
  expect(screen.getByText(/paid link/i)).toBeInTheDocument()
})

it('link has correct href', () => {
  render(<AffiliateButton href="https://amazon.com/dp/B0TEST" label="Check Price on Amazon" />)
  expect(screen.getByRole('link')).toHaveAttribute('href', 'https://amazon.com/dp/B0TEST')
})

it('opens in new tab with noopener noreferrer nofollow', () => {
  render(<AffiliateButton href="https://amazon.com/dp/B0TEST" label="Check Price on Amazon" />)
  const link = screen.getByRole('link')
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer nofollow')
})
