import { render } from '@testing-library/react'
import useBlockchainStore from '@/store/useBlockchainStore'

const initialState = useBlockchainStore.getState()

export const resetStore = () => useBlockchainStore.setState(initialState, true)

export const renderWithStore = (ui: React.ReactElement) => {
  resetStore()
  return render(ui)
}
