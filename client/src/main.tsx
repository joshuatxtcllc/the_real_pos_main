import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

// Global error handling with more debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  console.error('Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Don't prevent HMR connection errors from being handled by Vite
  if (!event.reason?.message?.includes('vite') && !event.reason?.message?.includes('WebSocket')) {
    event.preventDefault();
  }
});

// Add timeout to detect if app fails to load
setTimeout(() => {
  const loadingElement = document.querySelector('.loading-fallback');
  if (loadingElement && loadingElement.style.display !== 'none') {
    console.error('App failed to load within 10 seconds - likely JavaScript error');
    loadingElement.innerHTML = `
      <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #dc3545;">App Loading Failed</h2>
        <p>The application failed to load. This could be due to:</p>
        <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
          <li>JavaScript execution error</li>
          <li>Network connectivity issue</li>
          <li>Browser compatibility problem</li>
        </ul>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 10px;">
          Reload Page
        </button>
        <br>
        <small>Check the browser console for error details</small>
      </div>
    `;
  }
}, 10000);

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
  // Create root element if it doesn't exist
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  console.log('Created new root element');
} else {
  console.log('Root element found successfully');
}

try {
  // Get the root element (either existing or newly created)
  const finalRootElement = document.getElementById('root');
  if (!finalRootElement) {
    throw new Error('Could not find or create root element');
  }

  // Create root and render with error boundary
  const root = ReactDOM.createRoot(finalRootElement);
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
  const fallbackElement = document.getElementById('root') || document.body;
  fallbackElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>Failed to load the application. Please refresh the page.</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px;">Refresh Page</button>
      <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px;">
        <strong>Debug Info:</strong><br>
        Error: ${error instanceof Error ? error.message : 'Unknown error'}<br>
        Timestamp: ${new Date().toISOString()}
      </div>
    </div>
  `;
}