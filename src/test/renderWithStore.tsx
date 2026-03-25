import { render } from '@testing-library/react'
import type { RenderResult } from '@testing-library/react'
import useBlockchainStore from '@/store/useBlockchainStore'

export const renderWithStore = (ui: React.ReactElement): RenderResult => {
  const initialState = useBlockchainStore.getInitialState()
  useBlockchainStore.setState(initialState, true)
  return render(ui)
}
