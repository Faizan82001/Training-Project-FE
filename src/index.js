import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { registerServiceWorker } from './utils/firebase';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
const env = {
  REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID:
    process.env.REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID: process.env.REACT_APP_MEASUREMENT_ID,
};

registerServiceWorker(env);
