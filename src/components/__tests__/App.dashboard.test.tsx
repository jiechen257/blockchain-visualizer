import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { renderWithStore } from '@/test/renderWithStore'
import useBlockchainStore from '@/store/useBlockchainStore'
import { createNewBlock, mineBlock } from '@/utils/blockchain'

describe('App dashboard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('keeps dashboard primary sections visible after styling changes', () => {
    localStorage.setItem('tutorialCompleted', 'true')
    renderWithStore(<App />)
    expect(screen.getByText(/系统总览/i)).toBeInTheDocument()
    expect(screen.getAllByText(/^快速开始$/)[0]).toBeInTheDocument()
    expect(screen.getByText(/最近动态/i)).toBeInTheDocument()
    expect(screen.getByText(/主链舞台/i)).toBeInTheDocument()
  })

  it('shows a create-wallet empty state when no wallets exist', () => {
    renderWithStore(<App />)
    expect(screen.getByText(/创建第一个钱包/i)).toBeInTheDocument()
  })

  it('shows checklist items after tutorial is dismissed', async () => {
    localStorage.setItem('tutorialCompleted', 'true')

    renderWithStore(<App />)

    expect(await screen.findByText(/^创建一个钱包$/)).toBeInTheDocument()
    expect(screen.getByText(/发起一笔交易/i)).toBeInTheDocument()
  })

  it('shows structured block details after selecting a block', async () => {
    const store = useBlockchainStore.getState()
    const genesisBlock = mineBlock(createNewBlock({
      index: -1,
      timestamp: 0,
      transactions: [],
      previousHash: '0',
      hash: '0',
      nonce: 0,
    }), 1)
    store.addBlockToChain('main', genesisBlock)
    localStorage.setItem('tutorialCompleted', 'true')

    renderWithStore(<App />, { reset: false })

    await userEvent.click(screen.getAllByRole('button', { name: /区块 0/i })[0])

    expect(await screen.findByText(/前序哈希/i)).toBeInTheDocument()
  })
})
