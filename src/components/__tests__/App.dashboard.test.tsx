import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import App from '@/App'
import { renderWithStore } from '@/test/renderWithStore'

describe('App dashboard', () => {
  it('renders a system overview heading', () => {
    renderWithStore(<App />)
    expect(screen.getByText(/系统总览/i)).toBeInTheDocument()
  })
})
