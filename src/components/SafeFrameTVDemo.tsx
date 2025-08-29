import React, { useState, useEffect } from 'react'
import { SafeFrameTVProvider, useSafeFrameTV } from '../index'

/**
 * Demo component showcasing Safe Frame TV functionality
 */
const SafeFrameTVDemo: React.FC = () => {
  return (
    <SafeFrameTVProvider debug={process.env.NODE_ENV === 'development'}>
      <DemoContent />
    </SafeFrameTVProvider>
  )
}

/**
 * Demo content that uses the safe frame context
 */
const DemoContent: React.FC = () => {
  const { dimension, insets } = useSafeFrameTV()
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  // Update viewport size on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const containerStyle: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    padding: '2rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f2f5',
    color: '#333',
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#1890ff',
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    flex: 1,
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e8e8e8',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1890ff',
    borderBottom: '2px solid #e8e8e8',
    paddingBottom: '0.5rem',
  }

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0.5rem 0',
    padding: '0.5rem',
    backgroundColor: '#fafafa',
    borderRadius: '4px',
  }

  const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#666',
  }

  const valueStyle: React.CSSProperties = {
    color: '#1890ff',
    fontFamily: 'monospace',
  }

  const insetsVisualizationStyle: React.CSSProperties = {
    position: 'relative',
    height: '200px',
    backgroundColor: '#f0f0f0',
    border: '2px dashed #ccc',
    borderRadius: '8px',
    margin: '1rem 0',
  }

  const safeAreaStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${(insets.top / viewportSize.height) * 100}%`,
    left: `${(insets.left / viewportSize.width) * 100}%`,
    right: `${(insets.right / viewportSize.width) * 100}%`,
    bottom: `${(insets.bottom / viewportSize.height) * 100}%`,
    backgroundColor: '#52c41a',
    opacity: 0.3,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  }

  const warningStyle: React.CSSProperties = {
    backgroundColor: '#fff7e6',
    border: '1px solid #ffd591',
    borderRadius: '6px',
    padding: '1rem',
    marginTop: '1rem',
    color: '#d46b08',
  }

  const hasInsets = insets.top > 0 || insets.bottom > 0 || insets.left > 0 || insets.right > 0

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>📺 Safe Frame TV Demo</h1>
      
      <div style={gridStyle}>
        {/* Viewport Information */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>🖥️ Viewport Information</h2>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Current Viewport:</span>
            <span style={valueStyle}>{viewportSize.width} × {viewportSize.height}px</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Aspect Ratio:</span>
            <span style={valueStyle}>{(viewportSize.width / viewportSize.height).toFixed(2)}:1</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Device Pixel Ratio:</span>
            <span style={valueStyle}>{window.devicePixelRatio || 1}</span>
          </div>
        </div>

        {/* Safe Frame Dimensions */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>📐 Safe Frame Dimensions</h2>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Safe Frame Size:</span>
            <span style={valueStyle}>{dimension.width} × {dimension.height}px</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>CSS Size:</span>
            <span style={valueStyle}>80rem × 45rem</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Scale Ratio:</span>
            <span style={valueStyle}>{dimension.scaleRatio}%</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Aspect Ratio:</span>
            <span style={valueStyle}>16:9 (1.78:1)</span>
          </div>
        </div>

        {/* Insets Information */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>📏 Safe Frame Insets</h2>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Top:</span>
            <span style={valueStyle}>{insets.top}px</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Bottom:</span>
            <span style={valueStyle}>{insets.bottom}px</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Left:</span>
            <span style={valueStyle}>{insets.left}px</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Right:</span>
            <span style={valueStyle}>{insets.right}px</span>
          </div>
          
          {hasInsets && (
            <div style={warningStyle}>
              <strong>⚠️ Note:</strong> Your viewport has a different aspect ratio than 16:9. 
              The safe frame is centered with insets to maintain the correct aspect ratio.
            </div>
          )}
        </div>

        {/* Visual Representation */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>🎯 Visual Representation</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Gray area represents viewport, green area represents safe frame:
          </p>
          <div style={insetsVisualizationStyle}>
            <div style={safeAreaStyle}>
              Safe Frame<br />
              80rem × 45rem
            </div>
            {/* Inset labels */}
            {insets.top > 0 && (
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.8rem',
                color: '#666',
              }}>
                {insets.top}px
              </div>
            )}
            {insets.left > 0 && (
              <div style={{
                position: 'absolute',
                left: '5px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.8rem',
                color: '#666',
                writingMode: 'vertical-rl',
              }}>
                {insets.left}px
              </div>
            )}
          </div>
        </div>

        {/* Usage Examples */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>💡 Usage Tips</h2>
          <ul style={{ lineHeight: '1.6', color: '#666' }}>
            <li>Use <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: '3px' }}>rem</code> units for all dimensions within the safe frame</li>
            <li>The safe frame automatically maintains 16:9 aspect ratio</li>
            <li>Insets show you the safe margins from viewport edges</li>
            <li>Font scaling is handled automatically based on viewport size</li>
            <li>All child elements scale proportionally with the safe frame</li>
          </ul>
        </div>

        {/* Component Code Example */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>🔧 Code Example</h2>
          <pre style={{
            backgroundColor: '#f6f8fa',
            padding: '1rem',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '0.85rem',
            lineHeight: '1.4',
          }}>
{`import { SafeFrameTVProvider, useSafeFrameTV } from '@osiris-smarttv/tv-safe-frame'

function App() {
  return (
    <SafeFrameTVProvider>
      <MyTVComponent />
    </SafeFrameTVProvider>
  )
}

function MyTVComponent() {
  const { dimension, insets } = useSafeFrameTV()
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1>My TV App</h1>
      <p>Safe frame: {dimension.width}x{dimension.height}</p>
      <p>Insets: {insets.top}, {insets.right}, {insets.bottom}, {insets.left}</p>
    </div>
  )
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default SafeFrameTVDemo