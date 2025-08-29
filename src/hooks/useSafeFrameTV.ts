import { useContext } from 'react'
import { SafeFrameTVContext } from '../components/SafeFrameTVProvider'
import type { SafeFrameTVReturn } from '../types'

/**
 * Hook to access Safe Frame TV context
 * @returns {SafeFrameTVReturn} The safe frame context with dimension info
 * @throws {Error} When used outside of SafeFrameTVProvider
 */
export function useSafeFrameTV(): SafeFrameTVReturn {
  const context = useContext(SafeFrameTVContext)

  if (!context) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'useSafeFrameTV must be used within a SafeFrameTVProvider. ' +
          'Wrap your component tree with <SafeFrameTVProvider>.'
      )
    }
    throw new Error(
      'useSafeFrameTV must be used within a SafeFrameTVProvider. ' +
        'Please wrap your component with SafeFrameTVProvider.'
    )
  }

  return context
}
