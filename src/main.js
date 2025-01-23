import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Enable remote connections in development
if (import.meta.env.DEV) {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });
}
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
