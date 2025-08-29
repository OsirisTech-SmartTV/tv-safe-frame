# Safe Frame Insets Documentation

## Overview

Safe Frame Insets provide information about the distance from the Safe Frame container to the edges of the actual viewport. This is crucial for understanding how your content is positioned relative to the screen edges, especially on displays with different aspect ratios.

## What are Insets?

Insets represent the empty space (margins) around the Safe Frame when the viewport aspect ratio differs from the standard 16:9 ratio:

```typescript
interface SafeFrameInsets {
  top: number     // Distance from top edge of viewport to safe frame
  bottom: number  // Distance from bottom edge of viewport to safe frame  
  left: number    // Distance from left edge of viewport to safe frame
  right: number   // Distance from right edge of viewport to safe frame
}
```

## How Insets Work

### 16:9 Viewport (No Insets)
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │        Safe Frame               │ │
│ │        80rem × 45rem            │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
Insets: { top: 0, bottom: 0, left: 0, right: 0 }
```

### Ultra-wide Viewport (Horizontal Insets)
```
┌─────────────────────────────────────────────────┐
│ █████ ┌─────────────────────────┐ █████ │
│ █████ │                         │ █████ │
│ █████ │      Safe Frame         │ █████ │
│ █████ │      80rem × 45rem      │ █████ │
│ █████ │                         │ █████ │
│ █████ └─────────────────────────┘ █████ │
└─────────────────────────────────────────────────┘
Insets: { top: 0, bottom: 0, left: 320, right: 320 }
```

### Tall Viewport (Vertical Insets)
```
┌─────────────────────────────────────┐
│ ███████████████████████████████████ │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │        Safe Frame               │ │
│ │        80rem × 45rem            │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ ███████████████████████████████████ │
└─────────────────────────────────────┘
Insets: { top: 180, bottom: 180, left: 0, right: 0 }
```

## Usage

### With React Hook

```typescript
import { useSafeFrameTV } from '@osiris-smarttv/tv-safe-frame'

function MyComponent() {
  const { dimension, insets } = useSafeFrameTV()
  
  return (
    <div>
      <h1>Safe Frame Info</h1>
      <p>Frame Size: {dimension.width} × {dimension.height}px</p>
      <p>Scale Ratio: {dimension.scaleRatio}%</p>
      
      <h2>Insets (distances to viewport edges)</h2>
      <ul>
        <li>Top: {insets.top}px</li>
        <li>Bottom: {insets.bottom}px</li>
        <li>Left: {insets.left}px</li>
        <li>Right: {insets.right}px</li>
      </ul>
      
      {/* Conditional rendering based on insets */}
      {insets.left > 0 && (
        <div style={{ color: 'orange' }}>
          ⚠️ Ultra-wide display detected - content is centered horizontally
        </div>
      )}
      
      {insets.top > 0 && (
        <div style={{ color: 'orange' }}>
          ⚠️ Tall display detected - content is centered vertically
        </div>
      )}
    </div>
  )
}
```

### Accessing Context Directly

```typescript
import { useContext } from 'react'
import { SafeFrameTVContext } from '@osiris-smarttv/tv-safe-frame'

function MyComponent() {
  const context = useContext(SafeFrameTVContext)
  
  if (!context) {
    throw new Error('Must be used within SafeFrameTVProvider')
  }
  
  const { dimension, insets } = context
  
  // Use insets for layout decisions
  const hasHorizontalInsets = insets.left > 0 || insets.right > 0
  const hasVerticalInsets = insets.top > 0 || insets.bottom > 0
  
  return (
    <div>
      <p>Viewport type: {
        hasHorizontalInsets ? 'Ultra-wide' :
        hasVerticalInsets ? 'Tall' : 'Standard 16:9'
      }</p>
    </div>
  )
}
```

## Common Use Cases

### 1. Responsive Layout Adjustments

```typescript
function ResponsiveLayout() {
  const { insets } = useSafeFrameTV()
  
  // Adjust layout based on available space
  const isUltrawide = insets.left > 100 // Significant horizontal insets
  const isTall = insets.top > 100 // Significant vertical insets
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isUltrawide ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
      gridTemplateRows: isTall ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
      gap: '1rem'
    }}>
      {/* Content adapts to viewport shape */}
    </div>
  )
}
```

### 2. Warning Messages

```typescript
function ViewportWarning() {
  const { insets } = useSafeFrameTV()
  
  const hasInsets = insets.top > 0 || insets.bottom > 0 || 
                   insets.left > 0 || insets.right > 0
  
  if (!hasInsets) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: 'rgba(255, 193, 7, 0.9)',
      color: 'black',
      padding: '1rem',
      borderRadius: '0.5rem',
      zIndex: 1000
    }}>
      ⚠️ Non-standard aspect ratio detected<br />
      Content is centered for optimal viewing
    </div>
  )
}
```

### 3. Debug Information

```typescript
function DebugPanel() {
  const { dimension, insets } = useSafeFrameTV()
  
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      fontFamily: 'monospace',
      fontSize: '0.8rem',
      zIndex: 1000
    }}>
      <h4>Safe Frame Debug</h4>
      <div>Size: {dimension.width} × {dimension.height}px</div>
      <div>Scale: {dimension.scaleRatio}%</div>
      <div>Insets: T:{insets.top} R:{insets.right} B:{insets.bottom} L:{insets.left}</div>
      <div>Viewport: {window.innerWidth} × {window.innerHeight}px</div>
    </div>
  )
}
```

### 4. Custom Positioning

```typescript
function FloatingElement() {
  const { insets } = useSafeFrameTV()
  
  return (
    <div style={{
      position: 'fixed',
      // Position relative to safe frame, not viewport
      top: `${insets.top + 20}px`,
      right: `${insets.right + 20}px`,
      background: 'blue',
      color: 'white',
      padding: '1rem',
      borderRadius: '0.5rem'
    }}>
      This element is positioned relative to the safe frame
    </div>
  )
}
```

## Insets Calculation

The insets are automatically calculated based on the viewport dimensions and the 16:9 aspect ratio requirement:

```typescript
// Simplified calculation logic
function calculateInsets(viewportWidth: number, viewportHeight: number) {
  const referenceRatio = 16 / 9
  const currentRatio = viewportWidth / viewportHeight
  
  let safeFrameWidth: number
  let safeFrameHeight: number
  
  if (currentRatio < referenceRatio) {
    // Viewport is taller than 16:9 (e.g., 4:3, portrait)
    safeFrameWidth = viewportWidth
    safeFrameHeight = viewportWidth / referenceRatio
  } else {
    // Viewport is wider than 16:9 (e.g., 21:9, ultrawide)
    safeFrameWidth = viewportHeight * referenceRatio
    safeFrameHeight = viewportHeight
  }
  
  return {
    top: Math.max(0, (viewportHeight - safeFrameHeight) / 2),
    bottom: Math.max(0, (viewportHeight - safeFrameHeight) / 2),
    left: Math.max(0, (viewportWidth - safeFrameWidth) / 2),
    right: Math.max(0, (viewportWidth - safeFrameWidth) / 2)
  }
}
```

## TypeScript Types

```typescript
// Available in the library
export interface SafeFrameInsets {
  top: number
  bottom: number
  left: number
  right: number
}

export interface SafeFrameTVContextType {
  dimension: ScaleResult
  insets: SafeFrameInsets
}

export interface ScaleResult {
  width: number
  height: number
  scaleRatio: number
  insets: SafeFrameInsets
}
```

## Real-world Examples

### Smart TV Scenarios

1. **Samsung 16:9 TV**: `{ top: 0, bottom: 0, left: 0, right: 0 }`
2. **Ultrawide PC Monitor (21:9)**: `{ top: 0, bottom: 0, left: 320, right: 320 }`
3. **iPad in Portrait**: `{ top: 284, bottom: 284, left: 0, right: 0 }`
4. **Phone in Landscape**: `{ top: 0, bottom: 0, left: 100, right: 100 }`

### Use Insets For

- ✅ **Layout decisions** - Adjust grid layouts for different screen shapes
- ✅ **Warning messages** - Inform users about non-standard aspect ratios
- ✅ **Debug information** - Display development info
- ✅ **Custom positioning** - Position elements relative to safe frame
- ✅ **Performance optimization** - Skip rendering in inset areas

### Don't Use Insets For

- ❌ **Manual positioning** - Let the Safe Frame handle centering
- ❌ **Content overflow** - Content should stay within the 80rem × 45rem frame
- ❌ **Animation targets** - Animate within the safe frame, not the insets

## Best Practices

1. **Use for Information Only**: Insets are primarily for informational purposes and layout decisions
2. **Don't Override Centering**: Let the Safe Frame handle automatic centering
3. **Responsive Design**: Use insets to make informed decisions about layout density
4. **Debug Mode**: Show inset information in development mode for testing
5. **Graceful Degradation**: Ensure your app works regardless of inset values

## Testing Different Insets

To test your app with different inset scenarios:

1. **Resize browser window** to different aspect ratios
2. **Use browser dev tools** device emulation
3. **Test on actual devices** with different screen ratios
4. **Use the demo page** provided with the library

The insets feature ensures your Safe Frame TV applications provide consistent user experiences across all display types while giving you the information needed to make smart layout decisions.