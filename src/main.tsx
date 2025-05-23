import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { initAnonymousAuth } from './firebase';
import './index.css';

initAnonymousAuth()
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((err) => {
    console.error('Firebase anonymous sign-in failed', err);
  });
