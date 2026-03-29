import { beforeEach, describe, expect, it } from 'vitest'
import useBlockchainStore from '@/store/useBlockchainStore'
import { resetStore } from '@/test/renderWithStore'
import { createNewBlock, mineBlock } from '@/utils/blockchain'

describe('labFlowSlice', () => {
  beforeEach(() => {
    resetStore()
    localStorage.clear()
  })

  it('switches between guided, sandbox, advanced, and glossary modes', () => {
    const store = useBlockchainStore.getState()

    store.setActiveMode('sandbox')
    expect(useBlockchainStore.getState().activeMode).toBe('sandbox')

    store.setActiveMode('advanced')
    expect(useBlockchainStore.getState().activeMode).toBe('advanced')

    store.setActiveMode('glossary')
    expect(useBlockchainStore.getState().activeMode).toBe('glossary')
  })

  it('advances and rewinds guide step one phase at a time', () => {
    const store = useBlockchainStore.getState()

    expect(store.guideStep).toBe('wallet')

    store.advanceGuideStep()
    expect(useBlockchainStore.getState().guideStep).toBe('transaction')

    store.advanceGuideStep()
    expect(useBlockchainStore.getState().guideStep).toBe('broadcast')

    store.rewindGuideStep()
    expect(useBlockchainStore.getState().guideStep).toBe('transaction')

    store.rewindGuideStep()
    expect(useBlockchainStore.getState().guideStep).toBe('wallet')
  })

  it('syncs guide state from blockchain activity', () => {
    const store = useBlockchainStore.getState()

    store.createWallet()
    store.createWallet()
    store.syncGuideFromState()
    expect(useBlockchainStore.getState().guideStep).toBe('transaction')

    const [from, to] = useBlockchainStore.getState().wallets
    const signed = useBlockchainStore.getState().signTransaction(from.address, to.address, 5)
    useBlockchainStore.getState().addPendingTransaction({ ...signed!, fee: 1 })
    useBlockchainStore.getState().syncGuideFromState()
    expect(useBlockchainStore.getState().guideStep).toBe('mempool')
    expect(useBlockchainStore.getState().timelineStep).toBe('mempool')

    const previousBlock = {
      index: -1,
      timestamp: 0,
      transactions: [],
      previousHash: '0',
      hash: '0',
      nonce: 0,
    }
    const transactionInPool = useBlockchainStore.getState().pendingTransactions[0]
    const minedBlock = mineBlock(createNewBlock(previousBlock, [transactionInPool]), 1)
    useBlockchainStore.getState().addBlockToChain('main', minedBlock)
    useBlockchainStore.getState().syncGuideFromState()

    expect(useBlockchainStore.getState().guideStep).toBe('confirmed')
    expect(useBlockchainStore.getState().timelineStep).toBe('confirmed')

    const signedAgain = useBlockchainStore.getState().signTransaction(from.address, to.address, 3)
    useBlockchainStore.getState().addPendingTransaction({ ...signedAgain!, fee: 1 })
    useBlockchainStore.getState().syncGuideFromState()

    expect(useBlockchainStore.getState().guideStep).toBe('mempool')
    expect(useBlockchainStore.getState().timelineStep).toBe('mempool')
  })
})
