import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PublicWebsite from './components/PublicWebsite';
import './index.css';
import './nexus.css';
import './publicWebsite.css';

const isAppRoute = /\/app(?:\/|$)/.test(window.location.pathname);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isAppRoute ? <App /> : <PublicWebsite />}
  </React.StrictMode>
);
