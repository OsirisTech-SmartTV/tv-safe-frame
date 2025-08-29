/**
 * Safe Frame TV constants
 * Defines the standard 16:9 aspect ratio safe frame dimensions
 */

import type { SafeFrameConstants } from '../types'

/**
 * Standard Safe Frame dimensions in rem units
 * Based on 16:9 aspect ratio (80:45 = 1.777...)
 */
export const SAFE_FRAME_CONSTANTS: SafeFrameConstants = {
  width: '80rem',
  height: '45rem',
  aspectRatio: 16 / 9, // 1.777...
} as const

/**
 * Safe Frame CSS properties for container styling
 */
export const SAFE_FRAME_CONTAINER_STYLES: React.CSSProperties = {
  width: SAFE_FRAME_CONSTANTS.width,
  height: SAFE_FRAME_CONSTANTS.height,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 'auto',
  overflow: 'hidden',
  // Add some safe defaults
  boxSizing: 'border-box',
  contain: 'layout style paint',
} as const

/**
 * Development helper to validate safe frame dimensions
 */
export function validateSafeFrameDimensions(): boolean {
  if (process.env.NODE_ENV === 'development') {
    const expectedRatio = 16 / 9
    const actualRatio = SAFE_FRAME_CONSTANTS.aspectRatio
    const tolerance = 0.001

    if (Math.abs(actualRatio - expectedRatio) > tolerance) {
      console.warn(
        `Safe Frame aspect ratio mismatch. Expected: ${expectedRatio}, Got: ${actualRatio}`
      )
      return false
    }
  }
  return true
}
