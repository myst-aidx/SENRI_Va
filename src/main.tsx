import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Enable remote connections in development
if (import.meta.env.DEV) {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
