import App from './App.tsx';
import { initAnonymousAuth } from './firebase';
import { auth } from './firebase';
import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';

initAnonymousAuth()
  .then(() => {
    console.log('currentUser:', auth.currentUser);
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((err) => {
    console.error('Firebase anonymous sign-in failed', err);
  });
