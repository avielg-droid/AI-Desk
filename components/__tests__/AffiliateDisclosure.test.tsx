import { render, screen } from '@testing-library/react'
import AffiliateDisclosure from '../AffiliateDisclosure'

it('renders the required Amazon Associates disclosure text', () => {
  render(<AffiliateDisclosure />)
  expect(
    screen.getByText(/As an Amazon Associate I earn from qualifying purchases/i)
  ).toBeInTheDocument()
})
