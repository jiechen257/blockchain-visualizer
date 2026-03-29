import type { ReactElement } from 'react'
import { render, type RenderResult } from '@testing-library/react'
import useBlockchainStore from '@/store/useBlockchainStore'

export const resetBlockchainStore = () => {
  const initialState = useBlockchainStore.getInitialState()
  useBlockchainStore.setState(initialState, true)
}

export const resetStore = resetBlockchainStore

export const renderWithStore = (
  ui: ReactElement,
  options?: { reset?: boolean }
): RenderResult => {
  if (options?.reset !== false) {
    resetBlockchainStore()
  }
  return render(ui)
}
