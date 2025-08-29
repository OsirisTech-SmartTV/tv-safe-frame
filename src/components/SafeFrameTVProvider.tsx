import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SafeFrameTVContextType } from '../types'
import { ScaleResult, ScaleUtil } from '../utils/scale'
import { SAFE_FRAME_CONTAINER_STYLES, validateSafeFrameDimensions } from '../constants/safeFrame'

// Validate safe frame dimensions in development
if (process.env.NODE_ENV === 'development') {
  validateSafeFrameDimensions()
}

// Sử dụng ScaleUtil để lấy thông tin kích thước ban đầu
const initialDimension = ScaleUtil.getScaleInfo()

// Create context with better defaults
export const SafeFrameTVContext = createContext<SafeFrameTVContextType | null>(null)

interface SafeFrameTVProviderProps {
  children: ReactNode
  /**
   * Custom container styles to override defaults
   */
  containerStyle?: React.CSSProperties
  /**
   * Enable debug logging in development
   */
  debug?: boolean
}

/**
 * Provider component that wraps the app and provides Smart TV safe frame context
 * Automatically scales content to maintain 16:9 aspect ratio using rem-based scaling
 * 
 * @param children - React components to render within the safe frame
 * @param containerStyle - Optional custom styles for the container
 * @param debug - Enable debug logging in development mode
 */
const SafeFrameTVProvider: React.FC<SafeFrameTVProviderProps> = ({
  children,
  containerStyle,
  debug = false,
}: SafeFrameTVProviderProps) => {
  const [dimension, setDimension] = useState<ScaleResult>(initialDimension)

  // Track resize listener cleanup function
  const cleanupResizeListener = useRef<(() => void) | null>(null)

  // Memoized dimension update function
  const updateDimension = useCallback(() => {
    const newDimension = ScaleUtil.updateScaleRatio()
    
    if (debug && process.env.NODE_ENV === 'development') {
      console.log('SafeFrameTV: Dimension updated', {
        old: dimension,
        new: newDimension,
        viewport: { 
          width: ScaleUtil.getRealWidth(), 
          height: ScaleUtil.getRealHeight() 
        }
      })
    }
    
    setDimension(newDimension)
  }, [debug, dimension])

  // Initialize dimensions when component mounts
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateDimension, 0)
    return () => clearTimeout(timeoutId)
  }, [updateDimension])

  // Manage resize listeners with proper cleanup
  useEffect(() => {
    // Clean up previous listener if exists
    if (cleanupResizeListener.current) {
      cleanupResizeListener.current()
    }

    // Register new resize listener
    const removeListener = ScaleUtil.addResizeListener(updateDimension)
    cleanupResizeListener.current = removeListener

    // Cleanup on unmount or dependency change
    return () => {
      if (cleanupResizeListener.current) {
        cleanupResizeListener.current()
        cleanupResizeListener.current = null
      }
    }
  }, [updateDimension])

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<SafeFrameTVContextType>(
    () => ({
      dimension,
    }),
    [dimension]
  )

  // Merge default container styles with custom styles
  const containerStyles = useMemo<React.CSSProperties>(
    () => ({
      ...SAFE_FRAME_CONTAINER_STYLES,
      ...containerStyle,
    }),
    [containerStyle]
  )

  return (
    <SafeFrameTVContext.Provider value={contextValue}>
      <div style={containerStyles} data-safe-frame="true">
        {children}
      </div>
    </SafeFrameTVContext.Provider>
  )
}

export default SafeFrameTVProvider
