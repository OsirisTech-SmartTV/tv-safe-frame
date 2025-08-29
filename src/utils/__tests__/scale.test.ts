/**
 * @jest-environment jsdom
 */

import { ScaleUtil, getRealWidth, getRealHeight, scaleFont } from '../scale'

// Mock the platform dependency
jest.mock('@osiris-smarttv/platform', () => ({
  PlatformInstance: {
    isSmartTV: () => false,
    isChrome: () => true,
  },
}))

describe('ScaleUtil', () => {
  beforeEach(() => {
    // Reset DOM dimensions
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

    // Reset HTML element font size
    document.documentElement.style.fontSize = ''

    // Clear any cached values
    ScaleUtil.updateScaleRatio()
  })

  afterEach(() => {
    // Clean up event listeners
    jest.clearAllMocks()
  })

  describe('getRealWidth and getRealHeight', () => {
    it('should return current window dimensions for Chrome', () => {
      expect(getRealWidth()).toBe(1920)
      expect(getRealHeight()).toBe(1080)
    })

    it('should handle different viewport sizes', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1280 })
      Object.defineProperty(window, 'innerHeight', { value: 720 })

      // Force cache refresh
      ScaleUtil.updateScaleRatio()

      expect(getRealWidth()).toBe(1280)
      expect(getRealHeight()).toBe(720)
    })
  })

  describe('getScaleInfo', () => {
    it('should return correct scale info for 1920x1080 (reference resolution)', () => {
      const scaleInfo = ScaleUtil.getScaleInfo()

      expect(scaleInfo).toEqual({
        width: 1920,
        height: 1080,
        scaleRatio: 150, // 1920/1920 * 150 = 150%
        insets: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      })
    })

    it('should calculate correct insets for wider aspect ratio (2560x1080)', () => {
      Object.defineProperty(window, 'innerWidth', { value: 2560 })
      Object.defineProperty(window, 'innerHeight', { value: 1080 })

      ScaleUtil.updateScaleRatio()
      const scaleInfo = ScaleUtil.getScaleInfo()

      expect(scaleInfo.width).toBe(1920) // Limited by height * 16/9
      expect(scaleInfo.height).toBe(1080)
      expect(scaleInfo.insets.left).toBe(320) // (2560 - 1920) / 2
      expect(scaleInfo.insets.right).toBe(320)
      expect(scaleInfo.insets.top).toBe(0)
      expect(scaleInfo.insets.bottom).toBe(0)
    })

    it('should calculate correct insets for taller aspect ratio (1920x1440)', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1920 })
      Object.defineProperty(window, 'innerHeight', { value: 1440 })

      ScaleUtil.updateScaleRatio()
      const scaleInfo = ScaleUtil.getScaleInfo()

      expect(scaleInfo.width).toBe(1920)
      expect(scaleInfo.height).toBe(1080) // Limited by width / 16*9
      expect(scaleInfo.insets.left).toBe(0)
      expect(scaleInfo.insets.right).toBe(0)
      expect(scaleInfo.insets.top).toBe(180) // (1440 - 1080) / 2
      expect(scaleInfo.insets.bottom).toBe(180)
    })

    it('should handle smaller viewports correctly', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1280 })
      Object.defineProperty(window, 'innerHeight', { value: 720 })

      ScaleUtil.updateScaleRatio()
      const scaleInfo = ScaleUtil.getScaleInfo()

      expect(scaleInfo.width).toBe(1280)
      expect(scaleInfo.height).toBe(720)
      expect(scaleInfo.insets).toEqual({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      })
    })
  })

  describe('font scaling', () => {
    it('should apply correct font-size to HTML element', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1280 })
      Object.defineProperty(window, 'innerHeight', { value: 720 })

      ScaleUtil.updateScaleRatio()

      // Font scale should be (1280/1920) * 150 = 100%
      expect(document.documentElement.style.fontSize).toBe('100%')
    })

    it('should scale font correctly for larger screens', () => {
      Object.defineProperty(window, 'innerWidth', { value: 3840 })
      Object.defineProperty(window, 'innerHeight', { value: 2160 })

      ScaleUtil.updateScaleRatio()

      // Font scale should be (3840/1920) * 150 = 300%
      expect(document.documentElement.style.fontSize).toBe('300%')
    })
  })

  describe('resize listeners', () => {
    it('should register and remove resize listeners', () => {
      const callback = jest.fn()
      const removeListener = ScaleUtil.addResizeListener(callback)

      expect(typeof removeListener).toBe('function')

      // Should be able to remove listener
      removeListener()
      expect(callback).not.toHaveBeenCalled()
    })

    it('should handle multiple listeners', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      const remove1 = ScaleUtil.addResizeListener(callback1)
      const remove2 = ScaleUtil.addResizeListener(callback2)

      expect(typeof remove1).toBe('function')
      expect(typeof remove2).toBe('function')

      remove1()
      remove2()
    })

    it('should prevent duplicate listeners', () => {
      const callback = jest.fn()
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      ScaleUtil.addResizeListener(callback)
      ScaleUtil.addResizeListener(callback) // Should warn about duplicate

      expect(consoleSpy).toHaveBeenCalledWith(
        'Listener already registered, avoiding duplicate'
      )

      consoleSpy.mockRestore()
    })
  })

  describe('scaleFont utility function', () => {
    it('should return the same result as ScaleUtil.updateScaleRatio', () => {
      const directResult = ScaleUtil.updateScaleRatio()
      const utilityResult = scaleFont()

      expect(utilityResult).toEqual(directResult)
    })
  })

  describe('error handling', () => {
    it('should handle invalid callback in addResizeListener', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      // @ts-expect-error - Testing invalid input
      const removeListener = ScaleUtil.addResizeListener('not a function')

      expect(consoleSpy).toHaveBeenCalledWith(
        'addResizeListener requires a function parameter'
      )
      expect(typeof removeListener).toBe('function')

      consoleSpy.mockRestore()
    })

    it('should handle listener errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const badCallback = () => {
        throw new Error('Test error')
      }

      ScaleUtil.addResizeListener(badCallback)

      // Manually trigger resize to test error handling
      window.dispatchEvent(new Event('resize'))

      // Wait for debounced handler
      setTimeout(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error in resize listener:',
          expect.any(Error)
        )
      }, 200)

      consoleSpy.mockRestore()
    })
  })

  describe('cleanup and destruction', () => {
    it('should handle multiple destroy calls safely', () => {
      ScaleUtil.destroy()
      ScaleUtil.destroy() // Should not throw

      // Should return no-op functions after destruction
      const removeListener = ScaleUtil.addResizeListener(() => {})
      expect(typeof removeListener).toBe('function')
    })
  })
})
