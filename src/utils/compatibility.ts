/**
 * React 17 Compatibility Layer
 * Provides polyfills and compatibility shims for React >= 17 and older browsers
 */

// Only import polyfills if they're needed and available
const loadPolyfills = () => {
  try {
    // Only import core-js polyfills in environments that need them
    if (typeof Array.prototype.includes === 'undefined') {
      require('core-js/stable/array/includes')
    }
    if (typeof Array.prototype.find === 'undefined') {
      require('core-js/stable/array/find')
    }
    if (typeof Object.values === 'undefined') {
      require('core-js/stable/object/values')
    }
    if (typeof Object.entries === 'undefined') {
      require('core-js/stable/object/entries')
    }
    if (typeof Promise === 'undefined') {
      require('core-js/stable/promise')
    }
    if (typeof Symbol === 'undefined') {
      require('core-js/stable/symbol')
    }
  } catch (error) {
    // Polyfills not available, continue without them
    console.warn('Some polyfills could not be loaded:', error)
  }
}

// React 17 JSX runtime compatibility
// This ensures the library works with both React 17+ automatic JSX runtime
// and older React versions with classic JSX runtime
export interface ReactCompatibility {
  version: string
  hasJSXRuntime: boolean
  hasCreateRoot: boolean
}

/**
 * Detect React version and available features
 */
export function getReactCompatibility(): ReactCompatibility {
  let version = '17.0.0'
  let hasJSXRuntime = false
  let hasCreateRoot = false

  try {
    // Try to detect React version
    const React = require('react')
    version = React.version || '17.0.0'

    // Check for React 18+ createRoot API
    try {
      require('react-dom/client')
      hasCreateRoot = true
    } catch {
      hasCreateRoot = false
    }

    // Check for JSX runtime (React 17+)
    try {
      require('react/jsx-runtime')
      hasJSXRuntime = true
    } catch {
      hasJSXRuntime = false
    }
  } catch {
    // React not available, assume compatible defaults
  }

  return {
    version,
    hasJSXRuntime,
    hasCreateRoot,
  }
}

/**
 * Browser compatibility detection for Chromium >= 53
 */
export interface BrowserCompatibility {
  isSupported: boolean
  chromeVersion: number | null
  supportsES2017: boolean
  supportsModules: boolean
  needsPolyfills: boolean
}

/**
 * Check if current browser supports our minimum requirements
 */
export function getBrowserCompatibility(): BrowserCompatibility {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''

  // Chrome version detection
  const chromeMatch = userAgent.match(/Chrome\/(\d+)/)
  const chromeVersion = chromeMatch ? parseInt(chromeMatch[1], 10) : null

  // Basic feature detection for older browsers
  const supportsES2017 =
    typeof Object.values === 'function' &&
    typeof Array.prototype.includes === 'function'

  const supportsModules = 'noModule' in document.createElement('script')

  // Check if we're on minimum Chrome version or equivalent
  const isChromiumBased = chromeVersion !== null && chromeVersion >= 53
  const isSupported = isChromiumBased || supportsES2017

  const needsPolyfills =
    !supportsES2017 || (chromeVersion !== null && chromeVersion < 60)

  return {
    isSupported,
    chromeVersion,
    supportsES2017,
    supportsModules,
    needsPolyfills,
  }
}

/**
 * Initialize polyfills for older browsers if needed
 */
export function initializePolyfills(): void {
  const browserCompat = getBrowserCompatibility()

  if (browserCompat.needsPolyfills) {
    // Load polyfills conditionally
    loadPolyfills()

    // Add regenerator runtime for async/await support
    if (typeof global !== 'undefined' && !(global as any).regeneratorRuntime) {
      try {
        require('regenerator-runtime/runtime')
      } catch (error) {
        console.warn('regenerator-runtime not available:', error)
      }
    }

    // Add console polyfill for very old browsers
    if (typeof console === 'undefined') {
      ;(global as any).console = {
        log: () => {},
        warn: () => {},
        error: () => {},
        info: () => {},
        debug: () => {},
      }
    }
  }
}

/**
 * Log compatibility information (development only)
 */
export function logCompatibilityInfo(): void {
  if (process.env.NODE_ENV === 'development') {
    const reactCompat = getReactCompatibility()
    const browserCompat = getBrowserCompatibility()

    console.group('🚀 Osiris Smart TV Platform - Compatibility Info')
    console.log('📱 React Version:', reactCompat.version)
    console.log(
      '⚛️ JSX Runtime:',
      reactCompat.hasJSXRuntime ? '✅ Automatic' : '🔧 Classic'
    )
    console.log(
      '🌐 Browser Support:',
      browserCompat.isSupported ? '✅ Supported' : '❌ Unsupported'
    )
    console.log('📦 Chrome Version:', browserCompat.chromeVersion || 'Unknown')
    console.log(
      '🔧 Needs Polyfills:',
      browserCompat.needsPolyfills ? '✅ Loaded' : '❌ Not needed'
    )
    console.groupEnd()
  }
}

// Initialize polyfills on import
if (typeof window !== 'undefined') {
  initializePolyfills()
}

export default {
  getReactCompatibility,
  getBrowserCompatibility,
  initializePolyfills,
  logCompatibilityInfo,
}
