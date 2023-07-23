/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable no-undef */
if (typeof importScripts === 'function') {
  importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
  importScripts(
    'https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js'
  );

  firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const {
      notification: { title, body },
    } = payload;

    return self.registration.showNotification(title, body);
  });
}
