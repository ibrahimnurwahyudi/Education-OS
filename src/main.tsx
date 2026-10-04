import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './nexus.css';

// Public entry point: open Education OS directly in Administrator Trial mode.
// Login / sign-up landing is intentionally not shown for the public trial entry.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
