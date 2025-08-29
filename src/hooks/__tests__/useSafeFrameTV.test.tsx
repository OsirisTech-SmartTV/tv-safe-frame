import { useSafeFrameTV } from '../useSafeFrameTV'
import { renderHook } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import SafeFrameTVProvider from '../../components/SafeFrameTVProvider'

// Mock ScaleUtil
jest.mock('../../utils/scale', () => ({
  ScaleUtil: {
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
    addResizeListener: jest.fn(() => jest.fn()),
    getRealWidth: jest.fn(() => 1920),
    getRealHeight: jest.fn(() => 1080),
  },
}))

// Mock platform instance
jest.mock('@osiris-smarttv/platform', () => ({
  PlatformInstance: {
    isSmartTV: jest.fn(() => true),
    isChrome: jest.fn(() => false),
  },
}))

describe('useSafeFrameTV Hook', () => {
  const createWrapper = ({ children }: { children: React.ReactNode }) => (
    <SafeFrameTVProvider>{children}</SafeFrameTVProvider>
  )

  it('should return dimension data when used within provider', () => {
    const { result } = renderHook(() => useSafeFrameTV(), {
      wrapper: createWrapper,
    })

    expect(result.current).toBeDefined()
    expect(result.current.dimension).toEqual({
      width: 1920,
      height: 1080,
      scaleRatio: 150,
    })
  })

  it('should throw error when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    expect(() => {
      renderHook(() => useSafeFrameTV())
    }).toThrow('useSafeFrameTV must be used within a SafeFrameTVProvider')

    consoleSpy.mockRestore()
  })

  it('should log development error when used outside provider in dev mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    try {
      renderHook(() => useSafeFrameTV())
    } catch (error) {
      // Expected to throw
    }

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('useSafeFrameTV must be used within a SafeFrameTVProvider')
    )

    process.env.NODE_ENV = originalEnv
    consoleSpy.mockRestore()
  })
})