import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Don't prevent HMR connection errors from being handled by Vite
  if (!event.reason?.message?.includes('vite') && !event.reason?.message?.includes('WebSocket')) {
    event.preventDefault();
  }
});

// Handle Vite HMR connection issues
if (import.meta.hot) {
  import.meta.hot.on('vite:error', (payload) => {
    console.warn('Vite HMR error (this is normal during development):', payload);
  });
}

// Get root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Failed to find the root element');
}

try {
  // Create root and render with error boundary
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  console.log('App initialized successfully');
} catch (error) {
  console.error('Failed to initialize app:', error);
  // Fallback render
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>Failed to load the application. Please refresh the page.</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px;">Refresh Page</button>
    </div>
  `;
}