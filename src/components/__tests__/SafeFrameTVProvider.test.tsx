import React from 'react'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import SafeFrameTVProvider from '../SafeFrameTVProvider'
import { useSafeFrameTV } from '../../hooks/useSafeFrameTV'

// Mock ScaleUtil with more detailed implementation
const mockScaleUtil = {
  getScaleInfo: jest.fn(() => ({
    width: 1920,
    height: 1080,
    scaleRatio: 150,
  })),
  updateScaleRatio: jest.fn(() => ({
    width: 1920,
    height: 1080,
    scaleRatio: 150,
  })),
  addResizeListener: jest.fn((callback) => {
    // Store callback for manual triggering in tests
    mockScaleUtil._resizeCallback = callback
    return jest.fn() // Return cleanup function
  }),
  getRealWidth: jest.fn(() => 1920),
  getRealHeight: jest.fn(() => 1080),
  _resizeCallback: null as any,
}

jest.mock('../../utils/scale', () => ({
  ScaleUtil: mockScaleUtil,
}))

// Mock platform instance
jest.mock('@osiris-smarttv/platform', () => ({
  PlatformInstance: {
    isSmartTV: jest.fn(() => true),
    isChrome: jest.fn(() => false),
  },
}))

// Test component that uses the hook
const TestComponent: React.FC<{ debug?: boolean }> = ({ debug }) => {
  const { dimension } = useSafeFrameTV()
  return (
    <div data-testid="test-content">
      <span data-testid="width">{dimension.width}</span>
      <span data-testid="height">{dimension.height}</span>
      <span data-testid="scale-ratio">{dimension.scaleRatio}</span>
    </div>
  )
}

describe('SafeFrameTVProvider Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children within safe frame container', () => {
    render(
      <SafeFrameTVProvider>
        <div data-testid="child">Test Child</div>
      </SafeFrameTVProvider>
    )

    const child = screen.getByTestId('child')
    expect(child).toBeInTheDocument()
    
    // Check if container has safe frame data attribute
    const container = child.parentElement
    expect(container).toHaveAttribute('data-safe-frame', 'true')
  })

  it('should apply default safe frame styles', () => {
    render(
      <SafeFrameTVProvider>
        <div data-testid="child">Test Child</div>
      </SafeFrameTVProvider>
    )

    const container = screen.getByTestId('child').parentElement
    const styles = window.getComputedStyle(container!)
    
    // Note: jsdom doesn't fully compute styles, so we check inline styles
    expect(container).toHaveStyle({
      width: '80rem',
      height: '45rem',
      position: 'absolute',
    })
  })

  it('should merge custom container styles', () => {
    const customStyle = { backgroundColor: 'red', zIndex: 999 }
    
    render(
      <SafeFrameTVProvider containerStyle={customStyle}>
        <div data-testid="child">Test Child</div>
      </SafeFrameTVProvider>
    )

    const container = screen.getByTestId('child').parentElement
    expect(container).toHaveStyle(customStyle)
    // Should still have default styles
    expect(container).toHaveStyle({ width: '80rem' })
  })

  it('should provide dimension context to children', () => {
    render(
      <SafeFrameTVProvider>
        <TestComponent />
      </SafeFrameTVProvider>
    )

    expect(screen.getByTestId('width')).toHaveTextContent('1920')
    expect(screen.getByTestId('height')).toHaveTextContent('1080')
    expect(screen.getByTestId('scale-ratio')).toHaveTextContent('150')
  })

  it('should initialize dimensions on mount', () => {
    render(
      <SafeFrameTVProvider>
        <TestComponent />
      </SafeFrameTVProvider>
    )

    expect(mockScaleUtil.getScaleInfo).toHaveBeenCalled()
  })

  it('should register resize listener', () => {
    render(
      <SafeFrameTVProvider>
        <TestComponent />
      </SafeFrameTVProvider>
    )

    expect(mockScaleUtil.addResizeListener).toHaveBeenCalled()
  })

  it('should update dimensions on resize', async () => {
    // Setup different return value for updateScaleRatio
    mockScaleUtil.updateScaleRatio.mockReturnValue({
      width: 1280,
      height: 720,
      scaleRatio: 100,
    })

    render(
      <SafeFrameTVProvider>
        <TestComponent />
      </SafeFrameTVProvider>
    )

    // Initial render
    expect(screen.getByTestId('width')).toHaveTextContent('1920')

    // Trigger resize callback
    act(() => {
      if (mockScaleUtil._resizeCallback) {
        mockScaleUtil._resizeCallback()
      }
    })

    // Should update with new dimensions
    expect(screen.getByTestId('width')).toHaveTextContent('1280')
    expect(screen.getByTestId('height')).toHaveTextContent('720')
    expect(screen.getByTestId('scale-ratio')).toHaveTextContent('100')
  })

  it('should enable debug logging when debug prop is true', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    // Setup a dimension change to trigger debug logging
    mockScaleUtil.updateScaleRatio.mockReturnValue({
      width: 1280,
      height: 720,
      scaleRatio: 100,
    })

    render(
      <SafeFrameTVProvider debug={true}>
        <TestComponent debug={true} />
      </SafeFrameTVProvider>
    )

    // Trigger resize to see debug logs
    act(() => {
      if (mockScaleUtil._resizeCallback) {
        mockScaleUtil._resizeCallback()
      }
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'SafeFrameTV: Dimension updated',
      expect.any(Object)
    )

    process.env.NODE_ENV = originalEnv
    consoleSpy.mockRestore()
  })

  it('should cleanup resize listener on unmount', () => {
    const cleanupFn = jest.fn()
    mockScaleUtil.addResizeListener.mockReturnValue(cleanupFn)

    const { unmount } = render(
      <SafeFrameTVProvider>
        <TestComponent />
      </SafeFrameTVProvider>
    )

    unmount()

    expect(cleanupFn).toHaveBeenCalled()
  })
})