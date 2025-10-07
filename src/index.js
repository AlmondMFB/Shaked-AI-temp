import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App-simple';

// Hide loading spinner
const loading = document.getElementById('loading');
if (loading) {
  loading.style.display = 'none';
}

// Create React root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);