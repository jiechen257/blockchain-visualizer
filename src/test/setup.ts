import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
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

const storageMock = (() => {
  const store = new Map<string, string>()

  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key) ?? null : null
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
    removeItem(key: string) {
      store.delete(key)
    },
    clear() {
      store.clear()
    },
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  configurable: true,
})
Object.defineProperty(window, 'localStorage', {
  value: storageMock,
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

if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false
}

if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => undefined
}

if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = () => undefined
}

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => undefined
}

beforeEach(async () => {
  storageMock.clear()
  const { resetBlockchainStore } = await import('@/test/renderWithStore')
  resetBlockchainStore()
})

afterEach(() => cleanup())
