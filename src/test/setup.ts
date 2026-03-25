import { beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

const matchMediaMock = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => null,
  removeEventListener: () => null,
  addListener: () => null,
  removeListener: () => null,
  dispatchEvent: () => false,
})

const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem(key: string) {
      return store[key] ?? null
    },
    setItem(key: string, value: string) {
      store[key] = value
    },
    removeItem(key: string) {
      delete store[key]
    },
    clear() {
      store = {}
    },
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
})
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
})
Object.defineProperty(globalThis, 'matchMedia', {
  value: matchMediaMock,
  configurable: true,
})
Object.defineProperty(window, 'matchMedia', {
  value: matchMediaMock,
  configurable: true,
})

beforeEach(async () => {
  localStorageMock.clear()
  const { default: useBlockchainStore } = await import('@/store/useBlockchainStore')
  const initialState = useBlockchainStore.getInitialState()
  useBlockchainStore.setState(initialState, true)
})
