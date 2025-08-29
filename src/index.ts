// Main library entry point
export { default as SafeFrameTVProvider } from './components/SafeFrameTVProvider'

// Hooks
export { useSafeFrameTV } from './hooks/useSafeFrameTV'

// Utilities
export {
  ScaleUtil,
  getRealHeight,
  getRealWidth,
  scaleFont,
} from './utils/scale'

// Constants
export {
  SAFE_FRAME_CONSTANTS,
  SAFE_FRAME_CONTAINER_STYLES,
  validateSafeFrameDimensions,
} from './constants/safeFrame'

// Types
export type {
  SafeFrameTVContextType,
  SafeFrameTVReturn,
  SafeFrameConstants,
  SafeFrameInsets,
} from './types'
export type { ScaleResult, SafeFrameInsets as ScaleInsets } from './utils/scale'
