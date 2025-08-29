# 📺 @osiris-smarttv/tv-safe-frame

> **The Ultimate Smart TV Safe Frame Library for React** 🚀

A modern, production-ready TypeScript library that provides perfect 16:9 safe frame containers for Smart TV applications with automatic scaling, intelligent insets calculation, and seamless React integration.

[![npm version](https://img.shields.io/npm/v/@osiris-smarttv/tv-safe-frame)](https://npmjs.com/package/@osiris-smarttv/tv-safe-frame)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-17%2B-61dafb)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](#)

---

## 🌟 **Why Choose Safe Frame TV?**

Building Smart TV applications is **challenging**. Different screen sizes, aspect ratios, and platforms create inconsistent user experiences. **Safe Frame TV** solves this with:

- 🎯 **Perfect 16:9 aspect ratio** maintained across all devices
- ⚡ **Zero-configuration setup** - works out of the box
- 🔄 **Automatic responsive scaling** using CSS-native rem + font-size
- 📐 **Intelligent insets calculation** for non-standard displays
- 🎮 **Smart TV optimized** for Samsung, LG, Sony, and more
- 🚀 **Production-ready** with TypeScript and comprehensive testing

---

## 🎯 **Core Features**

| Feature | Description | Benefit |
|---------|-------------|---------|
| **80rem × 45rem Safe Frame** | Perfect 16:9 aspect ratio container | Consistent layout across all screens |
| **Automatic Scaling** | CSS-native rem + font-size scaling | Hardware-accelerated performance |
| **Insets Calculation** | Distance from safe frame to viewport edges | Perfect positioning awareness |
| **React 17+ Support** | Modern JSX runtime, hooks, TypeScript | Developer-friendly integration |
| **Smart TV Optimized** | Chrome 53+, Samsung, LG, Sony TVs | Maximum compatibility |
| **Zero Dependencies** | Lightweight, no external dependencies | Fast loading, small bundle |
| **TypeScript Native** | Complete type safety and IntelliSense | Better development experience |
| **Performance Focused** | CSS-native scaling, hardware acceleration | Smooth 60fps animations |

---

## � **Installation & Setup**

### Package Installation

Choose your preferred package manager:

```bash
# npm
npm install @osiris-smarttv/tv-safe-frame

# yarn  
yarn add @osiris-smarttv/tv-safe-frame

# pnpm
pnpm add @osiris-smarttv/tv-safe-frame
```

### TypeScript Configuration

The library is written in TypeScript and includes complete type definitions. No additional `@types` packages needed!

---

## ⚡ **Quick Start Guide**

Get your Smart TV app running with **perfect 16:9 scaling** in just **3 steps**:

### Step 1: Wrap Your App

```tsx
import React from 'react';
import { SafeFrameTVProvider } from '@osiris-smarttv/tv-safe-frame';

function App() {
  return (
    <SafeFrameTVProvider>
      <MyTVInterface />
    </SafeFrameTVProvider>
  );
}
```

### Step 2: Use the Hook

```tsx
import { useSafeFrameTV } from '@osiris-smarttv/tv-safe-frame';

function MyTVInterface() {
  const { dimension, insets } = useSafeFrameTV();
  
  return (
    <div style={{ 
      width: `${dimension.width}px`, 
      height: `${dimension.height}px`,
      backgroundColor: '#000',
      color: 'white',
      padding: '2rem'
    }}>
      <h1>🎮 My Smart TV App</h1>
      <div>
        <p>📐 Safe Frame: {dimension.width} × {dimension.height}px</p>
        <p>⚡ Scale: {dimension.scaleRatio}%</p>
        <p>📍 Position: {insets.left}px from left, {insets.top}px from top</p>
      </div>
    </div>
  );
}
```

### Step 3: Enjoy Perfect Scaling! 

**✨ That's it!** Your app now automatically:
- 🎯 Maintains perfect 16:9 aspect ratio on any screen
- 📱 Scales responsively using CSS-native rem + font-size
- 📐 Provides viewport positioning data via insets
- 🚀 Delivers 60fps performance with hardware acceleration

---

## � **Understanding Safe Frame Insets**

**Insets** are the key to building responsive Smart TV interfaces. They represent the **distance from your 80rem × 45rem safe frame to the viewport edges**, giving you precise positioning data for different screen shapes.

### Why Insets Matter

Different Smart TVs and displays have varying aspect ratios. Your app needs to adapt:

- **16:9 Standard TVs** → No insets, full screen usage
- **21:9 Ultra-wide displays** → Horizontal insets, center your content
- **4:3 Legacy displays** → Vertical insets, adjust vertical spacing

### Visual Examples

#### **Standard 16:9 Display**

```text
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │  
│ │        Safe Frame               │ │
│ │        80rem × 45rem            │ │  
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Insets:** `{ top: 0, bottom: 0, left: 0, right: 0 }`  
**Behavior:** Perfect fit, no adjustment needed

#### **Ultra-wide Display (21:9)**

```text
┌─────────────────────────────────────────────────┐
│ ███ ┌─────────────────────────┐ ███             │
│ ███ │      Safe Frame         │ ███             │
│ ███ │      80rem × 45rem      │ ███             │
│ ███ └─────────────────────────┘ ███             │
└─────────────────────────────────────────────────┘
```

**Insets:** `{ top: 0, bottom: 0, left: 320, right: 320 }`  
**Behavior:** Content centered with black bars on sides

### Practical Usage

```tsx
function AdaptiveLayout() {
  const { insets } = useSafeFrameTV();
  
  // Detect display type
  const isUltrawide = insets.left > 100 || insets.right > 100;
  const isTall = insets.top > 100 || insets.bottom > 100;
  
  // Adapt your layout accordingly
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isUltrawide ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
      gap: isUltrawide ? '2rem' : '1rem'
    }}>
      {/* Your content adapts automatically */}
    </div>
  );
}
```

---

## 🎮 **Complete API Reference**

### 🔧 SafeFrameTVProvider

The main provider component that enables safe frame functionality throughout your app.

```tsx
interface SafeFrameTVProviderProps {
  children: ReactNode;              // Your app content
  containerStyle?: CSSProperties;   // Optional container styling
  debug?: boolean;                  // Enable debug logging (development)
}

// Usage
<SafeFrameTVProvider debug={process.env.NODE_ENV === 'development'}>
  <App />
</SafeFrameTVProvider>
```

**Key Features:**
- 🔄 Automatically handles window resize events
- 📐 Calculates and provides real-time insets
- ⚡ Optimized for 60fps performance
- 🎯 Centers content with perfect 16:9 aspect ratio

### 🎣 useSafeFrameTV Hook

The primary hook for accessing safe frame data in your components.

```tsx
interface SafeFrameTVReturn {
  dimension: {
    width: number;      // Safe frame width in pixels (e.g., 1280)
    height: number;     // Safe frame height in pixels (e.g., 720)  
    scaleRatio: number; // Font scale percentage (e.g., 66.67)
  };
  insets: {
    top: number;        // Distance from top edge in pixels
    bottom: number;     // Distance from bottom edge in pixels
    left: number;       // Distance from left edge in pixels
    right: number;      // Distance from right edge in pixels
  };
}

// Usage example
function Component() {
  const { dimension, insets } = useSafeFrameTV();
  
  // Use dimension for sizing
  const containerStyle = {
    width: `${dimension.width}px`,
    height: `${dimension.height}px`
  };
  
  // Use insets for positioning decisions
  const isUltrawide = insets.left > 0 || insets.right > 0;
  
  return <div style={containerStyle}>Content</div>;
}
```

### ⚙️ Utility Functions

Direct access to scaling calculations and viewport information.

```tsx
import { ScaleUtil, getRealWidth, getRealHeight } from '@osiris-smarttv/tv-safe-frame';

// Get current viewport dimensions
const viewportWidth = getRealWidth();    // Real viewport width in px
const viewportHeight = getRealHeight();  // Real viewport height in px

// Access the scale utility directly
const scaleInfo = ScaleUtil.getScaleInfo();
console.log(scaleInfo);
// Output: {
//   width: 1280,
//   height: 720,
//   scaleRatio: 66.67,
//   insets: { top: 0, bottom: 0, left: 320, right: 320 }
// }

// Get just the insets
const currentInsets = ScaleUtil.calculateInsets();
```

### 📊 TypeScript Interfaces

Complete type definitions for full IntelliSense support.

```tsx
// Core safe frame insets interface
interface SafeFrameInsets {
  top: number;    // Pixels from safe frame to top edge
  bottom: number; // Pixels from safe frame to bottom edge  
  left: number;   // Pixels from safe frame to left edge
  right: number;  // Pixels from safe frame to right edge
}

// Main context type returned by useSafeFrameTV
interface SafeFrameTVContextType {
  dimension: {
    width: number;      // Safe frame width in pixels
    height: number;     // Safe frame height in pixels
    scaleRatio: number; // Current font-size scale percentage
  };
  insets: SafeFrameInsets; // Viewport positioning data
}

// Provider props interface
interface SafeFrameTVProviderProps {
  children: ReactNode;
  containerStyle?: React.CSSProperties;
  debug?: boolean;
}
```

---

## 🎨 **Advanced Usage Examples**

### 📱 Responsive Grid Layout

Create adaptive layouts that respond to different screen shapes:

```tsx
function ResponsiveMovieGrid() {
  const { insets } = useSafeFrameTV();
  
  // Detect display characteristics
  const isUltrawide = insets.left > 100 || insets.right > 100;
  const isTall = insets.top > 100 || insets.bottom > 100;
  
  // Adaptive grid configuration
  const gridConfig = {
    columns: isUltrawide ? 4 : isTall ? 2 : 3,
    rows: isUltrawide ? 2 : isTall ? 4 : 3,
    gap: isUltrawide ? '1.5rem' : '1rem'
  };
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
      gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
      gap: gridConfig.gap,
      height: '100%',
      padding: '2rem'
    }}>
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
```

### 🐛 Development Debug Panel

Add a comprehensive debug overlay for development:

```tsx
function SafeFrameDebugPanel() {
  const { dimension, insets } = useSafeFrameTV();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  const totalWidth = dimension.width + insets.left + insets.right;
  const totalHeight = dimension.height + insets.top + insets.bottom;
  const aspectRatio = (totalWidth / totalHeight).toFixed(2);
  
  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: 'rgba(0, 0, 0, 0.85)',
      color: '#00ff00',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      fontFamily: 'Courier New, monospace',
      fontSize: '0.75rem',
      lineHeight: '1.4',
      border: '1px solid #333',
      zIndex: 9999
    }}>
      <h4 style={{ margin: '0 0 1rem 0', color: '#ffff00' }}>
        🔍 Safe Frame Debug
      </h4>
      
      <div><strong>Safe Frame:</strong> {dimension.width} × {dimension.height}px</div>
      <div><strong>Scale Ratio:</strong> {dimension.scaleRatio}%</div>
      <div><strong>Viewport:</strong> {totalWidth} × {totalHeight}px</div>
      <div><strong>Aspect Ratio:</strong> {aspectRatio}:1</div>
      
      <hr style={{ margin: '1rem 0', border: '1px solid #333' }} />
      
      <div><strong>Insets:</strong></div>
      <div style={{ marginLeft: '1rem' }}>
        <div>Top: {insets.top}px</div>
        <div>Right: {insets.right}px</div>
        <div>Bottom: {insets.bottom}px</div>
        <div>Left: {insets.left}px</div>
      </div>
      
      {(insets.left > 0 || insets.right > 0) && (
        <div style={{ color: '#ff8800', marginTop: '0.5rem' }}>
          ⚠️ Ultra-wide detected
        </div>
      )}
      
      {(insets.top > 0 || insets.bottom > 0) && (
        <div style={{ color: '#ff8800', marginTop: '0.5rem' }}>
          ⚠️ Tall display detected
        </div>
      )}
    </div>
  );
}
```

### 🎯 Smart Positioning Hook

Create a custom hook for intelligent component positioning:

```tsx
function useSmartPosition() {
  const { insets } = useSafeFrameTV();
  
  return {
    // Check if we have extra space
    hasHorizontalSpace: insets.left > 50 || insets.right > 50,
    hasVerticalSpace: insets.top > 50 || insets.bottom > 50,
    
    // Get positioning hints
    preferredSidebar: insets.left > insets.right ? 'left' : 'right',
    preferredHeader: insets.top > insets.bottom ? 'top' : 'bottom',
    
    // Helper functions
    shouldUseSidebar: () => insets.left > 200 || insets.right > 200,
    shouldUseHeader: () => insets.top > 100 || insets.bottom > 100,
    
    // Get safe positioning
    getSafeMargin: () => ({
      top: Math.min(insets.top, 50),
      right: Math.min(insets.right, 50),
      bottom: Math.min(insets.bottom, 50),
      left: Math.min(insets.left, 50)
    })
  };
}

// Usage in component
function SmartLayout() {
  const { shouldUseSidebar, getSafeMargin } = useSmartPosition();
  const safeMargin = getSafeMargin();
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: shouldUseSidebar() ? 'row' : 'column',
      margin: `${safeMargin.top}px ${safeMargin.right}px ${safeMargin.bottom}px ${safeMargin.left}px`
    }}>
      <Sidebar />
      <MainContent />
    </div>
  );
}
```

### 🔄 Dynamic Font Scaling

Implement custom font scaling based on viewport size:

```tsx
function useDynamicFontSize(baseSize: number = 1) {
  const { dimension } = useSafeFrameTV();
  
  // Calculate optimal font size based on safe frame
  const scaledSize = useMemo(() => {
    const baseWidth = 1280; // Base safe frame width
    const scaleFactor = dimension.width / baseWidth;
    return baseSize * scaleFactor;
  }, [dimension.width, baseSize]);
  
  return {
    fontSize: `${scaledSize}rem`,
    lineHeight: scaledSize * 1.5
  };
}

// Usage
function ResponsiveText({ children }: { children: React.ReactNode }) {
  const textStyle = useDynamicFontSize(1.2);
  
  return <p style={textStyle}>{children}</p>;
}
```

---

## 🔬 **How It Works**

The library uses a sophisticated approach to achieve perfect 16:9 scaling:

### 🎯 **Core Architecture**

1. **Fixed Safe Frame Container**: 80rem × 45rem container maintains perfect 16:9 aspect ratio
2. **Dynamic Font Scaling**: HTML `font-size` automatically adjusted based on viewport dimensions
3. **CSS-Native Centering**: Container centered using `margin: auto` for optimal performance
4. **Real-time Insets**: Distance calculations from safe frame edges to viewport boundaries
5. **Hardware Acceleration**: CSS-only scaling leverages GPU acceleration for 60fps performance

### ⚙️ **Technical Implementation**

```typescript
// Simplified scaling algorithm
const calculateScale = (viewportWidth: number, viewportHeight: number) => {
  const targetWidth = 80; // rem
  const targetHeight = 45; // rem
  const targetRatio = targetWidth / targetHeight; // 16:9
  
  const scaleX = viewportWidth / targetWidth;
  const scaleY = viewportHeight / targetHeight;
  const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio
  
  // Set HTML font-size for rem scaling
  document.documentElement.style.fontSize = `${scale}px`;
  
  return {
    scale,
    insets: calculateInsets(viewportWidth, viewportHeight, scale)
  };
};
```

---

## 🌐 **Platform Compatibility**

### **React Support**

- ✅ **React 17+** - Full support with automatic JSX runtime
- ✅ **React 18+** - All modern features supported  
- 🔄 **React 16** - Legacy support with classic JSX runtime

### **Browser Support**

- ✅ **Chromium 53+** (2016+) - Samsung, LG, Sony Smart TVs
- ✅ **Modern browsers** - Chrome, Firefox, Safari, Edge
- 🔧 **Automatic polyfills** for older Smart TV browsers

### **Smart TV Platforms**

| Platform | Version | Status | Notes |
|----------|---------|--------|-------|
| **Samsung Tizen** | 2016+ | ✅ Full Support | Chromium 53+ |
| **LG webOS** | 3.0+ | ✅ Full Support | Chromium 53+ |
| **Sony Android TV** | 7.0+ | ✅ Full Support | Chrome 61+ |
| **Amazon Fire TV** | 2017+ | ✅ Full Support | Chromium 59+ |
| **Apple tvOS** | Safari-based | 🔄 Limited | CSS limitations |

See our [Platform Compatibility Guide](./docs/Platform-Usage.md) for detailed implementation notes.

---

## 🧪 **Testing & Development**

### **Running Tests**

```bash
# Install dependencies
npm install

# Run test suite
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- SafeFrameTVProvider.test.tsx
```

### **Development Workflow**

```bash
# Start development server with hot reload
npm run dev

# Build library for production
npm run build

# Run TypeScript compiler check
npm run type-check

# Run linting
npm run lint

# Format code with Prettier
npm run format
```

### **Building Demo**

```bash
# Build and serve demo locally
npm run build
npm run demo

# Open index.html in your browser
# Test different viewport sizes and aspect ratios
```

---

## 📚 **Documentation & Resources**

### **Complete Guides**

- 📐 **[Safe Frame Insets Guide](./docs/Safe-Frame-Insets.md)** - Complete insets documentation with visual examples
- ⚛️ **[React 17+ Compatibility](./docs/React17-Chromium53-Compatibility.md)** - Browser compatibility and React integration
- 🎮 **[Smart TV Platform Guide](./docs/Platform-Usage.md)** - Platform-specific implementation details

### **Interactive Demo**

Open `index.html` in your browser to experience:
- ✨ Real-time scaling visualization
- 📊 Interactive insets display  
- 🎯 Different aspect ratio simulations
- 🔧 Debug information overlay

### **Example Projects**

```bash
# Clone example implementations
git clone https://github.com/osiris-smarttv/tv-safe-frame-examples
cd tv-safe-frame-examples

# See practical implementations for:
# - Netflix-style movie grid
# - Smart TV navigation menu  
# - Adaptive video player controls
# - Multi-screen dashboard layouts
```

---

## 🤝 **Contributing**

We welcome contributions! Here's how to get started:

### **Development Setup**

```bash
# Fork and clone the repository
git clone https://github.com/your-username/tv-safe-frame.git
cd tv-safe-frame

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-amazing-feature

# Start development
npm run dev
```

### **Contribution Guidelines**

1. 🔧 **Make your changes** - Add features, fix bugs, improve docs
2. ✅ **Add tests** - Ensure your changes are covered by tests
3. 🧹 **Run quality checks** - `npm run lint` and `npm test`
4. 📝 **Update documentation** - Keep docs in sync with changes
5. 🚀 **Submit a pull request** - Describe your changes clearly

### **Code Standards**

- 📝 **TypeScript** - All code must be typed
- 🧪 **Testing** - Minimum 90% test coverage
- 🎨 **Formatting** - Use Prettier and ESLint
- 📖 **Documentation** - Update relevant docs

---

## 📄 **License**

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🆘 **Support & Community**

### **Get Help**

- 📖 **Documentation** - Check our comprehensive guides
- 🐛 **Bug Reports** - [Open an issue](https://github.com/osiris-smarttv/tv-safe-frame/issues)
- 💡 **Feature Requests** - Share your ideas with us
- 💬 **Discussions** - Join our community discussions

### **Professional Support**

For enterprise support, consulting, or custom implementations, contact us at:
**thanhcongns94@gmail.com**

---

## 🌟 **Acknowledgments**

Special thanks to:
- The React team for the amazing framework
- Smart TV manufacturers for their platform documentation  
- The open-source community for feedback and contributions
- Early adopters who helped shape this library

---

**Made with ❤️ for the Smart TV developer community**

*Building better TV experiences, one pixel at a time* 📺✨
 
 
