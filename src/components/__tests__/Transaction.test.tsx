import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Transaction from '@/components/Transaction'
import { renderWithStore, resetStore } from '@/test/renderWithStore'
import useBlockchainStore from '@/store/useBlockchainStore'

describe('Transaction', () => {
  beforeEach(() => {
    resetStore()
    localStorage.clear()
  })

  it('shows a validation message when sender and receiver are the same', async () => {
    useBlockchainStore.getState().createWallet()
    const senderWallet = useBlockchainStore.getState().wallets[0]
    const senderLabel = new RegExp(senderWallet.address.slice(0, 8))

    renderWithStore(<Transaction />, { reset: false })

    const triggers = screen.getAllByRole('combobox')
    await userEvent.click(triggers[0])
    await userEvent.click(await screen.findByRole('option', { name: senderLabel }))
    await userEvent.click(triggers[1])
    await userEvent.click(await screen.findByRole('option', { name: senderLabel }))
    await userEvent.click(screen.getByRole('button', { name: /发送交易/i }))

    expect(screen.getByText(/请选择有效的钱包组合/i)).toBeInTheDocument()
  })

  it('shows success guidance after adding a transaction to the pool', async () => {
    useBlockchainStore.getState().createWallet()
    useBlockchainStore.getState().createWallet()
    const [senderWallet, receiverWallet] = useBlockchainStore.getState().wallets
    const senderLabel = new RegExp(senderWallet.address.slice(0, 8))
    const receiverLabel = new RegExp(receiverWallet.address.slice(0, 8))

    renderWithStore(<Transaction />, { reset: false })

    const triggers = screen.getAllByRole('combobox')
    await userEvent.click(triggers[0])
    await userEvent.click(await screen.findByRole('option', { name: senderLabel }))
    await userEvent.click(triggers[1])
    await userEvent.click(await screen.findByRole('option', { name: receiverLabel }))

    await userEvent.clear(screen.getByLabelText(/金额/i))
    await userEvent.type(screen.getByLabelText(/金额/i), '5')
    await userEvent.clear(screen.getByLabelText(/手续费/i))
    await userEvent.type(screen.getByLabelText(/手续费/i), '1')

    await userEvent.click(screen.getByRole('button', { name: /发送交易/i }))

    expect(await screen.findByText(/交易已加入待确认池/i)).toBeInTheDocument()
    expect(screen.getByText(/现在可以去挖矿确认它/i)).toBeInTheDocument()
  })
})
