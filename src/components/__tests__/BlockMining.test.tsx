import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlockMining from '@/components/BlockMining'
import { renderWithStore, resetStore } from '@/test/renderWithStore'
import useBlockchainStore from '@/store/useBlockchainStore'

describe('BlockMining', () => {
  beforeEach(() => {
    resetStore()
    localStorage.clear()
  })

  it('shows an empty-block notice when mining without pending transactions', async () => {
    const store = useBlockchainStore.getState()
    store.createWallet()

    renderWithStore(<BlockMining />, { reset: false })

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByText(/100 币/))
    await userEvent.click(screen.getByRole('button', { name: /挖掘新区块/i }))

    expect(await screen.findByText(/本次挖出的是空块/i)).toBeInTheDocument()
  })

  it('moves guided timeline to confirmed after mining succeeds', async () => {
    const store = useBlockchainStore.getState()
    store.createWallet()
    store.createWallet()
    const [senderWallet, receiverWallet] = useBlockchainStore.getState().wallets
    const senderLabel = new RegExp(senderWallet.address.slice(0, 8))
    const signedTransaction = store.signTransaction(senderWallet.address, receiverWallet.address, 5)

    store.addPendingTransaction({ ...signedTransaction!, fee: 1 })
    store.syncGuideFromState()

    renderWithStore(<BlockMining />, { reset: false })

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: senderLabel }))
    await userEvent.click(screen.getByRole('button', { name: /挖掘新区块/i }))

    expect(useBlockchainStore.getState().guideStep).toBe('confirmed')
    expect(useBlockchainStore.getState().timelineStep).toBe('confirmed')
    expect(useBlockchainStore.getState().selectedEntity?.type).toBe('block')
  })

  it('records simulation start and stop events', () => {
    const state = useBlockchainStore.getState()

    state.setSimulationState(true)
    state.setSimulationState(false)

    expect(useBlockchainStore.getState().activityFeed[0].type).toBe('simulation.stopped')
  })
})
