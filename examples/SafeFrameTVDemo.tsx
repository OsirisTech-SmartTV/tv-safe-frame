import React, { useState } from 'react'
import SafeFrameTVProvider from '../src/components/SafeFrameTVProvider'
import { useSafeFrameTV } from '../src/hooks/useSafeFrameTV'
import { SAFE_FRAME_CONSTANTS } from '../src/constants/safeFrame'
import { ScaleUtil } from '../src/utils/scale'

// Demo component that shows dimension info
const DimensionInfo: React.FC = () => {
  const { dimension } = useSafeFrameTV()
  
  return (
    <div style={{
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontFamily: 'monospace',
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>📱 Dimension Info</h3>
      <div>Viewport: {ScaleUtil.getRealWidth()} × {ScaleUtil.getRealHeight()}</div>
      <div>Safe Frame: {dimension.width} × {dimension.height}</div>
      <div>Scale Ratio: {dimension.scaleRatio}%</div>
      <div>Aspect Ratio: {SAFE_FRAME_CONSTANTS.aspectRatio.toFixed(3)}</div>
    </div>
  )
}

// Sample content components
const ContentCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    margin: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e5e7eb',
  }}>
    <h2 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontSize: '1.5rem' }}>{title}</h2>
    {children}
  </div>
)

const InteractiveDemo: React.FC = () => {
  const [count, setCount] = useState(0)
  const [bgColor, setBgColor] = useState('#f3f4f6')
  
  const colors = ['#f3f4f6', '#fef3c7', '#fecaca', '#d1fae5', '#ddd6fe']
  
  return (
    <ContentCard title="🎮 Interactive Demo">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Count: {count}
        </button>
        <button
          onClick={() => setBgColor(colors[Math.floor(Math.random() * colors.length)])}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Change Background
        </button>
      </div>
      <div 
        style={{
          padding: '2rem',
          borderRadius: '0.5rem',
          background: bgColor,
          transition: 'background-color 0.3s ease',
          textAlign: 'center',
        }}
      >
        <p>Background changes on button click!</p>
        <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
          This content scales automatically with the safe frame
        </p>
      </div>
    </ContentCard>
  )
}

const GridDemo: React.FC = () => (
  <ContentCard title="📐 Grid Layout Demo">
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(8rem, 1fr))',
      gap: '1rem',
    }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          style={{
            height: '6rem',
            background: `hsl(${i * 45}, 70%, 60%)`,
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem',
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  </ContentCard>
)

const TypographyDemo: React.FC = () => (
  <ContentCard title="📝 Typography Scale Demo">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#1f2937' }}>Heading 1 (2.5rem)</h1>
      <h2 style={{ margin: 0, fontSize: '2rem', color: '#374151' }}>Heading 2 (2rem)</h2>
      <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#4b5563' }}>Heading 3 (1.5rem)</h3>
      <p style={{ margin: 0, fontSize: '1rem', color: '#6b7280', lineHeight: 1.6 }}>
        Regular paragraph text (1rem). This text will scale proportionally with the safe frame. 
        All rem-based measurements maintain their relative proportions across different screen sizes.
      </p>
      <small style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
        Small text (0.875rem) - Perfect for captions and fine print
      </small>
    </div>
  </ContentCard>
)

// Main demo content
const DemoContent: React.FC = () => (
  <div style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: '2rem',
    position: 'relative',
  }}>
    <DimensionInfo />
    
    <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '3rem',
          color: 'white',
          margin: '0 0 1rem 0',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        }}>
          📺 Safe Frame TV Demo
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0,
          maxWidth: '40rem',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Responsive Smart TV interface that scales to maintain 16:9 aspect ratio
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
        gap: '2rem',
      }}>
        <InteractiveDemo />
        <TypographyDemo />
      </div>
      
      <GridDemo />
      
      <ContentCard title="✅ Safe Frame Features">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>🎯 Auto Scaling</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              Automatically scales content to fit any screen while maintaining aspect ratio
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>📱 Responsive</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              Works on Smart TVs, browsers, and any device with different resolutions
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>⚛️ React Ready</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              Modern React hooks and context API for easy integration
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>🔧 TypeScript</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              Full TypeScript support with comprehensive type definitions
            </p>
          </div>
        </div>
      </ContentCard>
    </div>
  </div>
)

// Main App with Provider
export const SafeFrameTVDemo: React.FC = () => (
  <SafeFrameTVProvider debug={true}>
    <DemoContent />
  </SafeFrameTVProvider>
)

export default SafeFrameTVDemo