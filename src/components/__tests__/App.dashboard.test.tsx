import { render, screen } from '@testing-library/react'
import App from '@/App'

it('renders a system overview heading', () => {
  render(<App />)
  expect(screen.getByText(/系统总览/i)).toBeInTheDocument()
})
