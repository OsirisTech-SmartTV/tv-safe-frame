/**
 * Babel configuration for React 17+ compatibility
 * Supports both new JSX runtime and legacy transform
 */
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        chrome: '53',
        firefox: '78',
        safari: '13',
        edge: '79'
      },
      modules: false,
      loose: true
    }],
    ['@babel/preset-react', {
      runtime: 'automatic', // Use new JSX runtime (React 17+)
      development: process.env.NODE_ENV === 'development'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator'
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript'
      ]
    }
  }
}