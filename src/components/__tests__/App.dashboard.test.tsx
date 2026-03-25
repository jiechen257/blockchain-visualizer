import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import App from '@/App'
import { renderWithStore } from '@/test/renderWithStore'

describe('App dashboard', () => {
  it('renders hero, stat cards, and visualization stage sections', () => {
    renderWithStore(<App />)
    expect(screen.getByText(/系统总览/i)).toBeInTheDocument()
    expect(screen.getByText(/快速开始/i)).toBeInTheDocument()
    expect(screen.getByText(/主链舞台/i)).toBeInTheDocument()
  })
})
