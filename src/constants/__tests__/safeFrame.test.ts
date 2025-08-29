import {
  SAFE_FRAME_CONSTANTS,
  SAFE_FRAME_CONTAINER_STYLES,
  validateSafeFrameDimensions,
} from '../safeFrame'

describe('Safe Frame Constants', () => {
  describe('SAFE_FRAME_CONSTANTS', () => {
    it('should have correct dimensions', () => {
      expect(SAFE_FRAME_CONSTANTS.width).toBe('80rem')
      expect(SAFE_FRAME_CONSTANTS.height).toBe('45rem')
    })

    it('should maintain 16:9 aspect ratio', () => {
      const expectedRatio = 16 / 9
      expect(SAFE_FRAME_CONSTANTS.aspectRatio).toBeCloseTo(expectedRatio, 3)
    })
  })

  describe('SAFE_FRAME_CONTAINER_STYLES', () => {
    it('should include safe frame dimensions', () => {
      expect(SAFE_FRAME_CONTAINER_STYLES.width).toBe('80rem')
      expect(SAFE_FRAME_CONTAINER_STYLES.height).toBe('45rem')
    })

    it('should have proper positioning styles', () => {
      expect(SAFE_FRAME_CONTAINER_STYLES.position).toBe('absolute')
      expect(SAFE_FRAME_CONTAINER_STYLES.margin).toBe('auto')
      expect(SAFE_FRAME_CONTAINER_STYLES.overflow).toBe('hidden')
    })

    it('should include performance optimizations', () => {
      expect(SAFE_FRAME_CONTAINER_STYLES.boxSizing).toBe('border-box')
      expect(SAFE_FRAME_CONTAINER_STYLES.contain).toBe('layout style paint')
    })
  })

  describe('validateSafeFrameDimensions', () => {
    it('should return true for valid dimensions', () => {
      const result = validateSafeFrameDimensions()
      expect(result).toBe(true)
    })

    it('should not warn for correct aspect ratio', () => {
      const consoleSpy = jest.spyOn(console, 'warn')
      validateSafeFrameDimensions()
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })
})
