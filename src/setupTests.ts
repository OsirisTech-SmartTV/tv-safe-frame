import '@testing-library/jest-dom'

// Setup tests configuration for Smart TV environment
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1920,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 1080,
})

// Mock console methods for cleaner test output
const originalError = console.error
const originalWarn = console.warn

beforeEach(() => {
  console.error = jest.fn()
  console.warn = jest.fn()
})

afterEach(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Extend global types for test helpers
declare global {
  var resizeWindow: (width: number, height: number) => void
  var waitForEffects: () => Promise<void>
}

// Helper to simulate window resize
;(global as any).resizeWindow = (width: number, height: number) => {
  ;(window as any).innerWidth = width
  ;(window as any).innerHeight = height
  window.dispatchEvent(new Event('resize'))
}

// Helper to wait for effects
;(global as any).waitForEffects = () =>
  new Promise<void>(resolve => setTimeout(resolve, 0))
