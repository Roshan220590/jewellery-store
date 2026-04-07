import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('main.jsx: Starting app initialization...');

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    console.log('ErrorBoundary: Constructor called');
  }
  static getDerivedStateFromError(error) {
    console.error('ErrorBoundary: Caught error:', error);
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary: componentDidCatch:', error, errorInfo);
  }
  render() {
    console.log('ErrorBoundary: Rendering, hasError:', this.state.hasError);
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'monospace', background: '#1a0533', color: '#ff6b6b', minHeight: '100vh' }}>
          <h2 style={{ color: '#FFD700', marginBottom: '16px' }}>⚠️ App Error:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#2d0764', padding: '20px', borderRadius: '8px', color: '#ff9999' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

console.log('main.jsx: Creating root element...');

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  console.log('main.jsx: Root created, rendering app...');
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
  console.log('main.jsx: App rendered successfully');
} catch (error) {
  console.error('main.jsx: Error during render:', error);
  document.body.innerHTML = `
    <div style="padding: 40px; font-family: monospace; background: #1a0533; color: #ff6b6b; min-height: 100vh;">
      <h2 style="color: #FFD700; margin-bottom: 16px;">⚠️ Render Error:</h2>
      <pre style="white-space: pre-wrap; word-break: break-word; background: #2d0764; padding: 20px; border-radius: 8px; color: #ff9999;">
        ${error.toString()}
        ${error.stack}
      </pre>
    </div>
  `;
}
