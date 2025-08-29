import { ScaleResult } from './utils/scale'

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
}

/**
 * Safe Frame TV hook return type
 */
export interface SafeFrameTVReturn extends SafeFrameTVContextType {
  // Future extensions can be added here
}
