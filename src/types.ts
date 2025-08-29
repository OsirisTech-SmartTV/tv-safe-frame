import { ScaleResult } from './utils/scale'

/**
 * Safe Frame insets - distances from safe frame to viewport edges
 */
export interface SafeFrameInsets {
  top: number
  bottom: number
  left: number
  right: number
}

/**
 * Safe Frame TV constants
 */
export interface SafeFrameConstants {
  width: string
  height: string
  aspectRatio: number
}

/**
 * Safe Frame TV context type
 */
export interface SafeFrameTVContextType {
  dimension: ScaleResult
  insets: SafeFrameInsets
}

/**
 * Safe Frame TV hook return type
 */
export interface SafeFrameTVReturn extends SafeFrameTVContextType {
  // Future extensions can be added here
}
