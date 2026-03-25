import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import App from '@/App'
import { renderWithStore } from '@/test/renderWithStore'

describe('App dashboard', () => {
  it('renders hero, stat cards, network simulation, and visualization stage sections', () => {
    renderWithStore(<App />)
    expect(screen.getByText(/系统总览/i)).toBeInTheDocument()
    expect(screen.getByText(/快速开始/i)).toBeInTheDocument()
    expect(screen.getAllByText(/网络模拟/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/开始模拟/i)).toBeInTheDocument()
    expect(screen.queryByText(/网络状态/i)).not.toBeInTheDocument()
    expect(screen.getByText(/主链舞台/i)).toBeInTheDocument()
  })

  it('shows a create-wallet empty state when no wallets exist', () => {
    renderWithStore(<App />)
    expect(screen.getByText(/创建第一个钱包/i)).toBeInTheDocument()
  })
})
