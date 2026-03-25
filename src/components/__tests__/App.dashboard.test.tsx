import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import App from '@/App'
import { renderWithStore } from '@/test/renderWithStore'

describe('App dashboard', () => {
  it('renders the header with the branding title', () => {
    renderWithStore(<App />)
    const matches = screen.getAllByText(/区块链可视化系统/i)
    expect(matches.length).toBeGreaterThan(0)
  })
})
